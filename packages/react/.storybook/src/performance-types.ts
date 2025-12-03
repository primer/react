/**
 * @fileoverview Shared Types and Constants for Performance Monitor Addon
 *
 * This module provides the shared type definitions, constants, and thresholds
 * used across all performance monitoring components (decorator, panel, tool).
 *
 * Single source of truth for:
 * - Addon identifiers
 * - Channel event names
 * - Metrics interfaces
 * - Performance thresholds
 *
 * @module performance-types
 */

// ============================================================================
// Addon Identifiers
// ============================================================================

/**
 * Unique identifier for the Performance Monitor addon.
 * Used for addon registration and channel event namespacing.
 */
export const ADDON_ID = 'primer-performance-monitor'

/**
 * Panel identifier for the Performance Monitor UI.
 * Used when registering the addon panel in Storybook's manager.
 */
export const PANEL_ID = `${ADDON_ID}/panel`

// ============================================================================
// Channel Events
// ============================================================================

/**
 * Channel event names for communication between preview and manager.
 *
 * @example
 * // In decorator (preview)
 * channel.emit(PERF_EVENTS.METRICS_UPDATE, metrics)
 *
 * // In panel (manager)
 * channel.on(PERF_EVENTS.METRICS_UPDATE, handleMetrics)
 */
export const PERF_EVENTS = {
  /** Decorator → Panel: New metrics available */
  METRICS_UPDATE: `${ADDON_ID}/metrics-update`,
  /** Panel → Decorator: Reset all metrics to baseline */
  RESET: `${ADDON_ID}/reset`,
  /** Panel → Decorator: Request immediate metrics update */
  REQUEST_METRICS: `${ADDON_ID}/request-metrics`,
} as const

// ============================================================================
// Performance Thresholds
// ============================================================================

/**
 * Performance thresholds for metric color-coding and evaluation.
 *
 * Based on Web Vitals standards where applicable:
 * - FPS/Frame timing: 60fps target (16.67ms frame budget)
 * - Input latency: <100ms good, <300ms acceptable (RAIL model)
 * - CLS: <0.1 good, <0.25 needs improvement (Core Web Vital)
 * - INP: <200ms good, <500ms needs improvement (Core Web Vital)
 * - TBT: <200ms good, <600ms needs improvement (Lighthouse)
 *
 * Naming convention:
 * - `*_GOOD`: Green threshold (excellent performance)
 * - `*_WARNING`: Yellow threshold (needs attention)
 * - `*_DANGER`: Red threshold (poor performance)
 */
export const THRESHOLDS = {
  // ─────────────────────────────────────────────────────────────────────────
  // Frame Timing
  // ─────────────────────────────────────────────────────────────────────────
  /** FPS above this is good (green) */
  FPS_GOOD: 55,
  /** FPS below this is poor (red) */
  FPS_WARNING: 30,
  /** Target frame time for 60fps (ms) */
  FRAME_TIME_TARGET: 16.67,
  /** Frame time above this is poor (ms) */
  FRAME_TIME_WARNING: 32,
  /** Dropped frames above this indicates jank */
  DROPPED_FRAMES_WARNING: 10,

  // ─────────────────────────────────────────────────────────────────────────
  // Input Responsiveness
  // ─────────────────────────────────────────────────────────────────────────
  /** Input latency below this is excellent (ms) */
  INPUT_LATENCY_GOOD: 16,
  /** Input latency above this needs attention (ms) */
  INPUT_LATENCY_WARNING: 50,
  /** INP below this is good - Core Web Vital (ms) */
  INP_GOOD: 200,
  /** INP above this is poor - Core Web Vital (ms) */
  INP_WARNING: 500,

  // ─────────────────────────────────────────────────────────────────────────
  // Main Thread
  // ─────────────────────────────────────────────────────────────────────────
  /** Long tasks above this count needs attention */
  LONG_TASKS_WARNING: 5,
  /** Longest task above this is concerning (ms) */
  LONGEST_TASK_WARNING: 100,
  /** TBT below this is good (ms) - Lighthouse metric */
  TBT_WARNING: 200,
  /** TBT above this is poor (ms) */
  TBT_DANGER: 600,

  // ─────────────────────────────────────────────────────────────────────────
  // Layout & Style
  // ─────────────────────────────────────────────────────────────────────────
  /** CLS below this is good - Core Web Vital */
  CLS_GOOD: 0.1,
  /** CLS above this is poor - Core Web Vital */
  CLS_WARNING: 0.25,
  /** Forced reflows above this needs attention */
  FORCED_REFLOW_WARNING: 5,
  /** Forced reflows above this is serious */
  FORCED_REFLOW_DANGER: 20,
  /** DOM mutations/frame above this may cause jank */
  DOM_MUTATIONS_WARNING: 50,
  /** DOM mutations/frame above this likely causes jank */
  DOM_MUTATIONS_DANGER: 200,

  // ─────────────────────────────────────────────────────────────────────────
  // React
  // ─────────────────────────────────────────────────────────────────────────
  /** React render time below this is good (ms) */
  REACT_RENDER_GOOD: 8,
  /** React render time above this is slow (ms) */
  REACT_RENDER_WARNING: 16,
  /** Render cascades above this is problematic */
  CASCADE_WARNING: 3,
  /** Slow updates above this needs attention */
  SLOW_UPDATES_WARNING: 3,
  /** Slow updates above this is serious */
  SLOW_UPDATES_DANGER: 10,
  /** P95 React duration above this needs attention (ms) */
  REACT_P95_WARNING: 8,
  /** P95 React duration above this is poor (ms) */
  REACT_P95_DANGER: 16,

  // ─────────────────────────────────────────────────────────────────────────
  // Memory
  // ─────────────────────────────────────────────────────────────────────────
  /** Memory growth above this needs attention (MB) */
  MEMORY_DELTA_WARNING: 5,
  /** Memory growth above this indicates leak (MB) */
  MEMORY_DELTA_DANGER: 20,
  /** GC pressure above this indicates allocation issues (MB/s) */
  GC_PRESSURE_WARNING: 1,
  /** GC pressure above this is serious (MB/s) */
  GC_PRESSURE_DANGER: 5,

  // ─────────────────────────────────────────────────────────────────────────
  // Observers (informational)
  // ─────────────────────────────────────────────────────────────────────────
  /** Event listeners above this is high */
  EVENT_LISTENERS_WARNING: 50,
  /** Event listeners above this is very high */
  EVENT_LISTENERS_DANGER: 100,
  /** Observers above this is high */
  OBSERVERS_WARNING: 10,
  /** Observers above this is very high */
  OBSERVERS_DANGER: 25,
  /** CSS var changes above this is excessive */
  CSS_VAR_CHANGES_WARNING: 50,
  /** Compositor layers above this needs attention */
  LAYERS_WARNING: 20,
  /** Compositor layers above this is concerning */
  LAYERS_DANGER: 50,
} as const

export type ThresholdKey = keyof typeof THRESHOLDS

// ============================================================================
// Metrics Types
// ============================================================================

/**
 * Performance metrics transmitted from decorator to panel.
 *
 * This is the public API contract between the preview iframe (decorator)
 * and the manager UI (panel). All values are pre-computed and rounded.
 */
export interface PerformanceMetrics {
  // ─────────────────────────────────────────────────────────────────────────
  // Frame Timing
  // ─────────────────────────────────────────────────────────────────────────
  /** Frames per second (derived from avg frame time). Target: 60fps */
  fps: number
  /** Average frame duration (ms). Target: <16.67ms for 60fps */
  frameTime: number
  /** Peak frame time with decay (ms). Spikes indicate jank */
  maxFrameTime: number
  /** Frames exceeding 2× frame budget (33.34ms at 60fps) */
  droppedFrames: number
  /** Frame jitter count - sudden spikes in frame time vs baseline */
  frameJitter: number

  // ─────────────────────────────────────────────────────────────────────────
  // Input Responsiveness
  // ─────────────────────────────────────────────────────────────────────────
  /** Average input event processing latency (ms). Target: <100ms */
  inputLatency: number
  /** Peak input latency with decay (ms) */
  maxInputLatency: number
  /** Input jitter count - latency spikes vs baseline */
  inputJitter: number
  /** Total user interactions tracked */
  interactionCount: number
  /** Interaction to Next Paint (ms) - 75th percentile. Core Web Vital */
  inpMs: number

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
  /** Total Blocking Time (ms) - sum of (longTask - 50ms). Core Web Vital */
  totalBlockingTime: number

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
  /** CSS custom property changes */
  cssVarChanges: number

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
 * Default/initial metrics state (all zeros/nulls).
 * Used when panel first loads or after reset.
 */
export const DEFAULT_METRICS: PerformanceMetrics = {
  fps: 0,
  frameTime: 0,
  maxFrameTime: 0,
  droppedFrames: 0,
  frameJitter: 0,
  inputLatency: 0,
  maxInputLatency: 0,
  inputJitter: 0,
  interactionCount: 0,
  inpMs: 0,
  paintTime: 0,
  maxPaintTime: 0,
  paintCount: 0,
  memoryUsedMB: null,
  memoryDeltaMB: null,
  peakMemoryMB: null,
  gcPressure: 0,
  fpsHistory: [],
  frameTimeHistory: [],
  memoryHistory: [],
  longTasks: 0,
  longestTask: 0,
  totalBlockingTime: 0,
  styleWrites: 0,
  thrashingScore: 0,
  layoutShiftScore: 0,
  layoutShiftCount: 0,
  forcedReflowCount: 0,
  domMutationsPerFrame: 0,
  cssVarChanges: 0,
  reactRenderCount: 0,
  reactMountCount: 0,
  reactMountDuration: 0,
  reactPostMountUpdateCount: 0,
  reactPostMountMaxDuration: 0,
  reactP95Duration: 0,
  slowReactUpdates: 0,
  renderCascades: 0,
  domElements: null,
  scriptEvalTime: 0,
  eventListenerCount: 0,
  observerCount: 0,
  compositorLayers: null,
}

// ============================================================================
// Utility Types
// ============================================================================

/** Status variant for color-coded display */
export type StatusVariant = 'success' | 'warning' | 'error' | 'neutral'

/**
 * Determines status variant based on value and thresholds.
 *
 * @param value - Current metric value
 * @param good - Threshold for "good" (green)
 * @param warning - Threshold for "warning" (yellow)
 * @param higherIsBetter - If true, higher values are better (e.g., FPS)
 * @returns Status variant for styling
 */
export function getStatusVariant(value: number, good: number, warning: number, higherIsBetter = false): StatusVariant {
  if (higherIsBetter) {
    if (value >= good) return 'success'
    if (value >= warning) return 'warning'
    return 'error'
  }
  if (value <= good) return 'success'
  if (value <= warning) return 'warning'
  return 'error'
}

/**
 * Returns 'success' if value is zero, otherwise 'error'.
 * Used for metrics where zero is the ideal (e.g., jitter, cascades).
 */
export function getZeroIsGoodStatus(value: number): StatusVariant {
  return value === 0 ? 'success' : 'error'
}
