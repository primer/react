/**
 * @fileoverview Performance Monitor Addon - Metrics Collection Decorator
 *
 * This decorator instruments React components to collect comprehensive performance
 * metrics in real-time. It runs in Storybook's preview iframe and communicates
 * metrics to the panel via Storybook's channel API.
 *
 * ## Architecture
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Preview Iframe (this file)                                      │
 * │  ┌─────────────────────┐    ┌─────────────────────────────┐    │
 * │  │ PerformanceProvider │───▶│ Metrics Collection          │    │
 * │  │   └─ProfiledComponent│   │  • RAF loop (frame timing)  │    │
 * │  │       └─Story       │   │  • PerformanceObservers     │    │
 * │  └─────────────────────┘   │  • MutationObservers        │    │
 * │                             │  • Event listeners          │    │
 * │                             │  • React Profiler API       │    │
 * │                             └──────────────┬──────────────┘    │
 * │                                            │                    │
 * │                              channel.emit(METRICS_UPDATE)       │
 * └──────────────────────────────────────────────┼──────────────────┘
 *                                                │
 *                                                ▼
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Manager (performance-panel.tsx)                                 │
 * │  ┌─────────────────────┐                                        │
 * │  │ PerformancePanel    │◀── useChannel(METRICS_UPDATE)          │
 * │  │   └─MetricsSections │                                        │
 * │  └─────────────────────┘                                        │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Metrics Categories
 *
 * ### Frame Timing
 * - **FPS**: Frames per second calculated from requestAnimationFrame deltas
 * - **Frame Time**: Average milliseconds per frame (target: ≤16.67ms for 60fps)
 * - **Dropped Frames**: Frames exceeding 2× the expected frame time
 *
 * ### Input Responsiveness
 * - **Input Latency**: Time from pointer event to next animation frame
 * - **Paint Time**: Browser rendering time measured via double-RAF technique
 * - **INP (Interaction to Next Paint)**: Worst-case click/key interaction latency
 *
 * ### Main Thread Health
 * - **Long Tasks**: Tasks blocking main thread >50ms (via PerformanceObserver)
 * - **Total Blocking Time (TBT)**: Sum of (duration - 50ms) for all long tasks
 * - **Thrashing**: Style writes followed by long frames (forced sync layout)
 * - **DOM Churn**: Rate of DOM mutations per measurement period
 *
 * ### Layout Stability
 * - **CLS (Cumulative Layout Shift)**: Layout shift score without user input
 * - **Forced Reflows**: Layout property reads after style writes
 * - **Style Writes**: Inline style mutations observed via MutationObserver
 * - **CSS Variable Changes**: Custom property changes in inline styles
 *
 * ### React Performance
 * - **Mount Count/Duration**: Initial render metrics from React Profiler
 * - **Slow Updates**: React updates exceeding 16ms frame budget
 * - **P95 Duration**: 95th percentile React update time
 * - **Render Cascades**: Nested updates during commit phase
 *
 * ### Memory & Resources
 * - **Heap Usage**: Current JS heap size (Chrome only via performance.memory)
 * - **Memory Delta**: Change from baseline since last reset
 * - **GC Pressure**: Memory allocation rate in MB/s
 * - **Compositor Layers**: Elements promoted to GPU layers
 *
 * @module performance-decorator
 * @see {@link ./performance-panel.tsx} - The UI that displays these metrics
 * @see {@link ./performance-tool.tsx} - Addon registration constants
 *
 * @example
 * // In a story file
 * import { withPerformanceMonitor } from '../.storybook/src/performance-decorator';
 *
 * export default {
 *   title: 'Components/MyComponent',
 *   decorators: [withPerformanceMonitor],
 * };
 *
 * export const Default = () => <MyComponent />;
 */

import React from 'react'
import type {Decorator} from '@storybook/react-vite'
import {addons} from 'storybook/preview-api'
import {PERF_EVENTS} from './performance-types'
import {
  // Constants
  SPARKLINE_HISTORY_SIZE,
  // Utility functions
  computeAverage,
  computeP95,
  addToWindow,
  // Collector classes
  FrameTimingCollector,
  InputCollector,
  MainThreadCollector,
  LayoutShiftCollector,
  MemoryCollector,
  StyleMutationCollector,
  ForcedReflowCollector,
  ReactProfilerCollector,
  PaintCollector,
} from './performance-collectors'

// ============================================================================
// Timing Constants (decorator-specific)
// ============================================================================

/** How often to emit metrics to the panel (ms) */
const UPDATE_INTERVAL_MS = 50

/** How often to sample sparkline data points (ms) */
const SPARKLINE_SAMPLE_INTERVAL_MS = 200

// ============================================================================
// Metrics State (Internal)
// ============================================================================

/**
 * Internal state object for metrics not managed by collector classes.
 * Most metrics are now collected by the modular collector classes.
 * This interface only tracks decorator-specific state.
 *
 * @interface MetricsState
 * @private
 */
interface MetricsState {
  // ─────────────────────────────────────────────────────────────────────────
  // Sparkline History - Time series for trend visualization
  // (Collectors provide raw data, decorator builds time series)
  // ─────────────────────────────────────────────────────────────────────────

  /** FPS samples over time for sparkline chart. Size: 30 */
  fpsHistory: number[]

  /** Frame time samples over time for sparkline chart. Size: 30 */
  frameTimeHistory: number[]

  /** DOM element count in story container */
  domElements: number | null
}

function createInitialState(): MetricsState {
  return {
    fpsHistory: [],
    frameTimeHistory: [],
    domElements: null,
  }
}

// ============================================================================
// Computed Metrics (Panel API)
// ============================================================================

/**
 * Processed metrics sent to the panel via Storybook channel.
 * This is the public interface consumed by performance-panel.tsx.
 *
 * All values are computed from {@link MetricsState} with appropriate
 * averaging, rounding, and transformation applied.
 *
 * @interface ComputedMetrics
 * @public
 *
 * @example
 * // Receiving metrics in the panel:
 * channel.on(PERF_EVENTS.METRICS_UPDATE, (metrics: ComputedMetrics) => {
 *   console.log(`FPS: ${metrics.fps}, TBT: ${metrics.totalBlockingTime}ms`)
 * })
 */
export interface ComputedMetrics {
  // ─────────────────────────────────────────────────────────────────────────
  // Frame Timing
  // ─────────────────────────────────────────────────────────────────────────

  /** Frames per second (derived from avg frame time). Target: 60fps */
  fps: number

  /** Average frame duration (ms). Target: <16.67ms for 60fps */
  frameTime: number

  /** Peak frame time with decay (ms). Spikes indicate jank */
  maxFrameTime: number

  // ─────────────────────────────────────────────────────────────────────────
  // Input Responsiveness
  // ─────────────────────────────────────────────────────────────────────────

  /** Average input event processing latency (ms). Target: <100ms */
  inputLatency: number

  /** Peak input latency with decay (ms) */
  maxInputLatency: number

  /** Input jitter count - latency spikes vs baseline */
  inputJitter: number

  /** Interaction to Next Paint (ms) - 75th percentile. Core Web Vital */
  inpMs: number

  /** Total user interactions tracked */
  interactionCount: number

  // ─────────────────────────────────────────────────────────────────────────
  // Paint Performance
  // ─────────────────────────────────────────────────────────────────────────

  /** Average paint time (ms) */
  paintTime: number

  /** Peak paint time with decay (ms) */
  maxPaintTime: number

  /** Total paint operations observed */
  paintCount: number

  /** Paint jitter count - sudden spikes in paint time vs baseline */
  paintJitter: number

  // ─────────────────────────────────────────────────────────────────────────
  // Memory (Chrome only)
  // ─────────────────────────────────────────────────────────────────────────

  /** Current JS heap usage (MB). Null if unsupported */
  memoryUsedMB: number | null

  /** Memory change since reset (MB). Positive = growth */
  memoryDeltaMB: number | null

  /** Peak memory observed (MB) */
  peakMemoryMB: number | null

  /** Memory allocation rate (MB/s). High values indicate GC pressure */
  gcPressure: number

  // ─────────────────────────────────────────────────────────────────────────
  // Sparkline Data (Time Series)
  // ─────────────────────────────────────────────────────────────────────────

  /** FPS history for trend chart */
  fpsHistory: number[]

  /** Frame time history for trend chart */
  frameTimeHistory: number[]

  /** Memory history for trend chart */
  memoryHistory: number[]

  // ─────────────────────────────────────────────────────────────────────────
  // Main Thread Health
  // ─────────────────────────────────────────────────────────────────────────

  /** Tasks exceeding 50ms (Long Tasks API count) */
  longTasks: number

  /** Duration of longest observed task (ms) */
  longestTask: number

  /**
   * Total Blocking Time (ms) - sum of (longTask - 50ms).
   * Core Web Vital for interactivity. Good: <200ms, Poor: >600ms
   */
  totalBlockingTime: number

  /** Frames exceeding 2× frame budget (33.34ms at 60fps) */
  droppedFrames: number

  /** Frame jitter count - sudden spikes in frame time vs baseline */
  frameJitter: number

  /** Frame stability (0-100%). 100% = perfectly consistent, lower = choppy */
  frameStability: number

  // ─────────────────────────────────────────────────────────────────────────
  // Layout & Style
  // ─────────────────────────────────────────────────────────────────────────

  /** Style attribute mutations (potential thrashing sources) */
  styleWrites: number

  /** Layout thrashing score (style writes near long frames) */
  thrashingScore: number

  /** Cumulative Layout Shift score. Good: <0.1, Poor: >0.25 */
  layoutShiftScore: number

  /** Number of layout shift events */
  layoutShiftCount: number

  /** Synchronous reads that forced browser reflow */
  forcedReflowCount: number

  /** Average DOM mutations per frame. High: >50 */
  domMutationsPerFrame: number

  // ─────────────────────────────────────────────────────────────────────────
  // React Profiler
  // ─────────────────────────────────────────────────────────────────────────

  /** Total React render callbacks */
  reactRenderCount: number

  /** Mount phase renders (initial render) */
  reactMountCount: number

  /** Total mount phase duration (ms) */
  reactMountDuration: number

  /** Update renders (post-mount re-renders) */
  reactPostMountUpdateCount: number

  /** Longest update render duration (ms) */
  reactPostMountMaxDuration: number

  /** 95th percentile React update duration (ms) */
  reactP95Duration: number

  /** React updates exceeding 16ms frame budget */
  slowReactUpdates: number

  /** Render cascades (setState during render) */
  renderCascades: number

  // ─────────────────────────────────────────────────────────────────────────
  // DOM & Resources
  // ─────────────────────────────────────────────────────────────────────────

  /** Current DOM element count in story container */
  domElements: number | null

  /** Script evaluation time (ms) */
  scriptEvalTime: number

  /** CSS custom property changes */
  cssVarChanges: number

  // ─────────────────────────────────────────────────────────────────────────
  // Observer Counts (informational)
  // ─────────────────────────────────────────────────────────────────────────

  /** Active event listeners (when trackable) */
  eventListenerCount: number

  /** Active observers (Intersection, Mutation, Resize) */
  observerCount: number

  /** Compositor layers (DevTools protocol, often null) */
  compositorLayers: number | null
}

/**
 * Collector instances created eagerly during render.
 * All collectors are non-null after initialization.
 */
interface CollectorRefs {
  frame: FrameTimingCollector
  input: InputCollector
  mainThread: MainThreadCollector
  layoutShift: LayoutShiftCollector
  memory: MemoryCollector
  style: StyleMutationCollector
  reflow: ForcedReflowCollector
  react: ReactProfilerCollector
  paint: PaintCollector
}

/**
 * Transforms collector metrics into the panel-ready ComputedMetrics format.
 *
 * Gathers metrics from all collector instances and computes derived values:
 * - FPS from average frame time
 * - Memory delta from baseline
 * - P95 for React durations
 *
 * @param collectors - Collector instances
 * @param state - Decorator-specific state (sparklines, DOM count)
 * @returns Processed metrics ready for panel display
 * @private
 */
function computeMetrics(collectors: CollectorRefs, state: MetricsState): ComputedMetrics {
  const frame = collectors.frame.getMetrics()
  const input = collectors.input.getMetrics()
  const mainThread = collectors.mainThread.getMetrics()
  const layout = collectors.layoutShift.getMetrics()
  const memory = collectors.memory.getMetrics()
  const style = collectors.style.getMetrics()
  const reflow = collectors.reflow.getMetrics()
  const react = collectors.react.getMetrics()
  const paint = collectors.paint.getMetrics()

  const avgFrameTime = computeAverage(frame.frameTimes)
  const fps = avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0
  const avgInputLatency = computeAverage(input.inputLatencies)
  const avgPaintTime = computeAverage(input.paintTimes)
  const memoryDeltaMB =
    memory.lastMemoryMB !== null && memory.baselineMemoryMB !== null
      ? Math.round((memory.lastMemoryMB - memory.baselineMemoryMB) * 10) / 10
      : null

  return {
    fps,
    frameTime: Math.round(avgFrameTime * 10) / 10,
    maxFrameTime: Math.round(frame.maxFrameTime * 10) / 10,
    inputLatency: Math.round(avgInputLatency * 10) / 10,
    maxInputLatency: Math.round(input.maxInputLatency * 10) / 10,
    paintTime: Math.round(avgPaintTime * 10) / 10,
    maxPaintTime: Math.round(input.maxPaintTime * 10) / 10,
    inputJitter: input.inputJitter,
    memoryUsedMB: memory.lastMemoryMB,
    memoryDeltaMB,
    peakMemoryMB: memory.peakMemoryMB,
    fpsHistory: [...state.fpsHistory],
    frameTimeHistory: [...state.frameTimeHistory],
    memoryHistory: [...memory.memoryHistory],
    longTasks: mainThread.longTasks,
    longestTask: mainThread.longestTask,
    droppedFrames: frame.droppedFrames,
    frameJitter: frame.frameJitter,
    frameStability: frame.frameStability,
    styleWrites: style.styleWrites,
    thrashingScore: style.thrashingScore,
    layoutShiftScore: layout.layoutShiftScore,
    layoutShiftCount: layout.layoutShiftCount,
    interactionCount: input.interactionCount,
    inpMs: input.inpMs,
    reactMountCount: react.reactMountCount,
    reactMountDuration: react.reactMountDuration,
    reactRenderCount: react.reactRenderCount,
    reactPostMountUpdateCount: react.reactPostMountUpdateCount,
    reactPostMountMaxDuration: react.reactPostMountMaxDuration,
    renderCascades: react.nestedUpdateCount,
    domElements: state.domElements,
    forcedReflowCount: reflow.forcedReflowCount,
    eventListenerCount: 0, // Not currently tracked by collectors
    observerCount: 0, // Not currently tracked by collectors
    cssVarChanges: style.cssVarChanges,
    scriptEvalTime: Math.round(paint.scriptEvalTime * 10) / 10,
    gcPressure: Math.round(memory.gcPressure * 100) / 100,
    paintCount: paint.paintCount,
    paintJitter: input.paintJitter,
    compositorLayers: paint.compositorLayers,
    totalBlockingTime: Math.round(mainThread.totalBlockingTime),
    domMutationsPerFrame: Math.round(computeAverage(style.domMutationFrames)),
    slowReactUpdates: react.slowReactUpdates,
    reactP95Duration: computeP95(react.reactUpdateDurations),
  }
}

// ============================================================================
// React Context
// ============================================================================

/**
 * Context value provided by PerformanceProvider for manual metric reporting.
 * @interface PerformanceContextValue
 * @private
 */
interface PerformanceContextValue {
  /**
   * Reports a React render event from the Profiler component.
   * @param phase - 'mount' for initial render, 'update' for re-render, 'nested-update' for cascades
   * @param actualDuration - Time spent rendering the committed update (ms)
   * @param baseDuration - Estimated render time without memoization (ms)
   */
  reportReactRender: (phase: 'mount' | 'update' | 'nested-update', actualDuration: number, baseDuration: number) => void

  /**
   * Updates the DOM element count metric.
   * @param count - Number of DOM elements, or null if unavailable
   */
  setDomElements: (count: number | null) => void
}

/**
 * React context for performance metric reporting.
 * Used by ProfiledComponent to communicate with PerformanceProvider.
 * @private
 */
const PerformanceContext = React.createContext<PerformanceContextValue | null>(null)

/**
 * Hook to access performance context for manual metric reporting.
 * Returns null if not within a PerformanceProvider.
 *
 * @returns Performance context value or null
 * @public
 *
 * @example
 * function MyComponent() {
 *   const perf = usePerformanceContext()
 *   // perf?.reportReactRender('update', 5.2, 8.1)
 * }
 */
export function usePerformanceContext() {
  return React.useContext(PerformanceContext)
}

// ============================================================================
// Performance Provider
// ============================================================================

/**
 * Props for the PerformanceProvider component.
 * @interface PerformanceProviderProps
 * @private
 */
interface PerformanceProviderProps {
  /** React children to render and monitor */
  children: React.ReactNode
  /** Whether performance monitoring is enabled. Default: true */
  enabled?: boolean
}

/**
 * Main performance monitoring component for the preview iframe.
 *
 * This component orchestrates all metric collection by:
 * 1. Setting up PerformanceObserver for long tasks, layout shifts, paints, resources
 * 2. Running a requestAnimationFrame loop for frame timing
 * 3. Installing a MutationObserver for style writes and DOM mutation tracking
 * 4. Patching HTMLElement getters to detect forced reflows
 * 5. Listening for input events to measure latency
 * 6. Providing context for React Profiler integration
 * 7. Emitting metrics to the panel via Storybook channel
 *
 * @component
 * @param props - Component props
 * @param props.children - Content to render and monitor
 * @param props.enabled - Whether monitoring is active (default: true)
 *
 * @example
 * // Used by withPerformanceMonitor decorator
 * <PerformanceProvider enabled={shouldMonitor}>
 *   <Story />
 * </PerformanceProvider>
 *
 * @see {@link withPerformanceMonitor} - The decorator that uses this provider
 * @see {@link ComputedMetrics} - The metrics emitted to the panel
 */
export const PerformanceProvider = React.memo(function PerformanceProvider({
  children,
  enabled = true,
}: PerformanceProviderProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const stateRef = React.useRef<MetricsState>(createInitialState())
  // Create collectors outside of render to avoid react-hooks/refs rule.
  // We use useState with an initializer function which runs synchronously
  // during the first render, before children mount.
  const [collectors] = React.useState<CollectorRefs>(() => {
    const styleCollector = new StyleMutationCollector()
    const reflowCollector = new ForcedReflowCollector()
    styleCollector.onLayoutDirty = () => reflowCollector.markLayoutDirty()

    return {
      frame: new FrameTimingCollector(delta => styleCollector.checkThrashing(delta)),
      input: new InputCollector(),
      mainThread: new MainThreadCollector(),
      layoutShift: new LayoutShiftCollector(),
      memory: new MemoryCollector(),
      style: styleCollector,
      reflow: reflowCollector,
      react: new ReactProfilerCollector(),
      paint: new PaintCollector(),
    }
  })
  const lastComputedRef = React.useRef<ComputedMetrics | null>(null)

  // Reset all collectors and state
  const resetMetrics = React.useCallback(() => {
    collectors.frame.reset()
    collectors.input.reset()
    collectors.mainThread.reset()
    collectors.layoutShift.reset()
    collectors.memory.reset()
    collectors.style.reset()
    collectors.reflow.reset()
    collectors.react.reset()
    collectors.paint.reset()

    Object.assign(stateRef.current, createInitialState())
  }, [collectors])

  // React profiler callback - delegates to ReactProfilerCollector
  const reportReactRender = React.useCallback(
    (phase: 'mount' | 'update' | 'nested-update', actualDuration: number, _baseDuration: number) => {
      collectors.react.reportRender(phase, actualDuration)
    },
    [collectors],
  )

  const setDomElements = React.useCallback((count: number | null) => {
    stateRef.current.domElements = count
  }, [])

  // Main measurement loop - collectors already created in useState
  React.useEffect(() => {
    if (!enabled) return

    const state = stateRef.current
    const channel = addons.getChannel()

    // Start all collectors
    collectors.frame.start()
    collectors.input.start()
    collectors.mainThread.start()
    collectors.layoutShift.start()
    collectors.memory.start()
    collectors.style.start()
    collectors.reflow.start()
    collectors.react.start()
    collectors.paint.start()

    // Handle channel events
    const handleRequestMetrics = () => {
      const metricsToSend = lastComputedRef.current ?? computeMetrics(collectors, state)
      channel.emit(PERF_EVENTS.METRICS_UPDATE, metricsToSend)
    }

    const handleReset = () => {
      resetMetrics()
    }

    channel.on(PERF_EVENTS.REQUEST_METRICS, handleRequestMetrics)
    channel.on(PERF_EVENTS.RESET, handleReset)

    // Periodic updates for sparklines and metrics emission
    let lastUpdateTime = performance.now()
    let lastSparklineTime = performance.now()

    const updateLoop = () => {
      const now = performance.now()

      // Update memory and sparklines periodically
      if (now - lastSparklineTime >= SPARKLINE_SAMPLE_INTERVAL_MS) {
        lastSparklineTime = now
        collectors.memory.update()
        collectors.paint.updateCompositorLayers()

        // Build sparkline data from collector metrics
        const frameMetrics = collectors.frame.getMetrics()
        if (frameMetrics.frameTimes.length > 0) {
          const avgFrameTime = computeAverage(frameMetrics.frameTimes)
          const fps = Math.round(1000 / avgFrameTime)
          addToWindow(state.fpsHistory, fps, SPARKLINE_HISTORY_SIZE)
          addToWindow(state.frameTimeHistory, avgFrameTime, SPARKLINE_HISTORY_SIZE)
        }
      }

      // Emit computed metrics periodically to the panel
      if (now - lastUpdateTime >= UPDATE_INTERVAL_MS) {
        lastUpdateTime = now

        const computed = computeMetrics(collectors, state)
        lastComputedRef.current = computed
        channel.emit(PERF_EVENTS.METRICS_UPDATE, computed)
      }

      updateAnimationId = requestAnimationFrame(updateLoop)
    }

    let updateAnimationId = requestAnimationFrame(updateLoop)

    return () => {
      // Stop all collectors
      collectors.frame.stop()
      collectors.input.stop()
      collectors.mainThread.stop()
      collectors.layoutShift.stop()
      collectors.memory.stop()
      collectors.style.stop()
      collectors.reflow.stop()
      collectors.react.stop()
      collectors.paint.stop()

      cancelAnimationFrame(updateAnimationId)
      channel.off(PERF_EVENTS.REQUEST_METRICS, handleRequestMetrics)
      channel.off(PERF_EVENTS.RESET, handleReset)
    }
  }, [enabled, collectors, resetMetrics])

  // DOM element counting
  React.useEffect(() => {
    if (!enabled) return

    const countElements = () => {
      if (contentRef.current) {
        stateRef.current.domElements = contentRef.current.querySelectorAll('*').length
      }
    }

    countElements()

    if (contentRef.current) {
      const observer = new MutationObserver(countElements)
      observer.observe(contentRef.current, {childList: true, subtree: true})
      return () => observer.disconnect()
    }
    return undefined
  }, [enabled])

  const contextValue = React.useMemo(() => ({reportReactRender, setDomElements}), [reportReactRender, setDomElements])

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <PerformanceContext.Provider value={contextValue}>
      <div ref={contentRef}>{children}</div>
    </PerformanceContext.Provider>
  )
})

// ============================================================================
// Profiled Component Wrapper
// ============================================================================

/**
 * Wraps children in a React.Profiler to capture render timing metrics.
 *
 * Connects to the PerformanceProvider context to report:
 * - Mount vs update phases
 * - Actual render duration (time with memoization)
 * - Base duration (estimated time without memoization)
 * - Nested updates (setState during render)
 *
 * @component
 * @param props - Component props
 * @param props.id - Profiler ID for identification
 * @param props.children - Content to profile
 *
 * @example
 * <ProfiledComponent id="my-story">
 *   <MyComponent />
 * </ProfiledComponent>
 *
 * @see {@link https://react.dev/reference/react/Profiler React Profiler API}
 */
export const ProfiledComponent = React.memo(function ProfiledComponent({
  id,
  children,
}: {
  /** Unique identifier for this profiler instance */
  id: string
  /** React children to profile */
  children: React.ReactNode
}) {
  const context = usePerformanceContext()

  /**
   * Profiler callback - invoked on each commit.
   * Reports render metrics to PerformanceProvider.
   */
  const onRender = React.useCallback(
    (
      _profilerId: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
    ) => {
      context?.reportReactRender(phase, actualDuration, baseDuration)
    },
    [context],
  )

  return (
    <React.Profiler id={id} onRender={onRender}>
      {children}
    </React.Profiler>
  )
})

// ============================================================================
// Storybook Decorator
// ============================================================================

/**
 * Storybook decorator that enables performance monitoring for stories.
 *
 * When applied, this decorator:
 * 1. Wraps the story in a PerformanceProvider (starts all metric collection)
 * 2. Wraps the story in a ProfiledComponent (captures React render timing)
 * 3. Emits metrics to the addon panel every 50ms
 *
 * Apply to individual stories or globally in preview.tsx.
 *
 * @type {Decorator} - The story component to wrap
 * @returns The story wrapped with performance monitoring
 *
 * @example
 * // Per-story (in *.stories.tsx)
 * export default {
 *   decorators: [withPerformanceMonitor],
 * }
 *
 * @example
 * // Global (in .storybook/preview.tsx)
 * export const decorators = [withPerformanceMonitor]
 *
 * @see {@link PerformanceProvider} - The provider component
 * @see {@link ProfiledComponent} - The React Profiler wrapper
 * @see {@link ComputedMetrics} - The metrics sent to the panel
 */
export const withPerformanceMonitor: Decorator = (Story, ctx) => {
  return (
    <PerformanceProvider enabled>
      <ProfiledComponent id={ctx.id}>
        <Story />
      </ProfiledComponent>
    </PerformanceProvider>
  )
}
