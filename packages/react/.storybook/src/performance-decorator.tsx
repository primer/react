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
  FRAME_TIME_60FPS,
  DROPPED_FRAME_MULTIPLIER,
  THRASHING_FRAME_THRESHOLD,
  THRASHING_STYLE_WRITE_WINDOW,
  INTERACTION_LATENCIES_WINDOW,
  FRAME_TIMES_WINDOW,
  INPUT_LATENCIES_WINDOW,
  PAINT_TIMES_WINDOW,
  SPARKLINE_HISTORY_SIZE,
  JITTER_BASELINE_SIZE,
  JITTER_MULTIPLIER,
  JITTER_INPUT_DELTA,
  JITTER_INPUT_ABSOLUTE,
  JITTER_FRAME_DELTA,
  JITTER_FRAME_ABSOLUTE,
  MAX_DECAY_THRESHOLD,
  MAX_DECAY_RATE,
  MAX_INPUT_DECAY_THRESHOLD,
  MAX_INPUT_DECAY_RATE,
  MAX_PAINT_DECAY_THRESHOLD,
  MAX_PAINT_DECAY_RATE,
  // Utility functions
  computeAverage,
  computeP95,
  getMemoryMB,
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
 * Internal state object for raw metrics collection.
 * This is NOT sent to the panel directly - see {@link ComputedMetrics}.
 *
 * Contains rolling windows of samples, peak trackers, and counters
 * that are processed by `computeMetrics()` before transmission.
 *
 * @interface MetricsState
 * @private
 */
interface MetricsState {
  // ─────────────────────────────────────────────────────────────────────────
  // Rolling Windows - Recent samples for computing averages
  // ─────────────────────────────────────────────────────────────────────────

  /** Recent frame times (ms) from requestAnimationFrame deltas. Window size: 60 */
  frameTimes: number[]

  /** Recent input event latencies (ms) from event timestamps. Window size: 30 */
  inputLatencies: number[]

  /** Recent paint times (ms) from PerformanceObserver. Window size: 30 */
  paintTimes: number[]

  // ─────────────────────────────────────────────────────────────────────────
  // Peak Values - Tracked with decay to avoid stale maxes
  // ─────────────────────────────────────────────────────────────────────────

  /** Peak frame time (ms) - decays when values drop below threshold */
  maxFrameTime: number

  /** Peak input latency (ms) - decays when values drop below threshold */
  maxInputLatency: number

  /** Peak paint time (ms) - decays when values drop below threshold */
  maxPaintTime: number

  // ─────────────────────────────────────────────────────────────────────────
  // Jitter Detection - Identifies inconsistent responsiveness
  // ─────────────────────────────────────────────────────────────────────────

  /** Count of input jitter events (latency spikes vs recent baseline) */
  inputJitter: number

  /** Recent input latencies for jitter baseline calculation */
  recentInputLatencies: number[]

  // ─────────────────────────────────────────────────────────────────────────
  // Memory Tracking - JS heap usage (Chrome only)
  // ─────────────────────────────────────────────────────────────────────────

  /** Memory at reset/start (MB) - used to compute delta */
  baselineMemoryMB: number | null

  /** Highest memory observed since reset (MB) */
  peakMemoryMB: number | null

  /** Most recent memory reading (MB) */
  lastMemoryMB: number | null

  // ─────────────────────────────────────────────────────────────────────────
  // Sparkline History - Time series for trend visualization
  // ─────────────────────────────────────────────────────────────────────────

  /** FPS samples over time for sparkline chart. Size: 30 */
  fpsHistory: number[]

  /** Frame time samples over time for sparkline chart. Size: 30 */
  frameTimeHistory: number[]

  /** Memory samples over time for sparkline chart. Size: 30 */
  memoryHistory: number[]

  // ─────────────────────────────────────────────────────────────────────────
  // Frame Health Counters
  // ─────────────────────────────────────────────────────────────────────────

  /** Frames exceeding 2× target frame time (33.34ms at 60fps) */
  droppedFrames: number

  /** Tasks exceeding 50ms (Long Tasks API) */
  longTasks: number

  /** Duration of longest task observed (ms) */
  longestTask: number

  // ─────────────────────────────────────────────────────────────────────────
  // Layout Thrashing Detection
  // ─────────────────────────────────────────────────────────────────────────

  /** Count of style attribute mutations (potential forced reflow triggers) */
  styleWrites: number

  /** Thrashing score: style writes near long frames indicate layout thrashing */
  thrashingScore: number

  // ─────────────────────────────────────────────────────────────────────────
  // Cumulative Layout Shift (CLS)
  // ─────────────────────────────────────────────────────────────────────────

  /** Cumulative layout shift score (0-1, should be <0.1 for good UX) */
  layoutShiftScore: number

  /** Number of individual layout shift events */
  layoutShiftCount: number

  // ─────────────────────────────────────────────────────────────────────────
  // Interaction to Next Paint (INP)
  // ─────────────────────────────────────────────────────────────────────────

  /** Total user interactions tracked */
  interactionCount: number

  /** Recent interaction latencies for INP calculation. Window: 50 */
  interactionLatencies: number[]

  /** Interaction to Next Paint - 75th percentile of interaction latencies */
  inpMs: number

  // ─────────────────────────────────────────────────────────────────────────
  // React Profiler Metrics
  // ─────────────────────────────────────────────────────────────────────────

  /** Total React Profiler onRender callbacks */
  reactRenderCount: number

  /** Components mounted (phase === 'mount') */
  reactMountCount: number

  /** Total time spent in mount renders (ms) */
  reactMountDuration: number

  /** Renders after mount phase (updates) */
  reactPostMountUpdateCount: number

  /** Longest post-mount update duration (ms) */
  reactPostMountMaxDuration: number

  /** Render cascades: setState during render (phase === 'nested-update') */
  nestedUpdateCount: number

  /** True after first post-mount update detected */
  mountPhaseComplete: boolean

  // ─────────────────────────────────────────────────────────────────────────
  // DOM Metrics
  // ─────────────────────────────────────────────────────────────────────────

  /** Current DOM element count in story container */
  domElements: number | null

  // ─────────────────────────────────────────────────────────────────────────
  // Extended Performance Metrics
  // ─────────────────────────────────────────────────────────────────────────

  /** Synchronous layout/style reads that forced browser reflow */
  forcedReflowCount: number

  /** Currently registered event listeners (when available) */
  eventListenerCount: number

  /** Active observers (Intersection, Mutation, Resize) */
  observerCount: number

  /** CSS custom property changes via setProperty */
  cssVarChanges: number

  /** Time spent evaluating scripts (ms) */
  scriptEvalTime: number

  /** Memory allocation rate (MB/s) - indicates GC pressure */
  gcPressure: number

  /** Paint events from PerformanceObserver */
  paintCount: number

  /** Compositor layers (when available via DevTools protocol) */
  compositorLayers: number | null

  // ─────────────────────────────────────────────────────────────────────────
  // Jank Detection Metrics (Advanced)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Total Blocking Time (TBT) - sum of (longTask - 50ms) for all long tasks.
   * Key Core Web Vital correlating with interactivity.
   * Lower is better; <200ms is good, <600ms needs improvement.
   */
  totalBlockingTime: number

  /**
   * Average DOM mutations per measurement frame.
   * High values (>50/frame) can cause jank from style recalculation.
   */
  domMutationsPerFrame: number

  /** Rolling window of DOM mutation counts per frame */
  domMutationFrames: number[]

  /**
   * React updates exceeding 16ms (one frame budget).
   * Indicates components that may cause dropped frames.
   */
  slowReactUpdates: number

  /** Recent React update durations for P95 calculation */
  reactUpdateDurations: number[]
}

function createInitialState(): MetricsState {
  return {
    frameTimes: [],
    inputLatencies: [],
    paintTimes: [],
    maxFrameTime: 0,
    maxInputLatency: 0,
    maxPaintTime: 0,
    inputJitter: 0,
    recentInputLatencies: [],
    baselineMemoryMB: null,
    peakMemoryMB: null,
    lastMemoryMB: null,
    fpsHistory: [],
    frameTimeHistory: [],
    memoryHistory: [],
    droppedFrames: 0,
    longTasks: 0,
    longestTask: 0,
    styleWrites: 0,
    thrashingScore: 0,
    layoutShiftScore: 0,
    layoutShiftCount: 0,
    interactionCount: 0,
    interactionLatencies: [],
    inpMs: 0,
    reactRenderCount: 0,
    reactMountCount: 0,
    reactMountDuration: 0,
    reactPostMountUpdateCount: 0,
    reactPostMountMaxDuration: 0,
    nestedUpdateCount: 0,
    mountPhaseComplete: false,
    domElements: null,
    forcedReflowCount: 0,
    eventListenerCount: 0,
    observerCount: 0,
    cssVarChanges: 0,
    scriptEvalTime: 0,
    gcPressure: 0,
    paintCount: 0,
    compositorLayers: null,
    totalBlockingTime: 0,
    domMutationsPerFrame: 0,
    domMutationFrames: [],
    slowReactUpdates: 0,
    reactUpdateDurations: [],
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
 * Transforms raw MetricsState into the panel-ready ComputedMetrics format.
 *
 * Applies:
 * - Averaging for rolling windows (frameTimes → frameTime)
 * - Rounding to 1 decimal place for display
 * - Memory delta calculation (current - baseline)
 * - P95 calculation for React durations
 *
 * @param m - Current raw metrics state
 * @returns Processed metrics ready for panel display
 * @private
 */
function computeMetrics(m: MetricsState): ComputedMetrics {
  const avgFrameTime = computeAverage(m.frameTimes)
  const fps = avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0
  const avgInputLatency = computeAverage(m.inputLatencies)
  const avgPaintTime = computeAverage(m.paintTimes)
  const memoryDeltaMB =
    m.lastMemoryMB !== null && m.baselineMemoryMB !== null
      ? Math.round((m.lastMemoryMB - m.baselineMemoryMB) * 10) / 10
      : null

  return {
    fps,
    frameTime: Math.round(avgFrameTime * 10) / 10,
    maxFrameTime: Math.round(m.maxFrameTime * 10) / 10,
    inputLatency: Math.round(avgInputLatency * 10) / 10,
    maxInputLatency: Math.round(m.maxInputLatency * 10) / 10,
    paintTime: Math.round(avgPaintTime * 10) / 10,
    maxPaintTime: Math.round(m.maxPaintTime * 10) / 10,
    inputJitter: m.inputJitter,
    memoryUsedMB: m.lastMemoryMB,
    memoryDeltaMB,
    peakMemoryMB: m.peakMemoryMB,
    fpsHistory: [...m.fpsHistory],
    frameTimeHistory: [...m.frameTimeHistory],
    memoryHistory: [...m.memoryHistory],
    longTasks: m.longTasks,
    longestTask: m.longestTask,
    droppedFrames: m.droppedFrames,
    styleWrites: m.styleWrites,
    thrashingScore: m.thrashingScore,
    layoutShiftScore: m.layoutShiftScore,
    layoutShiftCount: m.layoutShiftCount,
    interactionCount: m.interactionCount,
    inpMs: m.inpMs,
    reactMountCount: m.reactMountCount,
    reactMountDuration: m.reactMountDuration,
    reactRenderCount: m.reactRenderCount,
    reactPostMountUpdateCount: m.reactPostMountUpdateCount,
    reactPostMountMaxDuration: m.reactPostMountMaxDuration,
    renderCascades: m.nestedUpdateCount,
    domElements: m.domElements,
    forcedReflowCount: m.forcedReflowCount,
    eventListenerCount: m.eventListenerCount,
    observerCount: m.observerCount,
    cssVarChanges: m.cssVarChanges,
    scriptEvalTime: Math.round(m.scriptEvalTime * 10) / 10,
    gcPressure: Math.round(m.gcPressure * 100) / 100,
    paintCount: m.paintCount,
    compositorLayers: m.compositorLayers,
    totalBlockingTime: Math.round(m.totalBlockingTime),
    domMutationsPerFrame: Math.round(computeAverage(m.domMutationFrames)),
    slowReactUpdates: m.slowReactUpdates,
    reactP95Duration: computeP95(m.reactUpdateDurations),
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
  const lastComputedRef = React.useRef<ComputedMetrics | null>(null)

  const resetMetrics = React.useCallback(() => {
    const currentMemory = getMemoryMB()
    const m = stateRef.current
    const mountCount = m.reactMountCount
    const mountDuration = m.reactMountDuration

    Object.assign(m, createInitialState())
    m.reactMountCount = mountCount
    m.reactMountDuration = mountDuration
    m.baselineMemoryMB = currentMemory
    m.peakMemoryMB = currentMemory
    m.lastMemoryMB = currentMemory
  }, [])

  // React profiler callback
  const reportReactRender = React.useCallback(
    (phase: 'mount' | 'update' | 'nested-update', actualDuration: number, _baseDuration: number) => {
      const m = stateRef.current

      if (phase === 'nested-update') {
        m.nestedUpdateCount++
      }

      m.reactRenderCount++

      if (phase === 'mount') {
        m.reactMountCount++
        m.reactMountDuration += actualDuration
      } else {
        m.mountPhaseComplete = true
        m.reactPostMountUpdateCount++
        if (actualDuration > m.reactPostMountMaxDuration) {
          m.reactPostMountMaxDuration = actualDuration
        }

        // Track slow React updates (>16ms is a full frame budget)
        if (actualDuration > 16) {
          m.slowReactUpdates++
        }

        // Keep rolling window of update durations for P95 calculation
        m.reactUpdateDurations.push(actualDuration)
        if (m.reactUpdateDurations.length > 100) {
          m.reactUpdateDurations.shift()
        }
      }
    },
    [],
  )

  const setDomElements = React.useCallback((count: number | null) => {
    stateRef.current.domElements = count
  }, [])

  // Main measurement loop and channel communication
  React.useEffect(() => {
    if (!enabled) return

    const m = stateRef.current
    const channel = addons.getChannel()

    // Handle channel events
    const handleRequestMetrics = () => {
      // Always respond with current metrics, even if we haven't computed any yet
      // This lets the panel know the decorator is active
      const metricsToSend = lastComputedRef.current ?? computeMetrics(m)
      channel.emit(PERF_EVENTS.METRICS_UPDATE, metricsToSend)
    }

    const handleReset = () => {
      resetMetrics()
    }

    channel.on(PERF_EVENTS.REQUEST_METRICS, handleRequestMetrics)
    channel.on(PERF_EVENTS.RESET, handleReset)

    let animationId: number
    let lastTime = performance.now()
    let lastUpdateTime = performance.now()
    let lastSparklineTime = performance.now()
    let styleWriteCount = 0
    let lastStyleWriteTime = 0

    const processFrame = (delta: number) => {
      // Add to rolling window
      m.frameTimes.push(delta)
      if (m.frameTimes.length > FRAME_TIMES_WINDOW) m.frameTimes.shift()

      // Update max with decay
      if (delta > m.maxFrameTime) {
        m.maxFrameTime = delta
      } else if (delta < MAX_DECAY_THRESHOLD && m.maxFrameTime > MAX_DECAY_THRESHOLD) {
        m.maxFrameTime *= MAX_DECAY_RATE
      }

      // Dropped frames
      if (delta > FRAME_TIME_60FPS * DROPPED_FRAME_MULTIPLIER) {
        m.droppedFrames += Math.floor(delta / FRAME_TIME_60FPS) - 1
      }

      // Frame jitter detection
      if (m.frameTimes.length >= JITTER_BASELINE_SIZE) {
        const baselineFrames = m.frameTimes.slice(-JITTER_BASELINE_SIZE, -1)
        const avgBaseline = computeAverage(baselineFrames)
        const isJitter =
          delta > avgBaseline * JITTER_MULTIPLIER &&
          delta - avgBaseline > JITTER_FRAME_DELTA &&
          delta > JITTER_FRAME_ABSOLUTE
        if (isJitter) m.inputJitter++
      }
    }

    const processInput = (latency: number) => {
      m.inputLatencies.push(latency)
      if (m.inputLatencies.length > INPUT_LATENCIES_WINDOW) m.inputLatencies.shift()

      // Update max with decay
      if (latency > m.maxInputLatency) {
        m.maxInputLatency = latency
      } else if (latency < MAX_INPUT_DECAY_THRESHOLD && m.maxInputLatency > MAX_INPUT_DECAY_THRESHOLD) {
        m.maxInputLatency *= MAX_INPUT_DECAY_RATE
      }

      // Input jitter detection
      m.recentInputLatencies.push(latency)
      if (m.recentInputLatencies.length > 10) m.recentInputLatencies.shift()
      if (m.recentInputLatencies.length >= JITTER_BASELINE_SIZE) {
        const baseline = m.recentInputLatencies.slice(0, -1)
        const avgBaseline = computeAverage(baseline)
        if (
          latency > avgBaseline * JITTER_MULTIPLIER &&
          latency - avgBaseline > JITTER_INPUT_DELTA &&
          latency > JITTER_INPUT_ABSOLUTE
        ) {
          m.inputJitter++
        }
      }
    }

    const processPaint = (paintTime: number) => {
      m.paintTimes.push(paintTime)
      if (m.paintTimes.length > PAINT_TIMES_WINDOW) m.paintTimes.shift()

      if (paintTime > m.maxPaintTime) {
        m.maxPaintTime = paintTime
      } else if (paintTime < MAX_PAINT_DECAY_THRESHOLD && m.maxPaintTime > MAX_PAINT_DECAY_THRESHOLD) {
        m.maxPaintTime *= MAX_PAINT_DECAY_RATE
      }
    }

    const updateMemory = () => {
      const memory = getMemoryMB()
      if (memory === null) return

      m.lastMemoryMB = memory
      if (m.baselineMemoryMB === null) m.baselineMemoryMB = memory
      if (m.peakMemoryMB === null || memory > m.peakMemoryMB) m.peakMemoryMB = memory

      m.memoryHistory.push(memory)
      if (m.memoryHistory.length > SPARKLINE_HISTORY_SIZE) m.memoryHistory.shift()
    }

    const updateSparklines = () => {
      if (m.frameTimes.length > 0) {
        const avgFrameTime = computeAverage(m.frameTimes)
        const fps = Math.round(1000 / avgFrameTime)

        m.fpsHistory.push(fps)
        if (m.fpsHistory.length > SPARKLINE_HISTORY_SIZE) m.fpsHistory.shift()

        m.frameTimeHistory.push(avgFrameTime)
        if (m.frameTimeHistory.length > SPARKLINE_HISTORY_SIZE) m.frameTimeHistory.shift()
      }
    }

    const checkForThrashing = (frameTime: number) => {
      const now = performance.now()
      const timeSinceLastWrite = now - lastStyleWriteTime
      const hadRecentStyleWrite = styleWriteCount > 0 && timeSinceLastWrite < THRASHING_STYLE_WRITE_WINDOW

      if (hadRecentStyleWrite && frameTime > THRASHING_FRAME_THRESHOLD) {
        m.thrashingScore++
      }

      styleWriteCount = 0
    }

    const measure = () => {
      const now = performance.now()
      const delta = now - lastTime
      lastTime = now

      processFrame(delta)
      checkForThrashing(delta)

      // Sample sparkline data more frequently than panel updates
      if (now - lastSparklineTime >= SPARKLINE_SAMPLE_INTERVAL_MS) {
        lastSparklineTime = now
        updateMemory()
        updateSparklines()
      }

      // Emit computed metrics periodically to the panel
      if (now - lastUpdateTime >= UPDATE_INTERVAL_MS) {
        lastUpdateTime = now

        const computed = computeMetrics(m)
        lastComputedRef.current = computed
        channel.emit(PERF_EVENTS.METRICS_UPDATE, computed)
      }

      animationId = requestAnimationFrame(measure)
    }

    // Input latency tracking
    const handlePointerMove = (event: PointerEvent) => {
      const eventTime = event.timeStamp
      requestAnimationFrame(() => {
        const rafTime = performance.now()
        const latency = rafTime - eventTime
        processInput(latency)

        // Paint time measurement via double-RAF
        requestAnimationFrame(() => {
          const paintEnd = performance.now()
          const paintTime = paintEnd - rafTime
          processPaint(paintTime)
        })
      })
    }

    // Long task observer - also calculates Total Blocking Time (TBT)
    let longTaskObserver: PerformanceObserver | null = null
    try {
      longTaskObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          m.longTasks++
          if (entry.duration > m.longestTask) m.longestTask = entry.duration
          // TBT = sum of (duration - 50ms) for all long tasks
          // Long tasks are >50ms, so we accumulate the "blocking" portion
          m.totalBlockingTime += Math.max(0, entry.duration - 50)
        }
      })
      longTaskObserver.observe({type: 'longtask'})
    } catch {
      /* Not supported */
    }

    // Style mutation observer - also tracks CSS variable changes
    const styleObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          m.styleWrites++
          styleWriteCount++
          lastStyleWriteTime = performance.now()
          markLayoutDirty() // Mark layout dirty for forced reflow detection

          // Count CSS variable changes by checking if style contains "--"
          const target = mutation.target as HTMLElement
          const styleValue = target.getAttribute('style') || ''
          const cssVarMatches = styleValue.match(/--[\w-]+\s*:/g)
          if (cssVarMatches) {
            m.cssVarChanges += cssVarMatches.length
          }
        }
      }
    })
    styleObserver.observe(document.body, {attributes: true, attributeFilter: ['style'], subtree: true})

    // DOM mutation observer for counting DOM churn
    let domMutationCount = 0
    const domMutationObserver = new MutationObserver(mutations => {
      // Count meaningful DOM mutations (not just style changes)
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          domMutationCount += mutation.addedNodes.length + mutation.removedNodes.length
        } else if (mutation.type === 'attributes' && mutation.attributeName !== 'style') {
          domMutationCount++
        }
      }
    })
    domMutationObserver.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'id', 'data-state', 'aria-expanded', 'aria-hidden', 'hidden', 'disabled'],
    })

    // Sample DOM mutations per frame periodically
    const domMutationSampleInterval = setInterval(() => {
      m.domMutationFrames.push(domMutationCount)
      if (m.domMutationFrames.length > 30) m.domMutationFrames.shift()
      domMutationCount = 0
    }, SPARKLINE_SAMPLE_INTERVAL_MS)

    // Layout shift observer
    let layoutShiftObserver: PerformanceObserver | null = null
    try {
      layoutShiftObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const shiftEntry = entry as any
          if (!shiftEntry.hadRecentInput) {
            m.layoutShiftScore += shiftEntry.value
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
          if (m.interactionLatencies.length > INTERACTION_LATENCIES_WINDOW) m.interactionLatencies.shift()
          if (latency > m.inpMs) m.inpMs = latency
        })
      })
    }

    // ========================================================================
    // NEW METRICS: Forced Reflow Detection
    // ========================================================================
    // Instrument layout-triggering getters to detect forced reflows
    // A forced reflow happens when you read layout properties after writing styles
    // before the browser has had a chance to do layout naturally
    //
    // Note: This modifies HTMLElement.prototype globally. We use a registry pattern
    // so multiple decorator instances can share the instrumentation.
    const reflowTriggeringProps = [
      'offsetTop',
      'offsetLeft',
      'offsetWidth',
      'offsetHeight',
      'scrollTop',
      'scrollLeft',
      'scrollWidth',
      'scrollHeight',
      'clientTop',
      'clientLeft',
      'clientWidth',
      'clientHeight',
    ] as const

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reflowRegistry = ((window as any).__perfReflowRegistry =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__perfReflowRegistry || {
        initialized: false,
        originalGetters: new Map<string, PropertyDescriptor>(),
        layoutDirty: false,
        dirtyTimeout: null as ReturnType<typeof setTimeout> | null,
        metricsRef: null as MetricsState | null,
      })

    // Update the metrics reference for the current instance
    reflowRegistry.metricsRef = m

    const markLayoutDirty = () => {
      reflowRegistry.layoutDirty = true
      // Clear dirty flag after next microtask (when browser would naturally layout)
      if (reflowRegistry.dirtyTimeout) clearTimeout(reflowRegistry.dirtyTimeout)
      reflowRegistry.dirtyTimeout = setTimeout(() => {
        reflowRegistry.layoutDirty = false
      }, 0)
    }

    if (!reflowRegistry.initialized) {
      reflowRegistry.initialized = true

      for (const prop of reflowTriggeringProps) {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop)
        if (descriptor?.get) {
          reflowRegistry.originalGetters.set(prop, descriptor)
          Object.defineProperty(HTMLElement.prototype, prop, {
            get() {
              if (reflowRegistry.layoutDirty && reflowRegistry.metricsRef) {
                reflowRegistry.metricsRef.forcedReflowCount++
                reflowRegistry.layoutDirty = false // Only count once per dirty cycle
              }
              return descriptor.get!.call(this)
            },
            configurable: true,
          })
        }
      }
    }

    // We don't restore on cleanup since it's shared - just null out the ref
    const restoreReflowDetection = () => {
      // Clear any pending timeout
      if (reflowRegistry.dirtyTimeout) {
        clearTimeout(reflowRegistry.dirtyTimeout)
        reflowRegistry.dirtyTimeout = null
      }
      // Don't restore the getters - they're shared across instances
    }

    // ========================================================================
    // NEW METRICS: Script Evaluation Time (via PerformanceObserver)
    // ========================================================================
    // Track long tasks that are script-related and resource timing
    let scriptObserver: PerformanceObserver | null = null
    try {
      scriptObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            // Only count actual script resources (not just .js files)
            const resourceEntry = entry as PerformanceResourceTiming
            if (resourceEntry.initiatorType === 'script') {
              // Use responseEnd - fetchStart for total script load+parse time
              const scriptTime = resourceEntry.responseEnd - resourceEntry.fetchStart
              if (scriptTime > 0) {
                m.scriptEvalTime += scriptTime
              }
            }
          }
        }
      })
      scriptObserver.observe({type: 'resource', buffered: true})
    } catch {
      /* Not supported */
    }

    // ========================================================================
    // NEW METRICS: GC Pressure (Memory Allocation Rate)
    // ========================================================================
    let lastGcCheckTime = performance.now()
    let lastGcMemory = getMemoryMB()

    const updateGcPressure = () => {
      const now = performance.now()
      const currentMemory = getMemoryMB()
      if (currentMemory !== null && lastGcMemory !== null) {
        const timeDelta = (now - lastGcCheckTime) / 1000 // seconds
        if (timeDelta > 0) {
          const memoryDelta = currentMemory - lastGcMemory
          // Only track positive growth (allocations)
          if (memoryDelta > 0) {
            m.gcPressure = memoryDelta / timeDelta // MB/s
          } else {
            // Decay the pressure reading
            m.gcPressure *= 0.9
          }
        }
      }
      lastGcCheckTime = now
      lastGcMemory = currentMemory
    }

    // ========================================================================
    // NEW METRICS: Paint Count
    // ========================================================================
    let paintObserver: PerformanceObserver | null = null
    try {
      paintObserver = new PerformanceObserver(list => {
        m.paintCount += list.getEntries().length
      })
      paintObserver.observe({type: 'paint', buffered: true})
    } catch {
      /* Not supported */
    }

    // ========================================================================
    // NEW METRICS: Compositor Layers (Chrome only)
    // ========================================================================
    const updateCompositorLayers = () => {
      // Count elements with will-change or transform that promote to layers
      const layerPromotingSelectors = [
        '[style*="will-change"]',
        '[style*="transform: translate"]',
        '[style*="transform:translate"]',
        '[style*="translateZ"]',
        '[style*="translate3d"]',
      ]

      let layerCount = 0
      for (const selector of layerPromotingSelectors) {
        try {
          layerCount += document.querySelectorAll(selector).length
        } catch {
          /* Invalid selector */
        }
      }

      // Also count elements with computed will-change
      const allElements = document.querySelectorAll('*')
      for (const el of allElements) {
        const style = getComputedStyle(el)
        if (style.willChange && style.willChange !== 'auto') {
          layerCount++
        }
      }

      m.compositorLayers = layerCount
    }

    // Periodic updates for new metrics
    const newMetricsInterval = setInterval(() => {
      updateGcPressure()
      updateCompositorLayers()
    }, 1000)

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    animationId = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(newMetricsInterval)
      clearInterval(domMutationSampleInterval)
      styleObserver.disconnect()
      domMutationObserver.disconnect()
      longTaskObserver?.disconnect()
      layoutShiftObserver?.disconnect()
      scriptObserver?.disconnect()
      paintObserver?.disconnect()
      restoreReflowDetection()
      // Note: We don't restore EventTarget, Observer proxies, or CSSStyleDeclaration
      // because they're shared across all instances and should persist.
      // The registries use refs that get updated per-instance.
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      channel.off(PERF_EVENTS.REQUEST_METRICS, handleRequestMetrics)
      channel.off(PERF_EVENTS.RESET, handleReset)
    }
  }, [enabled, resetMetrics])

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
