import type {Decorator} from '@storybook/react-vite'
import React, {startTransition, StrictMode} from 'react'
import {createRoot, type Root} from 'react-dom/client'

/**
 * Performance Monitoring for PageLayout Stories
 *
 * Architecture:
 * - PerformanceProvider: Wraps stories and manages all performance metrics.
 *   The monitor UI is rendered in a SEPARATE React root, completely isolated
 *   from the profiled component tree. This ensures monitor updates never
 *   compete with or affect the measured component's render cycle.
 *
 * - ProfiledComponent: Wraps the actual story content with React.Profiler
 *   to track React render performance. Only children of ProfiledComponent
 *   are counted in render metrics.
 *
 * Usage in stories:
 * ```
 * decorators: [
 *   Story => (
 *     <PerformanceProvider>
 *       <ProfiledComponent id="PageLayout">
 *         <Story />
 *       </ProfiledComponent>
 *     </PerformanceProvider>
 *   ),
 * ]
 * ```
 *
 * The provider automatically shows the performance monitor panel.
 * Use showMonitor={false} to hide it if needed.
 */

// Formatters with fixed decimal places to prevent layout shifts
const fpsFormatter = new Intl.NumberFormat('en-US', {minimumIntegerDigits: 2, maximumFractionDigits: 0})
const msFormatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const mbFormatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const numberFormatter = new Intl.NumberFormat('en-US')

// Position options for the performance monitor
export type MonitorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

// ============================================================================
// Performance Metrics Types
// ============================================================================

/**
 * Performance metrics collected by the monitor.
 *
 * ## Metric Categories
 *
 * ### Frame Timing
 * Core metrics for animation smoothness. Target: 60fps (16.67ms/frame).
 * - `fps`: Frames per second (rolling average over ~60 frames)
 * - `frameTime`: Average time between frames in milliseconds
 * - `maxFrameTime`: Highest frame time observed (with decay)
 * - `droppedFrames`: Count of frames that took >2x expected time
 *
 * ### Input Responsiveness
 * Measures delay between user input and visual response.
 * - `inputLatency`: Time from pointer event to next animation frame (avg)
 * - `maxInputLatency`: Highest input latency observed (with decay)
 *
 * ### Paint Timing
 * Measures browser's rendering/compositing time using double-RAF technique.
 * - `paintTime`: Average time for browser to paint changes
 * - `maxPaintTime`: Highest paint time observed (with decay)
 * - `paintCycles`: Total number of paint measurements taken
 *
 * ### Main Thread Blocking
 * Tracks JavaScript execution that blocks the main thread.
 * - `longTasks`: Count of tasks >50ms (via PerformanceObserver)
 * - `longestTask`: Duration of the longest task in ms
 * - `slowEvents`: Count of events with processing time >50ms
 *
 * ### Layout Metrics
 * Tracks style changes and potential layout thrashing.
 * - `styleWrites`: Count of inline style attribute mutations
 * - `thrashingScore`: Estimated severity of forced synchronous reflows
 * - `layoutShiftScore`: Cumulative Layout Shift (CLS) score
 * - `layoutShiftCount`: Number of layout shift events
 *
 * ### Memory Metrics (Chrome only)
 * Tracks JavaScript heap usage for memory leak detection.
 * - `memoryUsedMB`: Current JS heap size in megabytes
 * - `memoryDeltaMB`: Change since start/reset (positive = growth)
 *
 * ### Interaction Metrics (INP)
 * Tracks click and keyboard interaction responsiveness.
 * - `interactionCount`: Total discrete interactions tracked
 * - `inpMs`: Interaction to Next Paint - worst interaction latency
 * - `avgInteractionMs`: Average interaction latency
 *
 * ### React Profiler Metrics
 * Data from React.Profiler for render performance analysis.
 * - `reactMountCount`: Number of mount phase renders
 * - `reactMountDuration`: Total time spent in mount renders
 * - `reactPostMountUpdateCount`: Re-renders after initial mount
 * - `reactPostMountMaxDuration`: Slowest post-mount render
 * - `renderCascades`: Multiple commits in single frame (state batching issue)
 * - `maxRendersPerFrame`: Worst-case renders in one frame
 *
 * ## Thrashing Detection
 *
 * Layout thrashing occurs when JavaScript reads layout properties (offsetHeight,
 * getBoundingClientRect, etc.) after modifying styles, forcing the browser to
 * perform synchronous layout calculations. This causes janky animations.
 *
 * Since we can't directly detect layout reads, we use two heuristic strategies:
 *
 * 1. **Spike Detection**: Identifies sudden frame time jumps relative to baseline.
 *    A spike is flagged when frame time is 2x baseline AND 8ms+ above it.
 *    This catches intermittent thrashing that causes visible "jerks".
 *
 * 2. **Sustained Detection**: Tracks 3+ consecutive frames >24ms with style writes.
 *    This catches consistent thrashing that wouldn't appear as individual spikes.
 *
 * The thrashingScore accumulates severity points based on how much frames exceed
 * expected timing. A score of 0 with the ✓ indicator means no thrashing detected.
 */
export interface PerformanceMetrics {
  // ─────────────────────────────────────────────────────────────────────────
  // DOM Metrics
  // ─────────────────────────────────────────────────────────────────────────

  /** Number of DOM elements within the profiled component tree. Null if not yet measured. */
  domElements: number | null

  // ─────────────────────────────────────────────────────────────────────────
  // Frame Timing - Core animation smoothness metrics
  // ─────────────────────────────────────────────────────────────────────────

  /** Frames per second, calculated from rolling average of frame times. Target: 60. */
  fps: number

  /** Average frame time in milliseconds. Target: ≤16.67ms for 60fps. */
  frameTime: number

  /** Maximum frame time observed, with gradual decay when frames improve. */
  maxFrameTime: number

  /** Count of frames that took longer than 2x the expected frame time (~33ms). */
  droppedFrames: number

  // ─────────────────────────────────────────────────────────────────────────
  // Input Responsiveness - User interaction latency
  // ─────────────────────────────────────────────────────────────────────────

  /** Average time (ms) from pointer event timestamp to next animation frame. Target: ≤16ms. */
  inputLatency: number

  /** Maximum input latency observed, with gradual decay. Warning threshold: >50ms. */
  maxInputLatency: number

  // ─────────────────────────────────────────────────────────────────────────
  // Paint Timing - Browser rendering performance
  // ─────────────────────────────────────────────────────────────────────────

  /** Average paint/composite time measured via double-RAF technique. Target: ≤16ms. */
  paintTime: number

  /** Maximum paint time observed, with gradual decay. */
  maxPaintTime: number

  /** Total number of paint cycles measured (for debugging). */
  paintCycles: number

  // ─────────────────────────────────────────────────────────────────────────
  // Main Thread Blocking - JavaScript execution impact
  // ─────────────────────────────────────────────────────────────────────────

  /** Count of Long Tasks (>50ms) detected via PerformanceObserver. Target: 0. */
  longTasks: number

  /** Duration (ms) of the longest task observed. Warning threshold: >100ms. */
  longestTask: number

  /** Count of slow event handlers (processing time >50ms). */
  slowEvents: number

  // ─────────────────────────────────────────────────────────────────────────
  // Layout Metrics - Style changes and thrashing detection
  // ─────────────────────────────────────────────────────────────────────────

  /** Count of inline style attribute mutations observed via MutationObserver. */
  styleWrites: number

  /**
   * Count of severe frame blocking events (>50ms) near style writes.
   * Indicates potential layout thrashing - forced synchronous layout.
   * These are major stalls that completely block the main thread.
   */
  thrashingScore: number

  /**
   * Count of jitter events - unexpected spikes causing visible hitching during drag.
   * Detected from three sources:
   *
   * 1. **Input latency jitter**: Pointer-to-RAF time spikes (>3x baseline, >30ms jump, >50ms)
   * 2. **Frame time jitter**: Frame-to-frame time spikes (>3x baseline, >20ms jump, >40ms)
   * 3. **Paint time jitter**: Paint duration spikes (>3x baseline, >20ms jump, >35ms)
   *
   * Thresholds are set high to avoid false positives from normal drag variance.
   * Only catches obvious hitches that would be visible to users.
   */
  inputJitter: number

  // ─────────────────────────────────────────────────────────────────────────
  // React Profiler Metrics - Component render performance
  // ─────────────────────────────────────────────────────────────────────────

  /** Total number of React renders (mount + updates) recorded by Profiler. */
  reactRenderCount: number

  /** Sum of all actualDuration values from React Profiler. */
  reactTotalActualDuration: number

  /** Maximum actualDuration from any single render. */
  reactMaxActualDuration: number

  /** Most recent render's actualDuration. */
  reactLastActualDuration: number

  /**
   * Latest baseDuration from React Profiler.
   * Represents worst-case render time if no memoization was applied.
   * Useful for identifying optimization opportunities.
   */
  reactBaseDuration: number

  /** Count of mount-phase renders (initial component mounting). */
  reactMountCount: number

  /** Count of update-phase renders (re-renders after mount). */
  reactUpdateCount: number

  // ─────────────────────────────────────────────────────────────────────────
  // Post-Mount Metrics - Interaction-triggered render performance
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Maximum render duration for updates AFTER initial mount.
   * This isolates interaction performance from mount overhead.
   * Target: ≤8ms for smooth interactions, ≤16ms acceptable, >16ms needs optimization.
   */
  reactPostMountMaxDuration: number

  /**
   * Count of re-renders after initial mount.
   * High counts during drag operations may indicate unnecessary re-renders.
   * Ideal for drag resize: 0 (pure CSS/DOM manipulation).
   */
  reactPostMountUpdateCount: number

  /**
   * Total duration of all mount-phase renders.
   * Preserved across resets to maintain historical mount performance data.
   */
  reactMountDuration: number

  // ─────────────────────────────────────────────────────────────────────────
  // Memory Metrics (Chrome only)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Current JS heap size in MB. Only available in Chrome.
   * Null if performance.memory is not supported.
   */
  memoryUsedMB: number | null

  /**
   * Peak JS heap size observed since start/reset, in MB.
   * Useful for identifying memory spikes during interactions.
   */
  peakMemoryMB: number | null

  /**
   * Change in heap size since monitoring started or last reset, in MB.
   * Positive values indicate memory growth; sustained growth may indicate leaks.
   */
  memoryDeltaMB: number | null

  // ─────────────────────────────────────────────────────────────────────────
  // Layout Shift (CLS) - Visual stability
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Cumulative Layout Shift score. Measures unexpected layout movement.
   * Target: <0.1 (good), <0.25 (needs improvement), >0.25 (poor).
   * Critical for drag/resize operations where elements should move predictably.
   */
  layoutShiftScore: number

  /** Number of individual layout shift events observed. */
  layoutShiftCount: number

  // ─────────────────────────────────────────────────────────────────────────
  // Interaction Metrics - Click/Keyboard responsiveness
  // ─────────────────────────────────────────────────────────────────────────

  /** Total number of discrete interactions (clicks, key presses) tracked. */
  interactionCount: number

  /**
   * Interaction to Next Paint (INP) - worst interaction latency.
   * Measures full delay from interaction to visual update.
   * Target: ≤200ms (good), ≤500ms (needs improvement), >500ms (poor).
   */
  inpMs: number

  /**
   * Average interaction latency across all tracked interactions.
   * Lower is better; helps identify consistent vs sporadic slowness.
   */
  avgInteractionMs: number

  // ─────────────────────────────────────────────────────────────────────────
  // Re-render Cascade Detection
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Count of nested updates - state updates triggered during React's commit phase.
   * Detected natively by React Profiler as 'nested-update' phase.
   * Common causes: setState in useLayoutEffect, setState during render.
   * Target: 0 during interactions.
   */
  renderCascades: number

  /**
   * @deprecated No longer tracked. Keeping for interface compatibility.
   */
  maxRendersPerFrame: number

  // ─────────────────────────────────────────────────────────────────────────
  // Sparkline History - Rolling data for trend visualization
  // ─────────────────────────────────────────────────────────────────────────

  /** Rolling FPS values for sparkline (last 30 samples). */
  fpsHistory: number[]

  /** Rolling frame time values for sparkline (last 30 samples). */
  frameTimeHistory: number[]

  /** Rolling memory values for sparkline (last 30 samples, Chrome only). */
  memoryHistory: number[]
}

// ============================================================================
// Tiny Stores - One per metric group
// ============================================================================

/**
 * Multiple tiny stores instead of one big store with selectors.
 * Each component subscribes to exactly the store(s) it needs.
 *
 * Benefits:
 * - No selectors, no shallowEqual, no ref caching needed
 * - Components only re-render when their store updates
 * - Simpler mental model: one store = one concern
 * - Store references are stable (setState replaces state object)
 */

// ─── Store Types ─────────────────────────────────────────────────────────────

interface FrameMetrics {
  fps: number
  frameTime: number
  maxFrameTime: number
  fpsHistory: number[]
  frameTimeHistory: number[]
}

interface InputMetrics {
  inputLatency: number
  maxInputLatency: number
  paintTime: number
  maxPaintTime: number
}

interface TaskMetrics {
  longTasks: number
  longestTask: number
  droppedFrames: number
}

interface LayoutMetrics {
  styleWrites: number
  thrashingScore: number
  inputJitter: number
  layoutShiftScore: number
  layoutShiftCount: number
}

interface InteractionMetrics {
  interactionCount: number
  inpMs: number
}

interface ReactMetrics {
  reactMountCount: number
  reactMountDuration: number
  reactRenderCount: number
  reactPostMountUpdateCount: number
  reactPostMountMaxDuration: number
  renderCascades: number
}

interface MemoryMetrics {
  memoryUsedMB: number | null
  memoryDeltaMB: number | null
  peakMemoryMB: number | null
  memoryHistory: number[]
}

interface DomMetrics {
  domElements: number | null
}

// ─── Generic Store Factory ───────────────────────────────────────────────────

type Listener = () => void

interface Store<T> {
  getState: () => T
  setState: (next: T) => void
  /** Only updates if values changed (shallow comparison). Returns true if updated. */
  setStateIfChanged: (next: T) => boolean
  subscribe: (listener: Listener) => () => void
}

/** Shallow compare two objects - returns true if equal */
function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (a[key] !== b[key]) return false
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
function createStore<T extends {}>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<Listener>()

  const notify = () => {
    for (const listener of listeners) {
      listener()
    }
  }

  return {
    getState: () => state,
    setState: (next: T) => {
      state = next
      notify()
    },
    setStateIfChanged: (next: T) => {
      if (shallowEqual(state, next)) return false
      state = next
      notify()
      return true
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

/**
 * Hook to subscribe to a store. Returns the current state.
 * Re-renders only when setState is called on this specific store.
 */
function useStore<T>(store: Store<T>): T {
  return React.useSyncExternalStore(store.subscribe, store.getState, store.getState)
}

// ─── All Stores Container ────────────────────────────────────────────────────

interface MetricStores {
  frame: Store<FrameMetrics>
  input: Store<InputMetrics>
  tasks: Store<TaskMetrics>
  layout: Store<LayoutMetrics>
  interactions: Store<InteractionMetrics>
  react: Store<ReactMetrics>
  memory: Store<MemoryMetrics>
  dom: Store<DomMetrics>
}

function createAllStores(): MetricStores {
  return {
    frame: createStore<FrameMetrics>({
      fps: 0,
      frameTime: 0,
      maxFrameTime: 0,
      fpsHistory: [],
      frameTimeHistory: [],
    }),
    input: createStore<InputMetrics>({
      inputLatency: 0,
      maxInputLatency: 0,
      paintTime: 0,
      maxPaintTime: 0,
    }),
    tasks: createStore<TaskMetrics>({
      longTasks: 0,
      longestTask: 0,
      droppedFrames: 0,
    }),
    layout: createStore<LayoutMetrics>({
      styleWrites: 0,
      thrashingScore: 0,
      inputJitter: 0,
      layoutShiftScore: 0,
      layoutShiftCount: 0,
    }),
    interactions: createStore<InteractionMetrics>({
      interactionCount: 0,
      inpMs: 0,
    }),
    react: createStore<ReactMetrics>({
      reactMountCount: 0,
      reactMountDuration: 0,
      reactRenderCount: 0,
      reactPostMountUpdateCount: 0,
      reactPostMountMaxDuration: 0,
      renderCascades: 0,
    }),
    memory: createStore<MemoryMetrics>({
      memoryUsedMB: null,
      memoryDeltaMB: null,
      peakMemoryMB: null,
      memoryHistory: [],
    }),
    dom: createStore<DomMetrics>({
      domElements: null,
    }),
  }
}

// Context to pass all stores to sub-components
const MetricStoresContext = React.createContext<MetricStores | null>(null)

function useMetricStores(): MetricStores {
  const stores = React.useContext(MetricStoresContext)
  if (!stores) throw new Error('useMetricStores must be used within MetricStoresContext.Provider')
  return stores
}

// ============================================================================
// Performance Contexts (split to avoid unnecessary re-renders)
// ============================================================================

// Callbacks context - stable, never changes after mount
// Used by ProfiledComponent to report renders without subscribing to metrics
interface PerformanceCallbacksContextValue {
  reportReactRender: (phase: 'mount' | 'update' | 'nested-update', actualDuration: number, baseDuration: number) => void
  setDomElements: (count: number | null) => void
  reset: () => void
}

const PerformanceCallbacksContext = React.createContext<PerformanceCallbacksContextValue | null>(null)

// Metrics context - changes every RAF, only consumed by the monitor
interface PerformanceMetricsContextValue {
  metrics: PerformanceMetrics
}

const PerformanceMetricsContext = React.createContext<PerformanceMetricsContextValue | null>(null)

// Hook for callbacks only (stable, won't cause re-renders)
export function usePerformanceCallbacks() {
  return React.useContext(PerformanceCallbacksContext)
}

// Hook for metrics (will cause re-renders on every RAF)
export function usePerformanceMetrics() {
  return React.useContext(PerformanceMetricsContext)
}

// Legacy hook for backward compatibility
export function usePerformanceContext() {
  const callbacks = React.useContext(PerformanceCallbacksContext)
  const metricsCtx = React.useContext(PerformanceMetricsContext)
  if (!callbacks || !metricsCtx) return null
  return {...callbacks, ...metricsCtx}
}

// ============================================================================
// Performance Provider - Collects all metrics
// ============================================================================

// Helper to get current memory usage in MB (Chrome only)
function getMemoryMB(): number | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = (performance as any).memory
  if (memory?.usedJSHeapSize) {
    return Math.round((memory.usedJSHeapSize / 1024 / 1024) * 10) / 10
  }
  return null
}

// Internal mutable state (never read during render)
interface MutableMetricsState {
  // Frame timing
  maxFrameTime: number
  droppedFrames: number
  // Input
  maxInputLatency: number
  // Paint
  maxPaintTime: number
  paintCycles: number
  // Tasks
  longTasks: number
  longestTask: number
  slowEvents: number
  // Layout
  styleWrites: number
  thrashingScore: number
  layoutShiftScore: number
  // Input jitter
  inputJitter: number
  layoutShiftCount: number
  // React
  reactRenderCount: number
  reactTotalActualDuration: number
  reactMaxActualDuration: number
  reactLastActualDuration: number
  reactBaseDuration: number
  reactMountCount: number
  reactUpdateCount: number
  // Post-mount tracking
  reactPostMountMaxDuration: number
  reactPostMountUpdateCount: number
  reactMountDuration: number
  mountPhaseComplete: boolean
  // DOM
  domElements: number | null
  // Memory
  baselineMemoryMB: number | null
  peakMemoryMB: number | null
  lastSampledMemoryMB: number | null
  // Interactions (INP)
  interactionCount: number
  interactionLatencies: number[]
  inpMs: number
  // Nested updates (detected by React Profiler)
  nestedUpdateCount: number
  // Sparkline history
  memoryHistory: number[]
  fpsHistory: number[]
  frameTimeHistory: number[]
  // Rolling averages
  frameTimes: number[]
  inputLatencies: number[]
  paintTimes: number[]
  sparklineSampleCount: number
}

// Create initial mutable state
function createInitialMutableState(): MutableMetricsState {
  return {
    maxFrameTime: 0,
    droppedFrames: 0,
    maxInputLatency: 0,
    maxPaintTime: 0,
    paintCycles: 0,
    longTasks: 0,
    longestTask: 0,
    slowEvents: 0,
    styleWrites: 0,
    thrashingScore: 0,
    layoutShiftScore: 0,
    layoutShiftCount: 0,
    inputJitter: 0,
    reactRenderCount: 0,
    reactTotalActualDuration: 0,
    reactMaxActualDuration: 0,
    reactLastActualDuration: 0,
    reactBaseDuration: 0,
    reactMountCount: 0,
    reactUpdateCount: 0,
    reactPostMountMaxDuration: 0,
    reactPostMountUpdateCount: 0,
    reactMountDuration: 0,
    mountPhaseComplete: false,
    domElements: null,
    baselineMemoryMB: null,
    peakMemoryMB: null,
    lastSampledMemoryMB: null,
    interactionCount: 0,
    interactionLatencies: [],
    inpMs: 0,
    nestedUpdateCount: 0,
    memoryHistory: [],
    fpsHistory: [],
    frameTimeHistory: [],
    frameTimes: [],
    inputLatencies: [],
    paintTimes: [],
    sparklineSampleCount: 0,
  }
}

export const PerformanceProvider = React.memo(function PerformanceProvider({
  children,
  initialPosition = 'bottom-left',
}: {
  children: React.ReactNode
  initialPosition?: MonitorPosition
}) {
  // Ref for DOM element counting
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Mutable state for collecting metrics - shared with isolated monitor via ref
  // This is the ONLY shared state between provider and monitor
  const mutableRef = React.useRef<MutableMetricsState>(createInitialMutableState())

  // React Profiler callback - updates mutable ref only (no React state)
  const reportReactRender = React.useCallback(
    (phase: 'mount' | 'update' | 'nested-update', actualDuration: number, baseDuration: number) => {
      const m = mutableRef.current

      // Track nested updates - state updates triggered during commit phase
      // React detects this natively and reports as 'nested-update' phase
      if (phase === 'nested-update') {
        m.nestedUpdateCount++
      }

      m.reactRenderCount++
      m.reactTotalActualDuration += actualDuration
      m.reactLastActualDuration = actualDuration
      m.reactBaseDuration = baseDuration

      if (actualDuration > m.reactMaxActualDuration) {
        m.reactMaxActualDuration = actualDuration
      }

      if (phase === 'mount') {
        m.reactMountCount++
        m.reactMountDuration += actualDuration
      } else {
        m.reactUpdateCount++
        m.mountPhaseComplete = true
        m.reactPostMountUpdateCount++
        if (actualDuration > m.reactPostMountMaxDuration) {
          m.reactPostMountMaxDuration = actualDuration
        }
      }
    },
    [],
  )

  // DOM element count setter - updates mutable ref only
  const setDomElements = React.useCallback((count: number | null) => {
    mutableRef.current.domElements = count
  }, [])

  // Reset function - resets mutable state, monitor will pick up changes
  const reset = React.useCallback(() => {
    const m = mutableRef.current
    const currentMemory = getMemoryMB()

    // Preserve mount stats
    const mountCount = m.reactMountCount
    const mountDuration = m.reactMountDuration

    // Reset most metrics
    m.maxFrameTime = 0
    m.droppedFrames = 0
    m.maxInputLatency = 0
    m.maxPaintTime = 0
    m.paintCycles = 0
    m.longTasks = 0
    m.longestTask = 0
    m.slowEvents = 0
    m.styleWrites = 0
    m.thrashingScore = 0
    m.layoutShiftScore = 0
    m.layoutShiftCount = 0
    m.inputJitter = 0
    m.reactRenderCount = mountCount
    m.reactTotalActualDuration = mountDuration
    m.reactMaxActualDuration = 0
    m.reactLastActualDuration = 0
    m.reactBaseDuration = 0
    m.reactUpdateCount = 0
    m.reactPostMountMaxDuration = 0
    m.reactPostMountUpdateCount = 0
    m.baselineMemoryMB = currentMemory
    m.peakMemoryMB = currentMemory
    m.lastSampledMemoryMB = currentMemory
    m.interactionCount = 0
    m.interactionLatencies = []
    m.inpMs = 0
    m.nestedUpdateCount = 0
    m.memoryHistory = []
    m.fpsHistory = []
    m.frameTimeHistory = []
    m.frameTimes = []
    m.inputLatencies = []
    m.paintTimes = []
    m.sparklineSampleCount = 0
  }, [])

  // DOM element counting effect - only observer setup, no state
  React.useEffect(() => {
    const countElements = () => {
      if (contentRef.current) {
        const count = contentRef.current.querySelectorAll('*').length
        mutableRef.current.domElements = count
      }
    }

    countElements()

    if (contentRef.current) {
      const observer = new MutationObserver(countElements)
      observer.observe(contentRef.current, {childList: true, subtree: true})
      return () => observer.disconnect()
    }
    return undefined
  }, [])

  // Stable callbacks context value (never changes after mount)
  const callbacksValue = React.useMemo(
    () => ({reportReactRender, setDomElements, reset}),
    [reportReactRender, setDomElements, reset],
  )

  return (
    <PerformanceCallbacksContext.Provider value={callbacksValue}>
      {/* Monitor renders in COMPLETELY separate React root with its own state */}
      {/* The mutableRef is passed so the monitor can read metrics and set up observers */}
      <IsolatedPerformanceMonitor mutableRef={mutableRef} onReset={reset} initialPosition={initialPosition} />
      <div ref={contentRef}>{children}</div>
    </PerformanceCallbacksContext.Provider>
  )
})

// ============================================================================
// Profiled Component Wrapper
// ============================================================================

export const ProfiledComponent = React.memo(function ProfiledComponent({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  // Use only the callbacks context (stable, won't re-render on metrics changes)
  const callbacks = usePerformanceCallbacks()

  const onRender = React.useCallback(
    (
      _profilerId: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
      _startTime: number,
      _commitTime: number,
    ) => {
      callbacks?.reportReactRender(phase, actualDuration, baseDuration)
    },
    [callbacks],
  )

  return (
    <React.Profiler id={id} onRender={onRender}>
      {children}
    </React.Profiler>
  )
})

// ============================================================================
// Isolated Performance Monitor - Renders in separate React root
// ============================================================================

/**
 * Creates a performance monitor that renders in its own React root.
 * This component OWNS all metrics collection (RAF loop, observers) and state.
 * The provider only passes a mutable ref for React profiler data.
 *
 * Architecture:
 * - Runs RAF loop entirely within the isolated root's effects
 * - Updates state in the isolated root (not the main tree)
 * - Main tree provider has ZERO React state - only refs and callbacks
 *
 * This ensures the profiled component's render cycle is never affected by
 * metrics collection or monitor UI updates.
 */
interface IsolatedPerformanceMonitorProps {
  mutableRef: React.RefObject<MutableMetricsState>
  onReset: () => void
  initialPosition: MonitorPosition
}

const IsolatedPerformanceMonitor = React.memo(function IsolatedPerformanceMonitor({
  mutableRef,
  onReset,
  initialPosition,
}: IsolatedPerformanceMonitorProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const rootRef = React.useRef<Root | null>(null)

  // Create container and separate React root on mount
  React.useEffect(() => {
    // Create container div outside of React's tree
    const container = document.createElement('div')
    container.setAttribute('data-perf-monitor-root', '')
    document.body.appendChild(container)
    containerRef.current = container

    // Create separate React root
    const root = createRoot(container)
    rootRef.current = root

    startTransition(() => {
      // Render initial state
      root.render(
        <StrictMode>
          <IsolatedMonitorInner mutableRef={mutableRef} onReset={onReset} initialPosition={initialPosition} />
        </StrictMode>,
      )
    })
    // Cleanup on unmount
    return () => {
      setTimeout(() => {
        root.unmount()
        container.remove()
      }, 0)
    }
  }, [mutableRef, onReset, initialPosition])

  // This component renders nothing in the main tree
  return null
})

/**
 * Inner component that runs inside the isolated React root.
 * This owns the RAF loop and metrics stores - completely separate from the profiled tree.
 */
const IsolatedMonitorInner = React.memo(function IsolatedMonitorInner({
  mutableRef,
  onReset,
  initialPosition,
}: {
  mutableRef: React.RefObject<MutableMetricsState>
  onReset: () => void
  initialPosition: MonitorPosition
}) {
  // Create all stores once on mount - stable references
  const storesRef = React.useRef<MetricStores | null>(null)
  if (!storesRef.current) {
    storesRef.current = createAllStores()
  }
  const stores = storesRef.current

  // RAF loop and all observers run in this isolated root
  // CRITICAL: Measurement runs every RAF for accuracy, but UI updates are throttled
  // to minimize React overhead leaking into the profiled application
  React.useEffect(() => {
    const m = mutableRef.current
    if (!m) return

    let animationId: number
    let lastTime = performance.now()
    let lastFastUIUpdate = 0
    let lastSlowUIUpdate = 0
    const expectedFrameTime = 16.67 // 60fps -> 16.67ms per frame
    const FAST_UPDATE_FPS = 10 // Frame/input metrics at ~10fps
    const SLOW_UPDATE_FPS = 2 // Memory/DOM/React metrics at ~2fps

    // Track history array versions to avoid copying unchanged arrays
    let lastFpsHistoryLen = 0
    let lastFrameTimeHistoryLen = 0
    let lastMemoryHistoryLen = 0

    // Layout thrashing detection state
    // Only detects severe blocking (>50ms frames) near style writes
    let styleWriteCount = 0
    let lastStyleWriteTime = 0

    const checkForThrashing = (frameTime: number) => {
      const now = performance.now()
      const timeSinceLastWrite = now - lastStyleWriteTime
      const hadRecentStyleWrite = styleWriteCount > 0 && timeSinceLastWrite < 50

      // Severe blocking: >50ms frame with recent style writes
      if (hadRecentStyleWrite && frameTime > 50) {
        m.thrashingScore++
      }

      styleWriteCount = 0
    }

    // Update fast-changing stores (frame, input, tasks, layout)
    const updateFastStores = () => {
      const avgFrameTime = m.frameTimes.length > 0 ? m.frameTimes.reduce((a, b) => a + b, 0) / m.frameTimes.length : 0
      const fps = avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0
      const avgInputLatency =
        m.inputLatencies.length > 0 ? m.inputLatencies.reduce((a, b) => a + b, 0) / m.inputLatencies.length : 0
      const avgPaintTime = m.paintTimes.length > 0 ? m.paintTimes.reduce((a, b) => a + b, 0) / m.paintTimes.length : 0

      // Only copy history arrays if they've changed (new data pushed)
      const fpsHistoryChanged = m.fpsHistory.length !== lastFpsHistoryLen
      const frameTimeHistoryChanged = m.frameTimeHistory.length !== lastFrameTimeHistoryLen
      if (fpsHistoryChanged) lastFpsHistoryLen = m.fpsHistory.length
      if (frameTimeHistoryChanged) lastFrameTimeHistoryLen = m.frameTimeHistory.length

      stores.frame.setStateIfChanged({
        fps,
        frameTime: Math.round(avgFrameTime * 10) / 10,
        maxFrameTime: Math.round(m.maxFrameTime * 10) / 10,
        // Only create new array if data changed, otherwise reuse reference
        fpsHistory: fpsHistoryChanged ? [...m.fpsHistory] : stores.frame.getState().fpsHistory,
        frameTimeHistory: frameTimeHistoryChanged ? [...m.frameTimeHistory] : stores.frame.getState().frameTimeHistory,
      })

      stores.input.setStateIfChanged({
        inputLatency: Math.round(avgInputLatency * 10) / 10,
        maxInputLatency: Math.round(m.maxInputLatency * 10) / 10,
        paintTime: Math.round(avgPaintTime * 10) / 10,
        maxPaintTime: Math.round(m.maxPaintTime * 10) / 10,
      })

      stores.tasks.setStateIfChanged({
        longTasks: m.longTasks,
        longestTask: Math.round(m.longestTask),
        droppedFrames: m.droppedFrames,
      })

      stores.layout.setStateIfChanged({
        styleWrites: m.styleWrites,
        thrashingScore: m.thrashingScore,
        inputJitter: m.inputJitter,
        layoutShiftScore: Math.round(m.layoutShiftScore * 1000) / 1000,
        layoutShiftCount: m.layoutShiftCount,
      })
    }

    // Update slow-changing stores (memory, dom, react, interactions)
    const updateSlowStores = () => {
      const memoryDeltaMB =
        m.lastSampledMemoryMB !== null && m.baselineMemoryMB !== null
          ? Math.round((m.lastSampledMemoryMB - m.baselineMemoryMB) * 10) / 10
          : null

      const memoryHistoryChanged = m.memoryHistory.length !== lastMemoryHistoryLen
      if (memoryHistoryChanged) lastMemoryHistoryLen = m.memoryHistory.length

      stores.interactions.setStateIfChanged({
        interactionCount: m.interactionCount,
        inpMs: Math.round(m.inpMs),
      })

      stores.react.setStateIfChanged({
        reactMountCount: m.reactMountCount,
        reactMountDuration: m.reactMountDuration,
        reactRenderCount: m.reactRenderCount,
        reactPostMountUpdateCount: m.reactPostMountUpdateCount,
        reactPostMountMaxDuration: m.reactPostMountMaxDuration,
        renderCascades: m.nestedUpdateCount,
      })

      stores.memory.setStateIfChanged({
        memoryUsedMB: m.lastSampledMemoryMB,
        memoryDeltaMB,
        peakMemoryMB: m.peakMemoryMB,
        memoryHistory: memoryHistoryChanged ? [...m.memoryHistory] : stores.memory.getState().memoryHistory,
      })

      stores.dom.setStateIfChanged({
        domElements: m.domElements,
      })
    }

    // Schedule UI updates using requestIdleCallback when available
    // This ensures React rendering happens during idle time, not during active measurements
    const scheduleFastUpdate = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => updateFastStores(), {timeout: 50})
      } else {
        setTimeout(updateFastStores, 0)
      }
    }

    const scheduleSlowUpdate = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => updateSlowStores(), {timeout: 200})
      } else {
        setTimeout(updateSlowStores, 0)
      }
    }

    const measure = () => {
      const now = performance.now()
      const delta = now - lastTime
      lastTime = now

      // Always collect measurements every RAF for accuracy
      m.frameTimes.push(delta)
      if (m.frameTimes.length > 60) m.frameTimes.shift()

      if (delta > expectedFrameTime * 2) {
        m.droppedFrames += Math.floor(delta / expectedFrameTime) - 1
      }

      if (delta > m.maxFrameTime) {
        m.maxFrameTime = delta
      } else if (delta < 20 && m.maxFrameTime > 20) {
        m.maxFrameTime *= 0.99
      }

      checkForThrashing(delta)

      // Frame time jitter: detect sudden spikes in frame time that cause visible hitches
      if (m.frameTimes.length >= 5) {
        const baselineFrames = m.frameTimes.slice(-5, -1)
        const avgBaseline = baselineFrames.reduce((a, b) => a + b, 0) / baselineFrames.length
        const isFrameJitter = delta > avgBaseline * 3 && delta - avgBaseline > 20 && delta > 40
        if (isFrameJitter) {
          m.inputJitter++
        }
      }

      // Sample sparkline/memory data periodically (every ~5 frames)
      m.sparklineSampleCount++
      if (m.sparklineSampleCount >= 5) {
        m.sparklineSampleCount = 0
        const avgFrameTime = m.frameTimes.reduce((a, b) => a + b, 0) / m.frameTimes.length
        const fps = Math.round(1000 / avgFrameTime)
        m.fpsHistory.push(fps)
        if (m.fpsHistory.length > 30) m.fpsHistory.shift()
        m.frameTimeHistory.push(avgFrameTime)
        if (m.frameTimeHistory.length > 30) m.frameTimeHistory.shift()

        const rawMemoryMB = getMemoryMB()
        if (rawMemoryMB !== null) {
          if (m.baselineMemoryMB === null) {
            m.baselineMemoryMB = rawMemoryMB
            m.peakMemoryMB = rawMemoryMB
          }
          if (m.peakMemoryMB === null || rawMemoryMB > m.peakMemoryMB) {
            m.peakMemoryMB = rawMemoryMB
          }
          m.lastSampledMemoryMB = rawMemoryMB
          m.memoryHistory.push(rawMemoryMB)
          if (m.memoryHistory.length > 30) m.memoryHistory.shift()
        }
      }

      // Throttle React UI updates to minimize overhead
      // Measurements are still collected every RAF above
      // Fast metrics (frame, input) update at ~10fps
      if (now - lastFastUIUpdate >= 1000 / FAST_UPDATE_FPS) {
        lastFastUIUpdate = now
        scheduleFastUpdate()
      }
      // Slow metrics (memory, react, dom) update at ~2fps
      if (now - lastSlowUIUpdate >= 1000 / SLOW_UPDATE_FPS) {
        lastSlowUIUpdate = now
        scheduleSlowUpdate()
      }

      animationId = requestAnimationFrame(measure)
    }

    // Input latency, paint time, and jitter detection
    // Track recent values to detect unexpected spikes (jitter) from multiple sources
    const recentInputLatencies: number[] = []
    const recentPaintTimes: number[] = []

    const handlePointerMove = (event: PointerEvent) => {
      const eventTime = event.timeStamp
      requestAnimationFrame(() => {
        const rafTime = performance.now()
        const latency = rafTime - eventTime
        m.inputLatencies.push(latency)
        if (m.inputLatencies.length > 30) m.inputLatencies.shift()
        if (latency > m.maxInputLatency) m.maxInputLatency = latency
        else if (latency < 20 && m.maxInputLatency > 20) m.maxInputLatency *= 0.98

        // Input latency jitter: unexpected spike in pointer-to-RAF time
        recentInputLatencies.push(latency)
        if (recentInputLatencies.length > 10) recentInputLatencies.shift()

        if (recentInputLatencies.length >= 5) {
          const baseline = recentInputLatencies.slice(0, -1)
          const avgBaseline = baseline.reduce((a, b) => a + b, 0) / baseline.length

          // Flag as jitter if latency is:
          // - More than 3x baseline (significant relative spike)
          // - AND >30ms above baseline (substantial jump)
          // - AND >50ms absolute (clearly noticeable delay)
          const isJitter = latency > avgBaseline * 3 && latency - avgBaseline > 30 && latency > 50

          if (isJitter) {
            m.inputJitter++
          }
        }

        requestAnimationFrame(() => {
          const paintDuration = performance.now() - rafTime
          m.paintCycles++
          m.paintTimes.push(paintDuration)
          if (m.paintTimes.length > 30) m.paintTimes.shift()
          if (paintDuration > m.maxPaintTime) m.maxPaintTime = paintDuration
          else if (paintDuration < 10 && m.maxPaintTime > 10) m.maxPaintTime *= 0.98

          // Paint time jitter: unexpected spike in paint/composite duration
          recentPaintTimes.push(paintDuration)
          if (recentPaintTimes.length > 10) recentPaintTimes.shift()

          if (recentPaintTimes.length >= 5) {
            const baseline = recentPaintTimes.slice(0, -1)
            const avgBaseline = baseline.reduce((a, b) => a + b, 0) / baseline.length

            // Flag if paint time spikes: >3x baseline AND >20ms above AND >35ms absolute
            const isPaintJitter =
              paintDuration > avgBaseline * 3 && paintDuration - avgBaseline > 20 && paintDuration > 35

            if (isPaintJitter) {
              m.inputJitter++
            }
          }
        })
      })
    }

    // Long Task observer
    let longTaskObserver: PerformanceObserver | null = null
    try {
      longTaskObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          m.longTasks++
          if (entry.duration > m.longestTask) m.longestTask = entry.duration
        }
      })
      longTaskObserver.observe({type: 'longtask'})
    } catch {
      /* Not supported */
    }

    // Event timing observer
    let eventObserver: PerformanceObserver | null = null
    try {
      eventObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) m.slowEvents++
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eventObserver.observe({type: 'event', durationThreshold: 16} as any)
    } catch {
      /* Not supported */
    }

    // Style write tracking - filter out mutations from our own monitor UI
    const styleObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // Skip style changes from our performance monitor
          const target = mutation.target as Element
          if (target.closest('[data-perf-monitor]') || target.closest('[data-perf-monitor-root]')) {
            continue
          }
          m.styleWrites++
          styleWriteCount++
          lastStyleWriteTime = performance.now()
        }
      }
    })
    styleObserver.observe(document.body, {attributes: true, attributeFilter: ['style'], subtree: true})

    // Layout Shift observer
    let layoutShiftObserver: PerformanceObserver | null = null
    try {
      layoutShiftObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const shiftEntry = entry as any
          if (!shiftEntry.hadRecentInput) {
            m.layoutShiftScore += shiftEntry.value || 0
            m.layoutShiftCount++
          }
        }
      })
      layoutShiftObserver.observe({type: 'layout-shift', buffered: true})
    } catch {
      /* Not supported */
    }

    // Interaction handler for INP
    const handleInteraction = (event: MouseEvent | KeyboardEvent) => {
      const eventTime = event.timeStamp
      m.interactionCount++
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const latency = performance.now() - eventTime
          m.interactionLatencies.push(latency)
          if (m.interactionLatencies.length > 50) m.interactionLatencies.shift()
          if (latency > m.inpMs) m.inpMs = latency
        })
      })
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    animationId = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(animationId)
      styleObserver.disconnect()
      longTaskObserver?.disconnect()
      eventObserver?.disconnect()
      layoutShiftObserver?.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [mutableRef, stores])

  return (
    <MetricStoresContext.Provider value={stores}>
      <PerformanceMonitorView onReset={onReset} initialPosition={initialPosition} />
    </MetricStoresContext.Provider>
  )
})

// ============================================================================
// Stateless Performance Monitor View
// ============================================================================

// ============================================================================
// Reduced Motion Hook
// ============================================================================

/**
 * Hook to detect prefers-reduced-motion media query.
 * Returns true if the user prefers reduced motion.
 */
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches)

    // Modern browsers
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// ============================================================================
// Sparkline Component - Inline trend visualization
// ============================================================================

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  /** Optional threshold line (e.g., 60 for FPS, 16.67 for frame time) */
  threshold?: number
  thresholdColor?: string
  /** If true, values below threshold are bad (like FPS). If false, values above are bad (like frame time). */
  invertThreshold?: boolean
  /** Additional styles for positioning */
  style?: React.CSSProperties
}

const Sparkline = React.memo(
  function Sparkline({
    data,
    width = 50,
    height = 16,
    color = 'var(--fgColor-accent)',
    threshold,
    thresholdColor = 'var(--fgColor-danger)',
    invertThreshold = false,
    style,
  }: SparklineProps) {
    if (data.length < 2) {
      return (
        <svg width={width} height={height} style={{opacity: 0.3, ...style}} aria-hidden="true">
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="2,2"
          />
        </svg>
      )
    }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    // Calculate Y position (inverted because SVG Y is top-down)
    const getY = (value: number) => {
      const normalized = (value - min) / range
      return height - normalized * (height - 2) - 1
    }

    // Generate path
    const points = data.map((value, i) => {
      const x = (i / (data.length - 1)) * width
      const y = getY(value)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })

    // Calculate threshold line Y position if within range
    let thresholdY: number | null = null
    if (threshold !== undefined && threshold >= min && threshold <= max) {
      thresholdY = getY(threshold)
    }

    // Determine if current value is "bad" based on threshold
    const currentValue = data[data.length - 1]
    const isBad = threshold !== undefined && (invertThreshold ? currentValue < threshold : currentValue > threshold)

    return (
      <svg width={width} height={height} style={{verticalAlign: 'middle', ...style}} aria-hidden="true">
        {/* Threshold line */}
        {thresholdY !== null && (
          <line
            x1={0}
            y1={thresholdY}
            x2={width}
            y2={thresholdY}
            stroke={thresholdColor}
            strokeWidth={0.5}
            strokeDasharray="2,1"
            opacity={0.5}
          />
        )}
        {/* Main line */}
        <path d={points.join(' ')} fill="none" stroke={isBad ? thresholdColor : color} strokeWidth={1.5} />
        {/* Current value dot */}
        <circle cx={width} cy={getY(currentValue)} r={2} fill={isBad ? thresholdColor : color} />
      </svg>
    )
  },
  // Custom comparison: skip re-render if data array reference unchanged
  (prev, next) =>
    prev.data === next.data &&
    prev.threshold === next.threshold &&
    prev.color === next.color &&
    prev.width === next.width &&
    prev.height === next.height,
)

// ============================================================================
// Leaf Display Components - Each owns its store subscription
// ============================================================================

/**
 * Tiny components that read from stores and render values.
 * By pushing store reads to the leaf level:
 * - Only the smallest possible component re-renders on store update
 * - Data dependencies are explicit and colocated with rendering
 * - Parent components don't re-render when metrics change
 */

// ─── Collapsed View Displays ─────────────────────────────────────────────────

/** FPS display for collapsed view */
const CollapsedFpsDisplay = React.memo(function CollapsedFpsDisplay() {
  const stores = useMetricStores()
  const {fps} = useStore(stores.frame)
  const color = fps >= 55 ? 'var(--fgColor-success)' : fps >= 30 ? 'var(--fgColor-attention)' : 'var(--fgColor-danger)'
  return <span style={{color, fontWeight: 600}}>{fpsFormatter.format(fps)} fps</span>
})

/** Input latency display for collapsed view */
const CollapsedInputDisplay = React.memo(function CollapsedInputDisplay() {
  const stores = useMetricStores()
  const {inputLatency} = useStore(stores.input)
  const color =
    inputLatency <= 16
      ? 'var(--fgColor-success)'
      : inputLatency <= 50
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'
  return <span style={{color}}>{msFormatter.format(inputLatency)}ms</span>
})

/** Long tasks display for collapsed view */
const CollapsedTasksDisplay = React.memo(function CollapsedTasksDisplay() {
  const stores = useMetricStores()
  const {longTasks} = useStore(stores.tasks)
  const color =
    longTasks === 0 ? 'var(--fgColor-success)' : longTasks <= 5 ? 'var(--fgColor-attention)' : 'var(--fgColor-danger)'
  return <span style={{color}}>{longTasks} tasks</span>
})

// ─── Expanded View Displays ──────────────────────────────────────────────────

/** DOM element count display */
const DomCountDisplay = React.memo(function DomCountDisplay() {
  const stores = useMetricStores()
  const {domElements} = useStore(stores.dom)
  return (
    <>
      <MetricLabel>DOM</MetricLabel>
      <MetricValue>{domElements ? `${numberFormatter.format(domElements)} nodes` : 'N/A'}</MetricValue>
    </>
  )
})

/** Peak memory display */
const PeakMemoryDisplay = React.memo(function PeakMemoryDisplay() {
  const stores = useMetricStores()
  const {peakMemoryMB, memoryUsedMB} = useStore(stores.memory)
  return (
    <>
      <MetricLabel>Peak</MetricLabel>
      <MetricValue>
        {peakMemoryMB !== null ? (
          <>
            {mbFormatter.format(peakMemoryMB)}MB
            {memoryUsedMB !== null && peakMemoryMB > memoryUsedMB + 1 && (
              <span style={{color: 'var(--fgColor-attention)', marginLeft: '4px', fontSize: '8px'}}>
                (+{mbFormatter.format(peakMemoryMB - memoryUsedMB)} from current)
              </span>
            )}
          </>
        ) : (
          'N/A'
        )}
      </MetricValue>
    </>
  )
})

// ============================================================================
// Extracted Sub-Components for Monitor UI
// ============================================================================

/** Common base styles for grid cells */
const cellBaseStyle: React.CSSProperties = {
  color: 'var(--fgColor-onEmphasis)',
  fontSize: '9px',
}

/** Styles for section-starting cells (with top border) */
const sectionStartStyle: React.CSSProperties = {
  ...cellBaseStyle,
  borderTop: '1px solid var(--borderColor-muted)',
  paddingTop: '3px',
  marginTop: '2px',
}

/** Props for MetricLabel component */
interface MetricLabelProps {
  children: React.ReactNode
  isSection?: boolean
}

/** Label cell in the metrics grid */
const MetricLabel = React.memo(function MetricLabel({children, isSection}: MetricLabelProps) {
  return <span style={isSection ? sectionStartStyle : cellBaseStyle}>{children}</span>
})

/** Props for MetricValue component */
interface MetricValueProps {
  children: React.ReactNode
  color?: string
  fontWeight?: number | string
  isSection?: boolean
  style?: React.CSSProperties
}

/** Value cell in the metrics grid */
const MetricValue = React.memo(function MetricValue({children, color, fontWeight, isSection, style}: MetricValueProps) {
  return (
    <span
      style={{
        ...(isSection ? sectionStartStyle : cellBaseStyle),
        ...(color && {color}),
        ...(fontWeight && {fontWeight}),
        ...style,
      }}
    >
      {children}
    </span>
  )
})

/** Props for MonitorButton */
interface MonitorButtonProps {
  onClick: () => void
  label: string
  children: React.ReactNode
  isActive?: boolean
  fontSize?: string
}

/** Consistent button styling for monitor controls */
const MonitorButton = React.memo(function MonitorButton({
  onClick,
  label,
  children,
  isActive,
  fontSize = '9px',
}: MonitorButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: isActive ? 'var(--bgColor-accent-muted)' : 'var(--bgColor-neutral-muted)',
        border: isActive ? '1px solid var(--borderColor-accent-emphasis)' : '1px solid var(--borderColor-default)',
        color: isActive ? 'var(--fgColor-accent)' : 'var(--fgColor-onEmphasis)',
        cursor: 'pointer',
        padding: '2px 6px',
        borderRadius: 'var(--borderRadius-small)',
        fontSize,
        fontWeight: isActive ? 600 : 'normal',
      }}
      aria-label={label}
      aria-pressed={isActive}
    >
      {children}
    </button>
  )
})

/** Props for HelpPanel */
interface HelpPanelProps {
  prefersReducedMotion: boolean
}

/** Expandable help panel showing metric descriptions */
const HelpPanel = React.memo(function HelpPanel({prefersReducedMotion}: HelpPanelProps) {
  return (
    <div
      style={{
        marginBottom: '8px',
        padding: '8px',
        background: 'var(--bgColor-neutral-muted)',
        borderRadius: 'var(--borderRadius-small)',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      <div style={{fontSize: '9px', lineHeight: 1.6}}>
        {Object.entries(metricDescriptions).map(([key, {label, description}]) => (
          <div key={key} style={{marginBottom: '6px'}}>
            <span style={{color: 'var(--fgColor-onEmphasis)', fontWeight: 600}}>{label}</span>
            <div style={{color: 'var(--fgColor-onEmphasis)', opacity: 0.8, marginTop: '1px'}}>{description}</div>
          </div>
        ))}
        <div
          style={{
            marginTop: '8px',
            paddingTop: '6px',
            borderTop: '1px solid var(--borderColor-default)',
            color: 'var(--fgColor-onEmphasis)',
            opacity: 0.8,
          }}
        >
          <strong style={{opacity: 1}}>Keyboard:</strong> Arrow keys move panel, Shift for larger steps, Home resets
          position.
          {prefersReducedMotion && (
            <div style={{marginTop: '4px'}}>
              <strong style={{opacity: 1}}>🔇 Reduced motion:</strong> Sparklines hidden to respect your system
              preference.
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

/** Props for CollapsedMonitorView */
interface CollapsedMonitorViewProps {
  positionStyle: React.CSSProperties
  dragState: {isDragging: boolean; offsetX: number; offsetY: number}
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onExpand: () => void
}

/** Collapsed single-row view showing key metrics */
const CollapsedMonitorView = React.memo(function CollapsedMonitorView({
  positionStyle,
  dragState,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onExpand,
}: CollapsedMonitorViewProps) {
  return (
    <div
      data-perf-monitor
      role="region"
      aria-label="Performance monitor (collapsed). Use arrow keys to move, Home to reset position."
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      style={{
        position: 'fixed',
        ...positionStyle,
        zIndex: 9999,
        padding: '6px 10px',
        background: 'var(--bgColor-emphasis)',
        borderRadius: 'var(--borderRadius-medium)',
        fontFamily: 'monospace',
        fontSize: '11px',
        color: 'var(--fgColor-onEmphasis)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow-floating-medium)',
        backdropFilter: 'blur(4px)',
        cursor: dragState.isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <CollapsedFpsDisplay />
      <CollapsedInputDisplay />
      <CollapsedTasksDisplay />
      <MonitorButton onClick={onExpand} label="Expand" fontSize="12px">
        ▼
      </MonitorButton>
    </div>
  )
})

/** Props for MemoryMetricRow */
interface MemoryMetricRowProps {
  prefersReducedMotion: boolean
}

/** Memory metric display with sparkline and delta */
const MemoryMetricRow = React.memo(function MemoryMetricRow({prefersReducedMotion}: MemoryMetricRowProps) {
  const stores = useMetricStores()
  const {memoryUsedMB, memoryDeltaMB, memoryHistory} = useStore(stores.memory)

  if (memoryUsedMB === null) {
    return (
      <>
        <MetricLabel>Memory</MetricLabel>
        <MetricValue>N/A</MetricValue>
      </>
    )
  }

  const deltaColor =
    memoryDeltaMB === null
      ? 'var(--fgColor-onEmphasis)'
      : memoryDeltaMB > 20
        ? 'var(--fgColor-danger)'
        : memoryDeltaMB > 5
          ? 'var(--fgColor-attention)'
          : memoryDeltaMB < -2
            ? 'var(--fgColor-success)'
            : 'var(--fgColor-onEmphasis)'

  const deltaText =
    memoryDeltaMB === null
      ? ''
      : memoryDeltaMB > 0.5
        ? `+${mbFormatter.format(memoryDeltaMB)}`
        : memoryDeltaMB < -0.5
          ? mbFormatter.format(memoryDeltaMB)
          : '±0'

  return (
    <>
      <MetricLabel>Memory</MetricLabel>
      <MetricValue style={{display: 'flex', alignItems: 'center'}}>
        <span style={{minWidth: '45px'}}>{mbFormatter.format(memoryUsedMB)}MB</span>
        {memoryDeltaMB !== null && (
          <span
            style={{
              color: deltaColor,
              marginLeft: '4px',
              fontWeight: Math.abs(memoryDeltaMB) > 5 ? 600 : 'normal',
            }}
          >
            {deltaText}
          </span>
        )}
        {!prefersReducedMotion && (
          <Sparkline
            data={memoryHistory}
            color="var(--fgColor-accent)"
            threshold={memoryHistory.length > 0 ? memoryHistory[0] + 10 : undefined}
            thresholdColor="var(--fgColor-attention)"
            style={{marginLeft: 'auto'}}
          />
        )}
      </MetricValue>
    </>
  )
})

/** Props for FrameMetricsSection */
interface FrameMetricsSectionProps {
  prefersReducedMotion: boolean
}

/** Frame timing metrics (FPS, Frame time) with sparklines */
const FrameMetricsSection = React.memo(function FrameMetricsSection({prefersReducedMotion}: FrameMetricsSectionProps) {
  const stores = useMetricStores()
  const {fps, frameTime, maxFrameTime, fpsHistory, frameTimeHistory} = useStore(stores.frame)

  const fpsColor =
    fps >= 55 ? 'var(--fgColor-success)' : fps >= 30 ? 'var(--fgColor-attention)' : 'var(--fgColor-danger)'

  return (
    <>
      <MetricLabel isSection>FPS</MetricLabel>
      <MetricValue isSection color={fpsColor} fontWeight={600} style={{display: 'flex', alignItems: 'center'}}>
        {fpsFormatter.format(fps)}
        {!prefersReducedMotion && (
          <Sparkline
            data={fpsHistory}
            color={fpsColor}
            threshold={55}
            thresholdColor="var(--fgColor-attention)"
            invertThreshold={true}
            style={{marginLeft: 'auto'}}
          />
        )}
      </MetricValue>

      <MetricLabel>Frame</MetricLabel>
      <MetricValue style={{display: 'flex', alignItems: 'center'}}>
        {msFormatter.format(frameTime)}ms{' '}
        <span
          style={{
            color: maxFrameTime > 32 ? 'var(--fgColor-danger)' : 'var(--fgColor-onEmphasis)',
            fontSize: '9px',
          }}
        >
          (max {msFormatter.format(maxFrameTime)})
        </span>
        {!prefersReducedMotion && (
          <Sparkline
            data={frameTimeHistory}
            color="var(--fgColor-onEmphasis)"
            threshold={16.67}
            thresholdColor="var(--fgColor-danger)"
            style={{marginLeft: 'auto'}}
          />
        )}
      </MetricValue>
    </>
  )
})

/** Input responsiveness metrics (Input latency, Paint time) */
const InputMetricsSection = React.memo(function InputMetricsSection() {
  const stores = useMetricStores()
  const {inputLatency, maxInputLatency, paintTime, maxPaintTime} = useStore(stores.input)

  const inputLatencyColor =
    inputLatency <= 16
      ? 'var(--fgColor-success)'
      : inputLatency <= 50
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  return (
    <>
      <MetricLabel isSection>Input</MetricLabel>
      <MetricValue isSection>
        <span style={{color: inputLatencyColor, fontWeight: 600}}>{msFormatter.format(inputLatency)}ms</span>{' '}
        <span
          style={{
            color: maxInputLatency > 50 ? 'var(--fgColor-danger)' : 'var(--fgColor-onEmphasis)',
            fontSize: '9px',
          }}
        >
          (max {msFormatter.format(maxInputLatency)})
        </span>
      </MetricValue>

      <MetricLabel>Paint</MetricLabel>
      <MetricValue>
        {msFormatter.format(paintTime)}ms{' '}
        <span
          style={{
            color: maxPaintTime > 16 ? 'var(--fgColor-danger)' : 'var(--fgColor-onEmphasis)',
            fontSize: '9px',
          }}
        >
          (max {msFormatter.format(maxPaintTime)})
        </span>
      </MetricValue>
    </>
  )
})

/** Task metrics (Long tasks, Dropped frames) */
const TaskMetricsSection = React.memo(function TaskMetricsSection() {
  const stores = useMetricStores()
  const {longTasks, longestTask, droppedFrames} = useStore(stores.tasks)

  const longTaskColor =
    longTasks === 0 ? 'var(--fgColor-success)' : longTasks <= 5 ? 'var(--fgColor-attention)' : 'var(--fgColor-danger)'

  const droppedColor =
    droppedFrames > 10
      ? 'var(--fgColor-danger)'
      : droppedFrames > 0
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-onEmphasis)'

  return (
    <>
      <MetricLabel isSection>Tasks</MetricLabel>
      <MetricValue isSection>
        <span style={{color: longTaskColor, fontWeight: longTasks > 0 ? 600 : 'normal'}}>{longTasks} long</span>
        {longestTask > 0 && (
          <span
            style={{
              color: longestTask > 100 ? 'var(--fgColor-danger)' : 'var(--fgColor-onEmphasis)',
              fontSize: '9px',
            }}
          >
            {' '}
            ({longestTask}ms)
          </span>
        )}
      </MetricValue>

      <MetricLabel>Dropped</MetricLabel>
      <MetricValue color={droppedColor}>{droppedFrames} frames</MetricValue>
    </>
  )
})

/** Layout metrics (Style writes, Thrash, Jitter, CLS) */
const LayoutMetricsSection = React.memo(function LayoutMetricsSection() {
  const stores = useMetricStores()
  const {styleWrites, thrashingScore, inputJitter, layoutShiftScore, layoutShiftCount} = useStore(stores.layout)

  const clsColor =
    layoutShiftScore < 0.1
      ? 'var(--fgColor-success)'
      : layoutShiftScore < 0.25
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  return (
    <>
      <MetricLabel isSection>Style</MetricLabel>
      <MetricValue isSection>{styleWrites} writes</MetricValue>

      <MetricLabel>Thrash</MetricLabel>
      <MetricValue
        color={thrashingScore > 0 ? 'var(--fgColor-danger)' : 'var(--fgColor-success)'}
        fontWeight={thrashingScore > 0 ? 600 : 'normal'}
      >
        {thrashingScore === 0 ? 'none ✓' : `${thrashingScore} stalls`}
      </MetricValue>

      <MetricLabel>Jitter</MetricLabel>
      <MetricValue
        color={inputJitter > 0 ? 'var(--fgColor-danger)' : 'var(--fgColor-success)'}
        fontWeight={inputJitter > 0 ? 600 : 'normal'}
      >
        {inputJitter === 0 ? 'none ✓' : `${inputJitter} hitches`}
      </MetricValue>

      <MetricLabel>CLS</MetricLabel>
      <MetricValue color={clsColor} fontWeight={layoutShiftScore > 0 ? 600 : 'normal'}>
        {layoutShiftScore === 0 ? 'none ✓' : layoutShiftScore.toFixed(3)}
        {layoutShiftCount > 0 && (
          <span style={{fontWeight: 'normal', color: 'var(--fgColor-onEmphasis)', fontSize: '9px'}}>
            {' '}
            ({layoutShiftCount}×)
          </span>
        )}
      </MetricValue>
    </>
  )
})

/** Interaction metrics (INP) */
const InteractionMetricsSection = React.memo(function InteractionMetricsSection() {
  const stores = useMetricStores()
  const {interactionCount, inpMs} = useStore(stores.interactions)

  const inpColor =
    inpMs <= 200 ? 'var(--fgColor-success)' : inpMs <= 500 ? 'var(--fgColor-attention)' : 'var(--fgColor-danger)'

  return (
    <>
      <MetricLabel isSection>Interact</MetricLabel>
      <MetricValue isSection>
        {interactionCount > 0 ? (
          <>
            <span>{interactionCount}×</span>
            <span style={{marginLeft: '4px', color: inpColor, fontWeight: 600}}>INP {inpMs}ms</span>
          </>
        ) : (
          'none'
        )}
      </MetricValue>
    </>
  )
})

/** React profiler metrics (Mount, Updates, Cascades) */
const ReactMetricsSection = React.memo(function ReactMetricsSection() {
  const stores = useMetricStores()
  const {
    reactMountCount,
    reactMountDuration,
    reactRenderCount,
    reactPostMountUpdateCount,
    reactPostMountMaxDuration,
    renderCascades,
  } = useStore(stores.react)

  const updateColor =
    reactPostMountUpdateCount === 0
      ? 'var(--fgColor-success)'
      : reactPostMountMaxDuration <= 8
        ? 'var(--fgColor-success)'
        : reactPostMountMaxDuration <= 16
          ? 'var(--fgColor-attention)'
          : 'var(--fgColor-danger)'

  const cascadeColor =
    renderCascades === 0
      ? 'var(--fgColor-success)'
      : renderCascades <= 3
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  return (
    <>
      {/* Mount */}
      <MetricLabel isSection>⚛️ Mount</MetricLabel>
      <MetricValue isSection>
        {reactMountCount > 0 ? (
          <>
            {reactMountCount}× ({msFormatter.format(reactMountDuration)}ms)
          </>
        ) : (
          <span style={{fontSize: '9px', fontStyle: 'italic'}}>awaiting profiler…</span>
        )}
      </MetricValue>

      {/* Updates */}
      <MetricLabel>⚛️ Updates</MetricLabel>
      {reactRenderCount > 0 ? (
        <MetricValue color={updateColor} fontWeight={600}>
          {reactPostMountUpdateCount === 0 ? 'none ✓' : reactPostMountUpdateCount}
          {reactPostMountUpdateCount > 0 && reactPostMountMaxDuration <= 8 && ' ✓'}
          {reactPostMountUpdateCount > 0 && (
            <span style={{fontWeight: 'normal', color: 'var(--fgColor-onEmphasis)', fontSize: '9px'}}>
              {' '}
              (max {msFormatter.format(reactPostMountMaxDuration)}ms)
            </span>
          )}
        </MetricValue>
      ) : (
        <MetricValue style={{fontSize: '9px', fontStyle: 'italic'}}>use profiling build</MetricValue>
      )}

      {/* Cascades */}
      <MetricLabel>⚛️ Cascades</MetricLabel>
      <MetricValue color={cascadeColor} fontWeight={renderCascades > 0 ? 600 : 'normal'}>
        {renderCascades === 0 ? 'none ✓' : renderCascades}
      </MetricValue>
    </>
  )
})

/**
 * Metric descriptions for the help panel.
 * These mirror the JSDoc documentation on PerformanceMetrics interface.
 */
const metricDescriptions = {
  dom: {
    label: 'DOM',
    description: 'Number of DOM elements within the profiled component tree.',
  },
  memory: {
    label: 'Memory',
    description:
      'JS heap size in MB (Chrome only). Delta shows change since start/reset. Sustained growth may indicate leaks.',
  },
  fps: {
    label: 'FPS',
    description: 'Frames per second. Target: 60fps. Green ≥55, Yellow ≥30, Red <30.',
  },
  frame: {
    label: 'Frame',
    description: 'Average frame time in ms. Target: ≤16.67ms for 60fps. Max shows peak with decay.',
  },
  input: {
    label: 'Input',
    description: 'Time from pointer event to next animation frame. Target: ≤16ms. Warning: >50ms.',
  },
  paint: {
    label: 'Paint',
    description: 'Browser rendering/compositing time measured via double-RAF. Target: ≤16ms.',
  },
  tasks: {
    label: 'Tasks',
    description: 'Long Tasks (>50ms) blocking main thread. Target: 0. Warning: >100ms duration.',
  },
  dropped: {
    label: 'Dropped',
    description: 'Frames taking >2x expected time (~33ms). Indicates visible stuttering.',
  },
  style: {
    label: 'Style',
    description: 'Inline style attribute mutations tracked via MutationObserver.',
  },
  thrash: {
    label: 'Thrash',
    description: 'Severe frame blocking (>50ms) near style writes. Indicates forced synchronous layout.',
  },
  jitter: {
    label: 'Jitter',
    description:
      'Unexpected timing spikes from 3 sources: input latency, frame time, and paint time. Each flags >2x baseline jumps causing visible hitching.',
  },
  cls: {
    label: 'CLS',
    description:
      'Cumulative Layout Shift. Measures unexpected layout movement. Target: <0.1 (good), <0.25 (needs improvement).',
  },
  interactions: {
    label: 'Interactions',
    description:
      'Click/keyboard event count. INP shows worst latency to paint. Target INP: ≤200ms (good), ≤500ms (okay).',
  },
  mount: {
    label: '⚛️ Mount',
    description: 'React mount phase renders. Shows count and total duration of initial mounting.',
  },
  updates: {
    label: '⚛️ Updates',
    description: 'Re-renders after mount. Target: 0 for drag (pure CSS). Green ≤8ms, Yellow ≤16ms, Red >16ms.',
  },
  cascades: {
    label: '⚛️ Nested',
    description:
      'Nested updates - state changes during commit phase (useLayoutEffect, render). Detected by React Profiler. Target: 0.',
  },
}

interface PerformanceMonitorViewProps {
  onReset: () => void
  initialPosition?: MonitorPosition
}

function PerformanceMonitorView({onReset, initialPosition = 'bottom-left'}: PerformanceMonitorViewProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [showHelp, setShowHelp] = React.useState(false)
  const [position, setPosition] = React.useState<{x: number; y: number} | null>(null)
  const [dragState, setDragState] = React.useState<{isDragging: boolean; offsetX: number; offsetY: number}>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  })
  const prefersReducedMotion = usePrefersReducedMotion()

  // Handle drag start - capture pointer for smooth dragging
  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

      const rect = (e.currentTarget as HTMLElement).closest('[data-perf-monitor]')?.getBoundingClientRect()
      const currentX = position?.x ?? rect?.left ?? 8
      const currentY = position?.y ?? rect?.top ?? window.innerHeight - (rect?.height ?? 300) - 8

      setDragState({
        isDragging: true,
        offsetX: e.clientX - currentX,
        offsetY: e.clientY - currentY,
      })
      e.preventDefault()
    },
    [position],
  )

  // Handle drag move
  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.isDragging) return
      setPosition({
        x: e.clientX - dragState.offsetX,
        y: e.clientY - dragState.offsetY,
      })
    },
    [dragState],
  )

  // Handle drag end
  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.isDragging) return
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
      setDragState(prev => ({...prev, isDragging: false}))
    },
    [dragState.isDragging],
  )

  // Keyboard support for moving the panel
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 50 : 10
      let newPosition = position

      if (!newPosition) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        newPosition = {x: rect.left, y: rect.top}
      }

      switch (e.key) {
        case 'ArrowUp':
          setPosition({...newPosition, y: newPosition.y - step})
          e.preventDefault()
          break
        case 'ArrowDown':
          setPosition({...newPosition, y: newPosition.y + step})
          e.preventDefault()
          break
        case 'ArrowLeft':
          setPosition({...newPosition, x: newPosition.x - step})
          e.preventDefault()
          break
        case 'ArrowRight':
          setPosition({...newPosition, x: newPosition.x + step})
          e.preventDefault()
          break
        case 'Home':
          setPosition(null)
          e.preventDefault()
          break
      }
    },
    [position],
  )

  // Position styles - use explicit position if dragged, otherwise use initialPosition
  const defaultPositionStyle = {
    'top-left': {left: '8px', top: '8px'},
    'top-right': {right: '8px', top: '8px'},
    'bottom-left': {left: '8px', bottom: '8px'},
    'bottom-right': {right: '8px', bottom: '8px'},
  }[initialPosition]

  const positionStyle = position ? {left: `${position.x}px`, top: `${position.y}px`} : defaultPositionStyle

  // Collapsed view - use extracted component
  if (isCollapsed) {
    return (
      <CollapsedMonitorView
        positionStyle={positionStyle}
        dragState={dragState}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        onExpand={() => setIsCollapsed(false)}
      />
    )
  }

  return (
    <div
      data-perf-monitor
      role="region"
      aria-label="Performance monitor"
      style={{
        position: 'fixed',
        ...positionStyle,
        zIndex: 9999,
        padding: '8px 10px',
        background: 'var(--bgColor-emphasis)',
        borderRadius: 'var(--borderRadius-medium)',
        fontFamily: 'monospace',
        fontSize: '10px',
        color: 'var(--fgColor-onEmphasis)',
        width: '280px',
        boxShadow: 'var(--shadow-floating-large)',
        backdropFilter: 'blur(4px)',
        userSelect: 'none',
      }}
    >
      {/* Header - draggable */}
      <div
        role="slider"
        aria-label="Drag to move panel. Use arrow keys to move, Shift for larger steps, Home to reset."
        aria-valuetext={
          position ? `Position: ${Math.round(position.x)}, ${Math.round(position.y)}` : 'Default position'
        }
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
          cursor: dragState.isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          borderRadius: 'var(--borderRadius-small)',
        }}
      >
        <span style={{fontWeight: 600, color: 'var(--fgColor-onEmphasis)', fontSize: '11px'}}>
          ⚡ Perf
          {prefersReducedMotion && (
            <span role="img" aria-label="Sparklines hidden (reduced motion)" style={{marginLeft: '4px'}}>
              🔇
            </span>
          )}
        </span>
        <div style={{display: 'flex', gap: '4px'}}>
          <MonitorButton
            onClick={() => setShowHelp(!showHelp)}
            label={showHelp ? 'Hide help' : 'Show help'}
            isActive={showHelp}
          >
            ?
          </MonitorButton>
          <MonitorButton onClick={onReset} label="Reset metrics">
            Reset
          </MonitorButton>
          <MonitorButton onClick={() => setIsCollapsed(true)} label="Collapse" fontSize="10px">
            ▲
          </MonitorButton>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && <HelpPanel prefersReducedMotion={prefersReducedMotion} />}

      {/* Metrics Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1px 6px', lineHeight: 1.5}}>
        {/* DOM count */}
        <DomCountDisplay />

        {/* Memory (Chrome only) */}
        <MemoryMetricRow prefersReducedMotion={prefersReducedMotion} />

        {/* Peak Memory */}
        <PeakMemoryDisplay />

        {/* Frame Section */}
        <FrameMetricsSection prefersReducedMotion={prefersReducedMotion} />

        {/* Input Section */}
        <InputMetricsSection />

        {/* Tasks Section */}
        <TaskMetricsSection />

        {/* Layout Section */}
        <LayoutMetricsSection />

        {/* Interactions Section */}
        <InteractionMetricsSection />

        {/* React Section */}
        <ReactMetricsSection />
      </div>
    </div>
  )
}

interface PerformancePanelOptions {
  initialPosition?: MonitorPosition
}

export const withPerformancePanel = (id: string, options: PerformancePanelOptions = {}): Decorator => {
  const {initialPosition = 'bottom-left'} = options
  return Story => {
    return (
      <PerformanceProvider initialPosition={initialPosition}>
        <ProfiledComponent id={id}>
          <Story />
        </ProfiledComponent>
      </PerformanceProvider>
    )
  }
}
