/**
 * @fileoverview Metric Collector Modules for Performance Monitor
 *
 * This module provides modular, focused collector classes that each handle
 * a specific category of performance metrics. This separation improves:
 * - Testability: Each collector can be tested in isolation
 * - Readability: Single responsibility per collector
 * - Maintainability: Changes to one metric type don't affect others
 *
 * ## Collector Pattern
 *
 * Each collector implements a simple interface:
 * - `start()` - Begin collecting metrics
 * - `stop()` - Clean up observers/listeners
 * - `reset()` - Reset metrics to baseline
 * - `getMetrics()` - Return current metrics
 *
 * @module performance-collectors
 */

// ============================================================================
// Collector Configuration Constants
// ============================================================================

/** Target frame time for 60fps rendering (ms) */
export const FRAME_TIME_60FPS = 16.67

/** Multiplier for detecting dropped frames (frame > 16.67ms × 2 = dropped) */
export const DROPPED_FRAME_MULTIPLIER = 2

/** Frame time threshold (ms) for detecting layout thrashing */
export const THRASHING_FRAME_THRESHOLD = 50

/** Time window (ms) for associating style writes with long frames */
export const THRASHING_STYLE_WRITE_WINDOW = 50

/** Max interaction latencies to keep for INP calculation */
export const INTERACTION_LATENCIES_WINDOW = 50

/** Rolling window size for frame time samples */
export const FRAME_TIMES_WINDOW = 60

/** Rolling window size for input latency samples */
export const INPUT_LATENCIES_WINDOW = 30

/** Rolling window size for paint time samples */
export const PAINT_TIMES_WINDOW = 30

/** Number of data points to keep for sparkline charts */
export const SPARKLINE_HISTORY_SIZE = 30

/** Number of recent samples to use for jitter baseline */
export const JITTER_BASELINE_SIZE = 5

/** Jitter = spike exceeding baseline × this multiplier */
export const JITTER_MULTIPLIER = 3

/** Minimum delta (ms) from baseline to count as input jitter */
export const JITTER_INPUT_DELTA = 30

/** Minimum absolute value (ms) to count as input jitter */
export const JITTER_INPUT_ABSOLUTE = 50

/** Minimum delta (ms) from baseline to count as frame jitter */
export const JITTER_FRAME_DELTA = 20

/** Minimum absolute value (ms) to count as frame jitter */
export const JITTER_FRAME_ABSOLUTE = 40

/** Threshold below which max values start to decay */
export const MAX_DECAY_THRESHOLD = 20

/** Decay rate per frame for max frame time */
export const MAX_DECAY_RATE = 0.99

/** Threshold below which max input latency starts to decay */
export const MAX_INPUT_DECAY_THRESHOLD = 20

/** Decay rate per frame for max input latency */
export const MAX_INPUT_DECAY_RATE = 0.98

/** Threshold below which max paint time starts to decay */
export const MAX_PAINT_DECAY_THRESHOLD = 10

/** Decay rate per frame for max paint time */
export const MAX_PAINT_DECAY_RATE = 0.98

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Computes the arithmetic mean of a numeric array.
 */
export function computeAverage(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

/**
 * Computes the 95th percentile of a numeric array.
 */
export function computeP95(arr: number[]): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.floor(sorted.length * 0.95)
  return Math.round(sorted[Math.min(idx, sorted.length - 1)] * 10) / 10
}

/**
 * Gets current JavaScript heap memory usage in megabytes.
 * Only available in Chromium-based browsers.
 */
export function getMemoryMB(): number | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = (performance as any).memory
  if (memory?.usedJSHeapSize) {
    return Math.round((memory.usedJSHeapSize / 1024 / 1024) * 10) / 10
  }
  return null
}

/**
 * Adds a value to a rolling window array, removing oldest if over limit.
 */
export function addToWindow(arr: number[], value: number, maxSize: number): void {
  arr.push(value)
  if (arr.length > maxSize) arr.shift()
}

/**
 * Updates a max value with decay behavior.
 */
export function updateMaxWithDecay(
  currentMax: number,
  newValue: number,
  decayThreshold: number,
  decayRate: number,
): number {
  if (newValue > currentMax) {
    return newValue
  }
  if (newValue < decayThreshold && currentMax > decayThreshold) {
    return currentMax * decayRate
  }
  return currentMax
}

// ============================================================================
// Collector Interface
// ============================================================================

/**
 * Base interface for all metric collectors.
 * Each collector is responsible for a specific category of metrics.
 */
export interface MetricCollector<T> {
  /** Start collecting metrics */
  start(): void
  /** Stop collecting and clean up */
  stop(): void
  /** Reset metrics to initial state */
  reset(): void
  /** Get current metrics */
  getMetrics(): T
}

// ============================================================================
// Frame Timing Metrics
// ============================================================================

export interface FrameTimingMetrics {
  frameTimes: number[]
  maxFrameTime: number
  droppedFrames: number
  frameJitter: number
}

/**
 * Collects frame timing metrics using requestAnimationFrame.
 *
 * Tracks:
 * - Frame duration via RAF delta
 * - Dropped frames (>2× budget)
 * - Max frame time with decay
 * - Frame jitter (sudden spikes)
 */
export class FrameTimingCollector implements MetricCollector<FrameTimingMetrics> {
  #frameTimes: number[] = []
  #maxFrameTime = 0
  #droppedFrames = 0
  #frameJitter = 0
  #lastTime = 0
  #animationId: number | null = null
  #onFrame?: (delta: number) => void

  constructor(onFrame?: (delta: number) => void) {
    this.#onFrame = onFrame
  }

  start(): void {
    this.#lastTime = performance.now()
    this.#measure()
  }

  stop(): void {
    if (this.#animationId !== null) {
      cancelAnimationFrame(this.#animationId)
      this.#animationId = null
    }
  }

  reset(): void {
    this.#frameTimes = []
    this.#maxFrameTime = 0
    this.#droppedFrames = 0
    this.#frameJitter = 0
  }

  getMetrics(): FrameTimingMetrics {
    return {
      frameTimes: [...this.#frameTimes],
      maxFrameTime: this.#maxFrameTime,
      droppedFrames: this.#droppedFrames,
      frameJitter: this.#frameJitter,
    }
  }

  #measure = (): void => {
    const now = performance.now()
    const delta = now - this.#lastTime
    this.#lastTime = now

    this.#processFrame(delta)
    this.#onFrame?.(delta)

    this.#animationId = requestAnimationFrame(this.#measure)
  }

  #processFrame(delta: number): void {
    // Add to rolling window
    addToWindow(this.#frameTimes, delta, FRAME_TIMES_WINDOW)

    // Update max with decay
    this.#maxFrameTime = updateMaxWithDecay(this.#maxFrameTime, delta, MAX_DECAY_THRESHOLD, MAX_DECAY_RATE)

    // Dropped frames
    if (delta > FRAME_TIME_60FPS * DROPPED_FRAME_MULTIPLIER) {
      this.#droppedFrames += Math.floor(delta / FRAME_TIME_60FPS) - 1
    }

    // Frame jitter detection
    if (this.#frameTimes.length >= JITTER_BASELINE_SIZE) {
      const baselineFrames = this.#frameTimes.slice(-JITTER_BASELINE_SIZE, -1)
      const avgBaseline = computeAverage(baselineFrames)
      const isJitter =
        delta > avgBaseline * JITTER_MULTIPLIER &&
        delta - avgBaseline > JITTER_FRAME_DELTA &&
        delta > JITTER_FRAME_ABSOLUTE
      if (isJitter) this.#frameJitter++
    }
  }
}

// ============================================================================
// Input Latency Metrics
// ============================================================================

export interface InputMetrics {
  inputLatencies: number[]
  maxInputLatency: number
  inputJitter: number
  paintTimes: number[]
  maxPaintTime: number
  interactionCount: number
  interactionLatencies: number[]
  inpMs: number
}

/**
 * Collects input responsiveness metrics.
 *
 * Tracks:
 * - Input latency (event to RAF)
 * - Paint time (double-RAF technique)
 * - INP (Interaction to Next Paint)
 * - Input jitter
 */
export class InputCollector implements MetricCollector<InputMetrics> {
  #inputLatencies: number[] = []
  #maxInputLatency = 0
  #inputJitter = 0
  #recentInputLatencies: number[] = []
  #paintTimes: number[] = []
  #maxPaintTime = 0
  #interactionCount = 0
  #interactionLatencies: number[] = []
  #inpMs = 0

  #boundHandlePointerMove: (e: PointerEvent) => void
  #boundHandleInteraction: (e: MouseEvent | KeyboardEvent) => void

  constructor() {
    this.#boundHandlePointerMove = this.#handlePointerMove.bind(this)
    this.#boundHandleInteraction = this.#handleInteraction.bind(this)
  }

  start(): void {
    window.addEventListener('pointermove', this.#boundHandlePointerMove)
    window.addEventListener('click', this.#boundHandleInteraction)
    window.addEventListener('keydown', this.#boundHandleInteraction)
  }

  stop(): void {
    window.removeEventListener('pointermove', this.#boundHandlePointerMove)
    window.removeEventListener('click', this.#boundHandleInteraction)
    window.removeEventListener('keydown', this.#boundHandleInteraction)
  }

  reset(): void {
    this.#inputLatencies = []
    this.#maxInputLatency = 0
    this.#inputJitter = 0
    this.#recentInputLatencies = []
    this.#paintTimes = []
    this.#maxPaintTime = 0
    this.#interactionCount = 0
    this.#interactionLatencies = []
    this.#inpMs = 0
  }

  getMetrics(): InputMetrics {
    return {
      inputLatencies: [...this.#inputLatencies],
      maxInputLatency: this.#maxInputLatency,
      inputJitter: this.#inputJitter,
      paintTimes: [...this.#paintTimes],
      maxPaintTime: this.#maxPaintTime,
      interactionCount: this.#interactionCount,
      interactionLatencies: [...this.#interactionLatencies],
      inpMs: this.#inpMs,
    }
  }

  #handlePointerMove(event: PointerEvent): void {
    const eventTime = event.timeStamp
    requestAnimationFrame(() => {
      const rafTime = performance.now()
      const latency = rafTime - eventTime
      this.#processInput(latency)

      // Paint time measurement via double-RAF
      requestAnimationFrame(() => {
        const paintEnd = performance.now()
        const paintTime = paintEnd - rafTime
        this.#processPaint(paintTime)
      })
    })
  }

  #handleInteraction(event: MouseEvent | KeyboardEvent): void {
    const eventTime = event.timeStamp
    this.#interactionCount++
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const latency = performance.now() - eventTime
        addToWindow(this.#interactionLatencies, latency, INTERACTION_LATENCIES_WINDOW)
        if (latency > this.#inpMs) this.#inpMs = latency
      })
    })
  }

  #processInput(latency: number): void {
    addToWindow(this.#inputLatencies, latency, INPUT_LATENCIES_WINDOW)

    // Update max with decay
    this.#maxInputLatency = updateMaxWithDecay(
      this.#maxInputLatency,
      latency,
      MAX_INPUT_DECAY_THRESHOLD,
      MAX_INPUT_DECAY_RATE,
    )

    // Input jitter detection
    this.#recentInputLatencies.push(latency)
    if (this.#recentInputLatencies.length > 10) this.#recentInputLatencies.shift()
    if (this.#recentInputLatencies.length >= JITTER_BASELINE_SIZE) {
      const baseline = this.#recentInputLatencies.slice(0, -1)
      const avgBaseline = computeAverage(baseline)
      if (
        latency > avgBaseline * JITTER_MULTIPLIER &&
        latency - avgBaseline > JITTER_INPUT_DELTA &&
        latency > JITTER_INPUT_ABSOLUTE
      ) {
        this.#inputJitter++
      }
    }
  }

  #processPaint(paintTime: number): void {
    addToWindow(this.#paintTimes, paintTime, PAINT_TIMES_WINDOW)

    this.#maxPaintTime = updateMaxWithDecay(
      this.#maxPaintTime,
      paintTime,
      MAX_PAINT_DECAY_THRESHOLD,
      MAX_PAINT_DECAY_RATE,
    )
  }
}

// ============================================================================
// Long Task & Main Thread Metrics
// ============================================================================

export interface MainThreadMetrics {
  longTasks: number
  longestTask: number
  totalBlockingTime: number
}

/**
 * Collects main thread health metrics using PerformanceObserver.
 *
 * Tracks:
 * - Long task count (>50ms)
 * - Longest task duration
 * - Total Blocking Time (TBT)
 */
export class MainThreadCollector implements MetricCollector<MainThreadMetrics> {
  #longTasks = 0
  #longestTask = 0
  #totalBlockingTime = 0
  #observer: PerformanceObserver | null = null

  start(): void {
    try {
      this.#observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.#longTasks++
          if (entry.duration > this.#longestTask) {
            this.#longestTask = entry.duration
          }
          // TBT = sum of (duration - 50ms) for all long tasks
          this.#totalBlockingTime += Math.max(0, entry.duration - 50)
        }
      })
      this.#observer.observe({type: 'longtask'})
    } catch {
      /* Not supported */
    }
  }

  stop(): void {
    this.#observer?.disconnect()
    this.#observer = null
  }

  reset(): void {
    this.#longTasks = 0
    this.#longestTask = 0
    this.#totalBlockingTime = 0
  }

  getMetrics(): MainThreadMetrics {
    return {
      longTasks: this.#longTasks,
      longestTask: this.#longestTask,
      totalBlockingTime: this.#totalBlockingTime,
    }
  }
}

// ============================================================================
// Layout Shift Metrics
// ============================================================================

export interface LayoutMetrics {
  layoutShiftScore: number
  layoutShiftCount: number
}

/**
 * Collects Cumulative Layout Shift (CLS) metrics.
 */
export class LayoutShiftCollector implements MetricCollector<LayoutMetrics> {
  #layoutShiftScore = 0
  #layoutShiftCount = 0
  #observer: PerformanceObserver | null = null

  start(): void {
    try {
      this.#observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const shiftEntry = entry as any
          if (!shiftEntry.hadRecentInput) {
            this.#layoutShiftScore += shiftEntry.value
            this.#layoutShiftCount++
          }
        }
      })
      this.#observer.observe({type: 'layout-shift', buffered: true})
    } catch {
      /* Not supported */
    }
  }

  stop(): void {
    this.#observer?.disconnect()
    this.#observer = null
  }

  reset(): void {
    this.#layoutShiftScore = 0
    this.#layoutShiftCount = 0
  }

  getMetrics(): LayoutMetrics {
    return {
      layoutShiftScore: this.#layoutShiftScore,
      layoutShiftCount: this.#layoutShiftCount,
    }
  }
}

// ============================================================================
// Memory Metrics
// ============================================================================

export interface MemoryMetrics {
  baselineMemoryMB: number | null
  peakMemoryMB: number | null
  lastMemoryMB: number | null
  memoryHistory: number[]
  gcPressure: number
}

/**
 * Collects memory usage metrics (Chrome only).
 *
 * Tracks:
 * - Current heap usage
 * - Baseline and peak
 * - Memory history for sparklines
 * - GC pressure (allocation rate)
 */
export class MemoryCollector implements MetricCollector<MemoryMetrics> {
  #baselineMemoryMB: number | null = null
  #peakMemoryMB: number | null = null
  #lastMemoryMB: number | null = null
  #memoryHistory: number[] = []
  #gcPressure = 0
  #lastGcCheckTime = 0
  #lastGcMemory: number | null = null

  start(): void {
    const memory = getMemoryMB()
    this.#baselineMemoryMB = memory
    this.#peakMemoryMB = memory
    this.#lastMemoryMB = memory
    this.#lastGcCheckTime = performance.now()
    this.#lastGcMemory = memory
  }

  stop(): void {
    // No cleanup needed
  }

  reset(): void {
    const memory = getMemoryMB()
    this.#baselineMemoryMB = memory
    this.#peakMemoryMB = memory
    this.#lastMemoryMB = memory
    this.#memoryHistory = []
    this.#gcPressure = 0
    this.#lastGcCheckTime = performance.now()
    this.#lastGcMemory = memory
  }

  /** Call periodically to update memory metrics */
  update(): void {
    const memory = getMemoryMB()
    if (memory === null) return

    this.#lastMemoryMB = memory
    if (this.#baselineMemoryMB === null) this.#baselineMemoryMB = memory
    if (this.#peakMemoryMB === null || memory > this.#peakMemoryMB) {
      this.#peakMemoryMB = memory
    }

    addToWindow(this.#memoryHistory, memory, SPARKLINE_HISTORY_SIZE)

    // Update GC pressure
    this.#updateGcPressure()
  }

  getMetrics(): MemoryMetrics {
    return {
      baselineMemoryMB: this.#baselineMemoryMB,
      peakMemoryMB: this.#peakMemoryMB,
      lastMemoryMB: this.#lastMemoryMB,
      memoryHistory: [...this.#memoryHistory],
      gcPressure: this.#gcPressure,
    }
  }

  #updateGcPressure(): void {
    const now = performance.now()
    const currentMemory = getMemoryMB()
    if (currentMemory !== null && this.#lastGcMemory !== null) {
      const timeDelta = (now - this.#lastGcCheckTime) / 1000 // seconds
      if (timeDelta > 0) {
        const memoryDelta = currentMemory - this.#lastGcMemory
        if (memoryDelta > 0) {
          this.#gcPressure = memoryDelta / timeDelta // MB/s
        } else {
          this.#gcPressure *= 0.9 // Decay
        }
      }
    }
    this.#lastGcCheckTime = now
    this.#lastGcMemory = currentMemory
  }
}

// ============================================================================
// Style & DOM Mutation Metrics
// ============================================================================

export interface StyleMetrics {
  styleWrites: number
  cssVarChanges: number
  domMutationFrames: number[]
  thrashingScore: number
}

/**
 * Collects style mutation and DOM churn metrics.
 *
 * Tracks:
 * - Style attribute mutations
 * - CSS variable changes
 * - DOM mutations per frame
 * - Layout thrashing score
 */
export class StyleMutationCollector implements MetricCollector<StyleMetrics> {
  #styleWrites = 0
  #cssVarChanges = 0
  #domMutationFrames: number[] = []
  #thrashingScore = 0
  #styleWriteCount = 0
  #lastStyleWriteTime = 0
  #domMutationCount = 0

  #styleObserver: MutationObserver | null = null
  #domObserver: MutationObserver | null = null
  #sampleInterval: ReturnType<typeof setInterval> | null = null

  /** Callback when layout becomes dirty (for reflow detection) */
  onLayoutDirty?: () => void

  start(): void {
    // Style mutation observer
    this.#styleObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          this.#styleWrites++
          this.#styleWriteCount++
          this.#lastStyleWriteTime = performance.now()
          this.onLayoutDirty?.()

          // Count CSS variable changes
          const target = mutation.target as HTMLElement
          const styleValue = target.getAttribute('style') || ''
          const cssVarMatches = styleValue.match(/--[\w-]+\s*:/g)
          if (cssVarMatches) {
            this.#cssVarChanges += cssVarMatches.length
          }
        }
      }
    })
    this.#styleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    })

    // DOM mutation observer
    this.#domObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          this.#domMutationCount += mutation.addedNodes.length + mutation.removedNodes.length
        } else if (mutation.type === 'attributes' && mutation.attributeName !== 'style') {
          this.#domMutationCount++
        }
      }
    })
    this.#domObserver.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'id', 'data-state', 'aria-expanded', 'aria-hidden', 'hidden', 'disabled'],
    })

    // Sample DOM mutations periodically
    this.#sampleInterval = setInterval(() => {
      addToWindow(this.#domMutationFrames, this.#domMutationCount, 30)
      this.#domMutationCount = 0
    }, 200)
  }

  stop(): void {
    this.#styleObserver?.disconnect()
    this.#domObserver?.disconnect()
    if (this.#sampleInterval) clearInterval(this.#sampleInterval)
    this.#styleObserver = null
    this.#domObserver = null
    this.#sampleInterval = null
  }

  reset(): void {
    this.#styleWrites = 0
    this.#cssVarChanges = 0
    this.#domMutationFrames = []
    this.#thrashingScore = 0
    this.#styleWriteCount = 0
    this.#domMutationCount = 0
  }

  /** Call on each frame to check for thrashing */
  checkThrashing(frameTime: number): void {
    const now = performance.now()
    const timeSinceLastWrite = now - this.#lastStyleWriteTime
    const hadRecentStyleWrite = this.#styleWriteCount > 0 && timeSinceLastWrite < THRASHING_STYLE_WRITE_WINDOW

    if (hadRecentStyleWrite && frameTime > THRASHING_FRAME_THRESHOLD) {
      this.#thrashingScore++
    }

    this.#styleWriteCount = 0
  }

  getMetrics(): StyleMetrics {
    return {
      styleWrites: this.#styleWrites,
      cssVarChanges: this.#cssVarChanges,
      domMutationFrames: [...this.#domMutationFrames],
      thrashingScore: this.#thrashingScore,
    }
  }
}

// ============================================================================
// Forced Reflow Detection
// ============================================================================

export interface ReflowMetrics {
  forcedReflowCount: number
}

/**
 * Detects forced synchronous layout (reflows).
 *
 * Instruments layout-triggering property getters to detect when
 * layout properties are read after style writes.
 */
export class ForcedReflowCollector implements MetricCollector<ReflowMetrics> {
  #forcedReflowCount = 0
  #layoutDirty = false
  #dirtyTimeout: ReturnType<typeof setTimeout> | null = null

  // Shared registry for property patching
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static #registry: any = null

  static readonly #REFLOW_PROPS = [
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

  markLayoutDirty(): void {
    this.#layoutDirty = true
    if (this.#dirtyTimeout) clearTimeout(this.#dirtyTimeout)
    this.#dirtyTimeout = setTimeout(() => {
      this.#layoutDirty = false
    }, 0)
  }

  start(): void {
    // Initialize shared registry if needed

    if (!ForcedReflowCollector.#registry) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ForcedReflowCollector.#registry = (window as any).__perfReflowRegistry = {
        initialized: false,
        originalGetters: new Map<string, PropertyDescriptor>(),
        currentCollector: null as ForcedReflowCollector | null,
      }
    }

    const registry = ForcedReflowCollector.#registry
    registry.currentCollector = this

    if (!registry.initialized) {
      registry.initialized = true

      for (const prop of ForcedReflowCollector.#REFLOW_PROPS) {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop)
        if (descriptor?.get) {
          registry.originalGetters.set(prop, descriptor)
          Object.defineProperty(HTMLElement.prototype, prop, {
            get() {
              const collector = ForcedReflowCollector.#registry?.currentCollector
              if (collector && collector.#layoutDirty) {
                collector.#forcedReflowCount++
                collector.#layoutDirty = false
              }
              return descriptor.get!.call(this)
            },
            configurable: true,
          })
        }
      }
    }
  }

  stop(): void {
    if (this.#dirtyTimeout) {
      clearTimeout(this.#dirtyTimeout)
      this.#dirtyTimeout = null
    }
    // Don't restore getters - they're shared
  }

  reset(): void {
    this.#forcedReflowCount = 0
    this.#layoutDirty = false
  }

  getMetrics(): ReflowMetrics {
    return {
      forcedReflowCount: this.#forcedReflowCount,
    }
  }
}

// ============================================================================
// React Profiler Metrics
// ============================================================================

export interface ReactMetrics {
  reactRenderCount: number
  reactMountCount: number
  reactMountDuration: number
  reactPostMountUpdateCount: number
  reactPostMountMaxDuration: number
  nestedUpdateCount: number
  slowReactUpdates: number
  reactUpdateDurations: number[]
}

/**
 * Collects React Profiler metrics.
 *
 * Tracks:
 * - Mount count and duration
 * - Update count and max duration
 * - Nested updates (render cascades)
 * - Slow updates (>16ms)
 * - P95 calculation data
 */
export class ReactProfilerCollector implements MetricCollector<ReactMetrics> {
  #reactRenderCount = 0
  #reactMountCount = 0
  #reactMountDuration = 0
  #reactPostMountUpdateCount = 0
  #reactPostMountMaxDuration = 0
  #nestedUpdateCount = 0
  #slowReactUpdates = 0
  #reactUpdateDurations: number[] = []

  start(): void {
    // No setup needed - metrics come from reportRender calls
  }

  stop(): void {
    // No cleanup needed
  }

  reset(): void {
    // Preserve mount metrics on reset
    const mountCount = this.#reactMountCount
    const mountDuration = this.#reactMountDuration

    this.#reactRenderCount = 0
    this.#reactMountCount = mountCount
    this.#reactMountDuration = mountDuration
    this.#reactPostMountUpdateCount = 0
    this.#reactPostMountMaxDuration = 0
    this.#nestedUpdateCount = 0
    this.#slowReactUpdates = 0
    this.#reactUpdateDurations = []
  }

  /**
   * Report a React render from the Profiler component.
   */
  reportRender(phase: 'mount' | 'update' | 'nested-update', actualDuration: number): void {
    if (phase === 'nested-update') {
      this.#nestedUpdateCount++
    }

    this.#reactRenderCount++

    if (phase === 'mount') {
      this.#reactMountCount++
      this.#reactMountDuration += actualDuration
    } else {
      this.#reactPostMountUpdateCount++
      if (actualDuration > this.#reactPostMountMaxDuration) {
        this.#reactPostMountMaxDuration = actualDuration
      }

      // Track slow updates (>16ms)
      if (actualDuration > 16) {
        this.#slowReactUpdates++
      }

      // Keep rolling window for P95
      addToWindow(this.#reactUpdateDurations, actualDuration, 100)
    }
  }

  getMetrics(): ReactMetrics {
    return {
      reactRenderCount: this.#reactRenderCount,
      reactMountCount: this.#reactMountCount,
      reactMountDuration: this.#reactMountDuration,
      reactPostMountUpdateCount: this.#reactPostMountUpdateCount,
      reactPostMountMaxDuration: this.#reactPostMountMaxDuration,
      nestedUpdateCount: this.#nestedUpdateCount,
      slowReactUpdates: this.#slowReactUpdates,
      reactUpdateDurations: [...this.#reactUpdateDurations],
    }
  }
}

// ============================================================================
// Paint & Resource Metrics
// ============================================================================

export interface PaintMetrics {
  paintCount: number
  scriptEvalTime: number
  compositorLayers: number | null
}

/**
 * Collects paint and resource timing metrics.
 */
export class PaintCollector implements MetricCollector<PaintMetrics> {
  #paintCount = 0
  #scriptEvalTime = 0
  #compositorLayers: number | null = null

  #paintObserver: PerformanceObserver | null = null
  #resourceObserver: PerformanceObserver | null = null

  start(): void {
    // Paint observer
    try {
      this.#paintObserver = new PerformanceObserver(list => {
        this.#paintCount += list.getEntries().length
      })
      this.#paintObserver.observe({type: 'paint', buffered: true})
    } catch {
      /* Not supported */
    }

    // Resource observer for script timing
    try {
      this.#resourceObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            if (resourceEntry.initiatorType === 'script') {
              const scriptTime = resourceEntry.responseEnd - resourceEntry.fetchStart
              if (scriptTime > 0) {
                this.#scriptEvalTime += scriptTime
              }
            }
          }
        }
      })
      this.#resourceObserver.observe({type: 'resource', buffered: true})
    } catch {
      /* Not supported */
    }
  }

  stop(): void {
    this.#paintObserver?.disconnect()
    this.#resourceObserver?.disconnect()
    this.#paintObserver = null
    this.#resourceObserver = null
  }

  reset(): void {
    this.#paintCount = 0
    this.#scriptEvalTime = 0
  }

  /** Call periodically to update compositor layers count */
  updateCompositorLayers(): void {
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

    // Check computed will-change
    const allElements = document.querySelectorAll('*')
    for (const el of allElements) {
      const style = getComputedStyle(el)
      if (style.willChange && style.willChange !== 'auto') {
        layerCount++
      }
    }

    this.#compositorLayers = layerCount
  }

  getMetrics(): PaintMetrics {
    return {
      paintCount: this.#paintCount,
      scriptEvalTime: this.#scriptEvalTime,
      compositorLayers: this.#compositorLayers,
    }
  }
}
