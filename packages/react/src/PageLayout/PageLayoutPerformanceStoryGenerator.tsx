import type {Decorator} from '@storybook/react-vite'
import React from 'react'

/**
 * Performance Monitoring for PageLayout Stories
 *
 * Architecture:
 * - PerformanceProvider: Wraps stories and manages all performance metrics.
 *   It renders the performance monitor UI OUTSIDE the profiled tree so that
 *   monitor re-renders don't inflate React render counts.
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
 *
 * ### React Profiler Metrics
 * Data from React.Profiler for render performance analysis.
 * - `reactMountCount`: Number of mount phase renders
 * - `reactMountDuration`: Total time spent in mount renders
 * - `reactPostMountUpdateCount`: Re-renders after initial mount
 * - `reactPostMountMaxDuration`: Slowest post-mount render
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
   * Estimated layout thrashing severity score.
   *
   * Accumulates points when style writes correlate with frame time anomalies:
   * - Spike: Frame time 2x baseline + 8ms above → severity = (frame - baseline) / 8
   * - Sustained: 3+ consecutive >24ms frames with writes → severity = (frame - 16) / 8
   *
   * A score of 0 indicates no thrashing detected. Higher scores indicate more
   * severe or frequent thrashing events. This is an estimate since we cannot
   * directly detect forced synchronous layout.
   */
  thrashingScore: number

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
}

const initialMetrics: PerformanceMetrics = {
  domElements: null,
  fps: 0,
  frameTime: 0,
  maxFrameTime: 0,
  droppedFrames: 0,
  inputLatency: 0,
  maxInputLatency: 0,
  paintTime: 0,
  maxPaintTime: 0,
  paintCycles: 0,
  longTasks: 0,
  longestTask: 0,
  slowEvents: 0,
  styleWrites: 0,
  thrashingScore: 0,
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
}

export function PerformanceProvider({
  children,
  initialPosition = 'bottom-left',
}: {
  children: React.ReactNode
  initialPosition?: MonitorPosition
}) {
  // Ref for DOM element counting
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Mutable state for collecting metrics (never read during render)
  const mutableRef = React.useRef<MutableMetricsState>({
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
  })

  // Rolling average arrays (never read during render)
  const frameTimesRef = React.useRef<number[]>([])
  const inputLatenciesRef = React.useRef<number[]>([])
  const paintTimesRef = React.useRef<number[]>([])

  // State for rendering - updated once per RAF from mutable refs
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(initialMetrics)

  // React Profiler callback - updates mutable ref only
  const reportReactRender = React.useCallback(
    (phase: 'mount' | 'update' | 'nested-update', actualDuration: number, baseDuration: number) => {
      const m = mutableRef.current
      m.reactRenderCount++
      m.reactTotalActualDuration += actualDuration
      m.reactLastActualDuration = actualDuration
      m.reactBaseDuration = baseDuration // Always update to latest base duration

      if (actualDuration > m.reactMaxActualDuration) {
        m.reactMaxActualDuration = actualDuration
      }

      // Track mount vs update counts
      if (phase === 'mount') {
        m.reactMountCount++
        m.reactMountDuration += actualDuration
      } else {
        m.reactUpdateCount++
        // Mark mount phase as complete on first update
        m.mountPhaseComplete = true
        // Track post-mount metrics
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

  // Reset all metrics (except mount stats which don't change)
  const reset = React.useCallback(() => {
    const m = mutableRef.current
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
    m.reactRenderCount = m.reactMountCount // Keep mount renders in count
    m.reactTotalActualDuration = m.reactMountDuration // Keep mount duration
    m.reactMaxActualDuration = 0
    m.reactLastActualDuration = 0
    m.reactBaseDuration = 0
    // Don't reset: reactMountCount, reactMountDuration, mountPhaseComplete
    m.reactUpdateCount = 0
    m.reactPostMountMaxDuration = 0
    m.reactPostMountUpdateCount = 0
    frameTimesRef.current = []
    inputLatenciesRef.current = []
    paintTimesRef.current = []
    setMetrics(prev => ({
      ...initialMetrics,
      // Preserve mount stats - they represent initial mount and don't change
      reactMountCount: prev.reactMountCount,
      reactMountDuration: prev.reactMountDuration,
      reactRenderCount: prev.reactMountCount,
      reactTotalActualDuration: prev.reactMountDuration,
    }))
  }, [])

  // Browser metrics collection effect
  React.useEffect(() => {
    const m = mutableRef.current
    let animationId: number
    let lastTime = performance.now()
    const expectedFrameTime = 16.67

    // Layout thrashing detection state
    let styleWriteCount = 0
    let lastStyleWriteTime = 0
    const recentFrameTimes: number[] = []
    let consecutiveSlowFramesWithWrites = 0

    // Thrashing detection: Two strategies combined:
    // 1. SPIKE detection: sudden frame time jumps relative to baseline
    // 2. SUSTAINED detection: consistently slow frames (>24ms) with style writes
    //
    // Normal dragging: consistent frame times even with many style writes
    // Thrashing: either sudden spikes OR sustained slowness during style changes
    const checkForThrashing = (frameTime: number) => {
      // Maintain a short rolling window of recent frame times
      recentFrameTimes.push(frameTime)
      if (recentFrameTimes.length > 10) {
        recentFrameTimes.shift()
      }

      const now = performance.now()
      const timeSinceLastWrite = now - lastStyleWriteTime
      const hadRecentStyleWrite = styleWriteCount > 0 && timeSinceLastWrite < 20

      // Strategy 2: Track sustained slow frames with style writes
      // This catches consistent thrashing that wouldn't show as a "spike"
      if (hadRecentStyleWrite && frameTime > 24) {
        consecutiveSlowFramesWithWrites++
        // After 3+ consecutive slow frames with writes, likely thrashing
        if (consecutiveSlowFramesWithWrites >= 3) {
          const severity = Math.ceil((frameTime - 16) / 8)
          m.thrashingScore += severity
        }
      } else {
        consecutiveSlowFramesWithWrites = 0
      }

      // Need enough history for spike detection
      if (recentFrameTimes.length < 5) {
        styleWriteCount = 0
        return
      }

      // Only check spikes if we had style writes recently
      if (!hadRecentStyleWrite) {
        styleWriteCount = 0
        return
      }

      // Strategy 1: Calculate baseline from recent frames (excluding current)
      const baseline = recentFrameTimes.slice(0, -1)
      const avgBaseline = baseline.reduce((a, b) => a + b, 0) / baseline.length

      // Detect spike: current frame is significantly worse than recent baseline
      // A spike is 2x+ the baseline AND at least 8ms above it
      const spikeThreshold = Math.max(avgBaseline * 2, avgBaseline + 8)

      if (frameTime > spikeThreshold && frameTime > 16) {
        // Severity based on how much we exceeded the spike threshold
        const severity = Math.ceil((frameTime - avgBaseline) / 8)
        m.thrashingScore += severity
      }

      // Reset per-frame counter
      styleWriteCount = 0
    }

    const measure = () => {
      const now = performance.now()
      const delta = now - lastTime
      lastTime = now

      frameTimesRef.current.push(delta)
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift()
      }

      // Track dropped frames
      if (delta > expectedFrameTime * 2) {
        m.droppedFrames += Math.floor(delta / expectedFrameTime) - 1
      }

      // Track max frame time with decay
      if (delta > m.maxFrameTime) {
        m.maxFrameTime = delta
      } else if (delta < 20 && m.maxFrameTime > 20) {
        m.maxFrameTime = m.maxFrameTime * 0.99
      }

      // Check for thrashing based on style writes + frame time correlation
      checkForThrashing(delta)

      // Calculate averages
      const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
      const fps = Math.round(1000 / avgFrameTime)

      const avgInputLatency =
        inputLatenciesRef.current.length > 0
          ? inputLatenciesRef.current.reduce((a, b) => a + b, 0) / inputLatenciesRef.current.length
          : 0

      const avgPaintTime =
        paintTimesRef.current.length > 0
          ? paintTimesRef.current.reduce((a, b) => a + b, 0) / paintTimesRef.current.length
          : 0

      // Update state from mutable refs (this is the only place we read refs)
      setMetrics({
        domElements: m.domElements,
        fps,
        frameTime: Math.round(avgFrameTime * 10) / 10,
        maxFrameTime: Math.round(m.maxFrameTime * 10) / 10,
        droppedFrames: m.droppedFrames,
        inputLatency: Math.round(avgInputLatency * 10) / 10,
        maxInputLatency: Math.round(m.maxInputLatency * 10) / 10,
        paintTime: Math.round(avgPaintTime * 10) / 10,
        maxPaintTime: Math.round(m.maxPaintTime * 10) / 10,
        paintCycles: m.paintCycles,
        longTasks: m.longTasks,
        longestTask: Math.round(m.longestTask),
        slowEvents: m.slowEvents,
        styleWrites: m.styleWrites,
        thrashingScore: m.thrashingScore,
        reactRenderCount: m.reactRenderCount,
        reactTotalActualDuration: m.reactTotalActualDuration,
        reactMaxActualDuration: m.reactMaxActualDuration,
        reactLastActualDuration: m.reactLastActualDuration,
        reactBaseDuration: m.reactBaseDuration,
        reactMountCount: m.reactMountCount,
        reactUpdateCount: m.reactUpdateCount,
        reactPostMountMaxDuration: m.reactPostMountMaxDuration,
        reactPostMountUpdateCount: m.reactPostMountUpdateCount,
        reactMountDuration: m.reactMountDuration,
      })

      animationId = requestAnimationFrame(measure)
    }

    // Pointer move handler for input latency and paint time
    const handlePointerMove = (event: PointerEvent) => {
      const eventTime = event.timeStamp
      requestAnimationFrame(() => {
        const rafTime = performance.now()
        const latency = rafTime - eventTime

        inputLatenciesRef.current.push(latency)
        if (inputLatenciesRef.current.length > 30) {
          inputLatenciesRef.current.shift()
        }

        if (latency > m.maxInputLatency) {
          m.maxInputLatency = latency
        } else if (latency < 20 && m.maxInputLatency > 20) {
          m.maxInputLatency = m.maxInputLatency * 0.98
        }

        // Double RAF for paint time
        requestAnimationFrame(() => {
          const afterPaintTime = performance.now()
          const paintDuration = afterPaintTime - rafTime

          m.paintCycles++

          paintTimesRef.current.push(paintDuration)
          if (paintTimesRef.current.length > 30) {
            paintTimesRef.current.shift()
          }

          if (paintDuration > m.maxPaintTime) {
            m.maxPaintTime = paintDuration
          } else if (paintDuration < 10 && m.maxPaintTime > 10) {
            m.maxPaintTime = m.maxPaintTime * 0.98
          }
        })
      })
    }

    // Long Task observer
    let longTaskObserver: PerformanceObserver | null = null
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        longTaskObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            m.longTasks++
            if (entry.duration > m.longestTask) {
              m.longestTask = entry.duration
            }
          }
        })
        longTaskObserver.observe({type: 'longtask'})
      } catch {
        // Not supported
      }
    }

    // Event timing observer
    let eventObserver: PerformanceObserver | null = null
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        eventObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              m.slowEvents++
            }
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eventObserver.observe({type: 'event', durationThreshold: 16} as any)
      } catch {
        // Not supported
      }
    }

    // Style write tracking via MutationObserver on style attributes
    const styleObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          m.styleWrites++
          styleWriteCount++
          lastStyleWriteTime = performance.now()
        }
      }
    })

    // Start observing when component mounts
    styleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    })

    window.addEventListener('pointermove', handlePointerMove)

    animationId = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(animationId)
      styleObserver.disconnect()
      longTaskObserver?.disconnect()
      eventObserver?.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  // DOM element counting effect
  React.useEffect(() => {
    const countElements = () => {
      if (contentRef.current) {
        const count = contentRef.current.querySelectorAll('*').length
        setDomElements(count)
      }
    }

    countElements()

    if (contentRef.current) {
      const observer = new MutationObserver(countElements)
      observer.observe(contentRef.current, {childList: true, subtree: true})
      return () => observer.disconnect()
    }
    return undefined
  }, [setDomElements])

  // Stable callbacks context value (never changes after mount)
  const callbacksValue = React.useMemo(
    () => ({reportReactRender, setDomElements, reset}),
    [reportReactRender, setDomElements, reset],
  )

  // Metrics context value (changes every RAF)
  const metricsValue = React.useMemo(() => ({metrics}), [metrics])

  return (
    <PerformanceCallbacksContext.Provider value={callbacksValue}>
      <PerformanceMetricsContext.Provider value={metricsValue}>
        <PerformanceMonitorView metrics={metrics} onReset={reset} initialPosition={initialPosition} />
        <div ref={contentRef}>{children}</div>
      </PerformanceMetricsContext.Provider>
    </PerformanceCallbacksContext.Provider>
  )
}

// ============================================================================
// Profiled Component Wrapper
// ============================================================================

export function ProfiledComponent({id, children}: {id: string; children: React.ReactNode}) {
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
}

// ============================================================================
// Stateless Performance Monitor View
// ============================================================================

/**
 * Metric descriptions for the help panel.
 * These mirror the JSDoc documentation on PerformanceMetrics interface.
 */
const metricDescriptions = {
  dom: {
    label: 'DOM',
    description: 'Number of DOM elements within the profiled component tree.',
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
    description:
      'Estimated layout thrashing severity. Detects frame spikes (2x baseline) or sustained slowness (3+ frames >24ms) during style writes. Score of 0 = no thrashing detected.',
  },
  mount: {
    label: '⚛️ Mount',
    description: 'React mount phase renders. Shows count and total duration of initial mounting.',
  },
  updates: {
    label: '⚛️ Updates',
    description: 'Re-renders after mount. Target: 0 for drag (pure CSS). Green ≤8ms, Yellow ≤16ms, Red >16ms.',
  },
}

interface PerformanceMonitorViewProps {
  metrics: PerformanceMetrics
  onReset: () => void
  initialPosition?: MonitorPosition
}

function PerformanceMonitorView({metrics, onReset, initialPosition = 'bottom-left'}: PerformanceMonitorViewProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [showHelp, setShowHelp] = React.useState(false)
  const [position, setPosition] = React.useState<{x: number; y: number} | null>(null) // null = use default bottom-left
  const [dragState, setDragState] = React.useState<{isDragging: boolean; offsetX: number; offsetY: number}>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  })

  // Handle drag start - capture pointer for smooth dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag from the header area, not buttons
    if ((e.target as HTMLElement).closest('button'))
      return // Capture pointer to receive all events even outside element
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

    // Get current position (either from state or computed from bottom-left)
    const rect = (e.currentTarget as HTMLElement).closest('[data-perf-monitor]')?.getBoundingClientRect()
    const currentX = position?.x ?? rect?.left ?? 8
    const currentY = position?.y ?? rect?.top ?? window.innerHeight - (rect?.height ?? 300) - 8

    setDragState({
      isDragging: true,
      offsetX: e.clientX - currentX,
      offsetY: e.clientY - currentY,
    })
    e.preventDefault()
  }

  // Handle drag move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.isDragging) return
    setPosition({
      x: e.clientX - dragState.offsetX,
      y: e.clientY - dragState.offsetY,
    })
  }

  // Handle drag end
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.isDragging) return
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    setDragState(prev => ({...prev, isDragging: false}))
  }

  // Keyboard support for moving the panel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 50 : 10
    let newPosition = position

    // Get current position if not set
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
        // Reset to default position
        setPosition(null)
        e.preventDefault()
        break
    }
  }

  const fpsColor =
    metrics.fps >= 55
      ? 'var(--fgColor-success)'
      : metrics.fps >= 30
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  const inputLatencyColor =
    metrics.inputLatency <= 16
      ? 'var(--fgColor-success)'
      : metrics.inputLatency <= 50
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  const longTaskColor =
    metrics.longTasks === 0
      ? 'var(--fgColor-success)'
      : metrics.longTasks <= 5
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  // avgReactRender intentionally not used in compact view

  // Position styles - use explicit position if dragged, otherwise use initialPosition
  const defaultPositionStyle = {
    'top-left': {left: '8px', top: '8px'},
    'top-right': {right: '8px', top: '8px'},
    'bottom-left': {left: '8px', bottom: '8px'},
    'bottom-right': {right: '8px', bottom: '8px'},
  }[initialPosition]

  const positionStyle = position ? {left: `${position.x}px`, top: `${position.y}px`} : defaultPositionStyle

  // Collapsed view - just key metrics in a row
  if (isCollapsed) {
    return (
      <div
        data-perf-monitor
        role="region"
        aria-label="Performance monitor (collapsed). Use arrow keys to move, Home to reset position."
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{
          position: 'fixed',
          ...positionStyle,
          zIndex: 9999,
          padding: '6px 10px',
          background: 'rgba(0, 0, 0, 0.85)',
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
        <span style={{color: fpsColor, fontWeight: 600}}>{fpsFormatter.format(metrics.fps)} fps</span>
        <span style={{color: inputLatencyColor}}>{msFormatter.format(metrics.inputLatency)}ms</span>
        <span style={{color: longTaskColor}}>{metrics.longTasks} tasks</span>
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--fgColor-muted)',
            cursor: 'pointer',
            padding: '0 4px',
            fontSize: '14px',
          }}
          aria-label="Expand"
        >
          ▼
        </button>
      </div>
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
        background: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 'var(--borderRadius-medium)',
        fontFamily: 'monospace',
        fontSize: '10px',
        color: 'var(--fgColor-muted)',
        width: '220px',
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
        <span style={{fontWeight: 600, color: 'var(--fgColor-onEmphasis)', fontSize: '11px'}}>⚡ Perf</span>
        <div style={{display: 'flex', gap: '4px'}}>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            style={{
              background: showHelp ? 'var(--bgColor-accent-muted)' : 'var(--bgColor-neutral-muted)',
              border: 'none',
              color: showHelp ? 'var(--fgColor-accent)' : 'var(--fgColor-muted)',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 'var(--borderRadius-small)',
              fontSize: '9px',
              fontWeight: 600,
            }}
            aria-label={showHelp ? 'Hide help' : 'Show help'}
            aria-pressed={showHelp}
          >
            ?
          </button>
          <button
            type="button"
            onClick={onReset}
            style={{
              background: 'var(--bgColor-neutral-muted)',
              border: 'none',
              color: 'var(--fgColor-muted)',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 'var(--borderRadius-small)',
              fontSize: '9px',
            }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--fgColor-muted)',
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: '12px',
            }}
            aria-label="Collapse"
          >
            ▲
          </button>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
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
                <div style={{color: 'var(--fgColor-muted)', marginTop: '1px'}}>{description}</div>
              </div>
            ))}
            <div
              style={{
                marginTop: '8px',
                paddingTop: '6px',
                borderTop: '1px solid var(--borderColor-muted)',
                color: 'var(--fgColor-muted)',
              }}
            >
              <strong>Keyboard:</strong> Arrow keys move panel, Shift for larger steps, Home resets position.
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1px 6px', lineHeight: 1.5}}>
        {/* DOM count */}

        <span style={{color: 'var(--fgColor-muted)', fontSize: '9px'}}>DOM</span>
        <span style={{color: 'var(--fgColor-muted)', fontSize: '9px'}}>
          {metrics.domElements ? `${numberFormatter.format(metrics.domElements)} nodes` : 'N/A'}
        </span>

        {/* Frame Section */}
        <span style={{color: 'var(--fgColor-muted)'}}>FPS</span>
        <span style={{color: fpsColor, fontWeight: 600}}>{fpsFormatter.format(metrics.fps)}</span>

        <span style={{color: 'var(--fgColor-muted)'}}>Frame</span>
        <span>
          {msFormatter.format(metrics.frameTime)}ms{' '}
          <span
            style={{
              color: metrics.maxFrameTime > 32 ? 'var(--fgColor-danger)' : 'var(--fgColor-muted)',
              fontSize: '9px',
            }}
          >
            (max {msFormatter.format(metrics.maxFrameTime)})
          </span>
        </span>

        {/* Input Section */}
        <span
          style={{
            color: 'var(--fgColor-muted)',
            borderTop: '1px solid var(--borderColor-muted)',
            paddingTop: '3px',
            marginTop: '2px',
          }}
        >
          Input
        </span>
        <span style={{borderTop: '1px solid var(--borderColor-muted)', paddingTop: '3px', marginTop: '2px'}}>
          <span style={{color: inputLatencyColor, fontWeight: 600}}>{msFormatter.format(metrics.inputLatency)}ms</span>{' '}
          <span
            style={{
              color: metrics.maxInputLatency > 50 ? 'var(--fgColor-danger)' : 'var(--fgColor-muted)',
              fontSize: '9px',
            }}
          >
            (max {msFormatter.format(metrics.maxInputLatency)})
          </span>
        </span>

        <span style={{color: 'var(--fgColor-muted)'}}>Paint</span>
        <span>
          {msFormatter.format(metrics.paintTime)}ms{' '}
          <span
            style={{
              color: metrics.maxPaintTime > 16 ? 'var(--fgColor-danger)' : 'var(--fgColor-muted)',
              fontSize: '9px',
            }}
          >
            (max {msFormatter.format(metrics.maxPaintTime)})
          </span>
        </span>

        {/* Tasks Section */}
        <span
          style={{
            color: 'var(--fgColor-muted)',
            borderTop: '1px solid var(--borderColor-muted)',
            paddingTop: '3px',
            marginTop: '2px',
          }}
        >
          Tasks
        </span>
        <span style={{borderTop: '1px solid var(--borderColor-muted)', paddingTop: '3px', marginTop: '2px'}}>
          <span style={{color: longTaskColor, fontWeight: metrics.longTasks > 0 ? 600 : 'normal'}}>
            {metrics.longTasks} long
          </span>
          {metrics.longestTask > 0 && (
            <span
              style={{
                color: metrics.longestTask > 100 ? 'var(--fgColor-danger)' : 'var(--fgColor-muted)',
                fontSize: '9px',
              }}
            >
              {' '}
              ({metrics.longestTask}ms)
            </span>
          )}
        </span>

        <span style={{color: 'var(--fgColor-muted)'}}>Dropped</span>
        <span
          style={{
            color:
              metrics.droppedFrames > 10
                ? 'var(--fgColor-danger)'
                : metrics.droppedFrames > 0
                  ? 'var(--fgColor-attention)'
                  : 'var(--fgColor-muted)',
          }}
        >
          {metrics.droppedFrames} frames
        </span>

        {/* Layout Section */}
        <span
          style={{
            color: 'var(--fgColor-muted)',
            borderTop: '1px solid var(--borderColor-muted)',
            paddingTop: '3px',
            marginTop: '2px',
          }}
        >
          Style
        </span>
        <span
          style={{
            borderTop: '1px solid var(--borderColor-muted)',
            paddingTop: '3px',
            marginTop: '2px',
            color: 'var(--fgColor-muted)',
          }}
        >
          {metrics.styleWrites} writes
        </span>

        <span style={{color: 'var(--fgColor-muted)'}}>Thrash</span>
        <span
          style={{
            color: metrics.thrashingScore > 0 ? 'var(--fgColor-danger)' : 'var(--fgColor-success)',
            fontWeight: metrics.thrashingScore > 0 ? 600 : 'normal',
          }}
        >
          {metrics.thrashingScore === 0 ? 'none ✓' : metrics.thrashingScore}
          {metrics.thrashingScore > 0 && (
            <span style={{fontWeight: 'normal', color: 'var(--fgColor-muted)', fontSize: '9px'}}> (est.)</span>
          )}
        </span>

        {/* React Mount Section */}
        <span
          style={{
            color: 'var(--fgColor-muted)',
            borderTop: '1px solid var(--borderColor-muted)',
            paddingTop: '3px',
            marginTop: '2px',
          }}
        >
          ⚛️ Mount
        </span>
        <span
          style={{
            borderTop: '1px solid var(--borderColor-muted)',
            paddingTop: '3px',
            marginTop: '2px',
            color: 'var(--fgColor-muted)',
          }}
        >
          {metrics.reactMountCount > 0 ? (
            <>
              {metrics.reactMountCount}× ({msFormatter.format(metrics.reactMountDuration)}ms)
            </>
          ) : (
            <span style={{fontSize: '9px', fontStyle: 'italic'}}>awaiting profiler…</span>
          )}
        </span>

        {/* React Updates Section (post-mount interactions) */}
        <span style={{color: 'var(--fgColor-muted)'}}>⚛️ Updates</span>
        {metrics.reactRenderCount > 0 ? (
          <span
            style={{
              color:
                metrics.reactPostMountUpdateCount === 0
                  ? 'var(--fgColor-success)' // No updates = great
                  : metrics.reactPostMountMaxDuration <= 8
                    ? 'var(--fgColor-success)' // Fast renders = fine
                    : metrics.reactPostMountMaxDuration <= 16
                      ? 'var(--fgColor-attention)' // Medium renders = warning
                      : 'var(--fgColor-danger)', // Slow renders = bad
              fontWeight: 600,
            }}
          >
            {metrics.reactPostMountUpdateCount === 0 ? 'none ✓' : metrics.reactPostMountUpdateCount}
            {metrics.reactPostMountUpdateCount > 0 && metrics.reactPostMountMaxDuration <= 8 && ' ✓'}
            {metrics.reactPostMountUpdateCount > 0 && (
              <span style={{fontWeight: 'normal', color: 'var(--fgColor-muted)', fontSize: '9px'}}>
                {' '}
                (max {msFormatter.format(metrics.reactPostMountMaxDuration)}ms)
              </span>
            )}
          </span>
        ) : (
          <span style={{color: 'var(--fgColor-muted)', fontSize: '9px', fontStyle: 'italic'}}>use profiling build</span>
        )}
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
