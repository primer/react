import React from 'react'
import {addons} from 'storybook/preview-api'

// Event channels - must match panel.tsx
const ADDON_ID = 'primer-performance-monitor'
const PERF_EVENTS = {
  METRICS_UPDATE: `${ADDON_ID}/metrics-update`,
  RESET: `${ADDON_ID}/reset`,
  REQUEST_METRICS: `${ADDON_ID}/request-metrics`,
}

// ============================================================================
// Constants
// ============================================================================

const FRAME_TIME_60FPS = 16.67
const DROPPED_FRAME_MULTIPLIER = 2
const THRASHING_FRAME_THRESHOLD = 50
const THRASHING_STYLE_WRITE_WINDOW = 50
const INTERACTION_LATENCIES_WINDOW = 50
const UPDATE_INTERVAL_MS = 100 // How often to emit to panel
const SPARKLINE_SAMPLE_INTERVAL_MS = 200 // How often to sample sparkline data

// Rolling window sizes
const FRAME_TIMES_WINDOW = 60
const INPUT_LATENCIES_WINDOW = 30
const PAINT_TIMES_WINDOW = 30
const SPARKLINE_HISTORY_SIZE = 30

// Jitter detection thresholds
const JITTER_BASELINE_SIZE = 5
const JITTER_MULTIPLIER = 3
const JITTER_INPUT_DELTA = 30
const JITTER_INPUT_ABSOLUTE = 50
const JITTER_FRAME_DELTA = 20
const JITTER_FRAME_ABSOLUTE = 40

// Max value decay
const MAX_DECAY_THRESHOLD = 20
const MAX_DECAY_RATE = 0.99
const MAX_INPUT_DECAY_THRESHOLD = 20
const MAX_INPUT_DECAY_RATE = 0.98
const MAX_PAINT_DECAY_THRESHOLD = 10
const MAX_PAINT_DECAY_RATE = 0.98

// Helper to get current memory usage in MB (Chrome only)
function getMemoryMB(): number | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = (performance as any).memory
  if (memory?.usedJSHeapSize) {
    return Math.round((memory.usedJSHeapSize / 1024 / 1024) * 10) / 10
  }
  return null
}

function computeAverage(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

// ============================================================================
// Metrics State
// ============================================================================

interface MetricsState {
  // Rolling windows
  frameTimes: number[]
  inputLatencies: number[]
  paintTimes: number[]

  // Max values with decay
  maxFrameTime: number
  maxInputLatency: number
  maxPaintTime: number

  // Jitter tracking
  inputJitter: number
  recentInputLatencies: number[]

  // Memory
  baselineMemoryMB: number | null
  peakMemoryMB: number | null
  lastMemoryMB: number | null

  // Sparkline history
  fpsHistory: number[]
  frameTimeHistory: number[]
  memoryHistory: number[]

  // Counters
  droppedFrames: number
  longTasks: number
  longestTask: number
  styleWrites: number
  thrashingScore: number
  layoutShiftScore: number
  layoutShiftCount: number
  interactionCount: number
  interactionLatencies: number[]
  inpMs: number

  // React profiler
  reactRenderCount: number
  reactMountCount: number
  reactMountDuration: number
  reactPostMountUpdateCount: number
  reactPostMountMaxDuration: number
  nestedUpdateCount: number
  mountPhaseComplete: boolean

  // DOM
  domElements: number | null
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
  }
}

// ============================================================================
// Computed Metrics (what we send to the panel)
// ============================================================================

export interface ComputedMetrics {
  fps: number
  frameTime: number
  maxFrameTime: number
  inputLatency: number
  maxInputLatency: number
  paintTime: number
  maxPaintTime: number
  inputJitter: number
  memoryUsedMB: number | null
  memoryDeltaMB: number | null
  peakMemoryMB: number | null
  fpsHistory: number[]
  frameTimeHistory: number[]
  memoryHistory: number[]
  longTasks: number
  longestTask: number
  droppedFrames: number
  styleWrites: number
  thrashingScore: number
  layoutShiftScore: number
  layoutShiftCount: number
  interactionCount: number
  inpMs: number
  reactMountCount: number
  reactMountDuration: number
  reactRenderCount: number
  reactPostMountUpdateCount: number
  reactPostMountMaxDuration: number
  renderCascades: number
  domElements: number | null
}

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
  }
}

// ============================================================================
// Context for React Profiler
// ============================================================================

interface PerformanceContextValue {
  reportReactRender: (phase: 'mount' | 'update' | 'nested-update', actualDuration: number, baseDuration: number) => void
  setDomElements: (count: number | null) => void
}

const PerformanceContext = React.createContext<PerformanceContextValue | null>(null)

export function usePerformanceContext() {
  return React.useContext(PerformanceContext)
}

// ============================================================================
// Performance Provider (Preview Side)
// ============================================================================

interface PerformanceProviderProps {
  children: React.ReactNode
  enabled?: boolean
}

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
      if (lastComputedRef.current) {
        channel.emit(PERF_EVENTS.METRICS_UPDATE, lastComputedRef.current)
      }
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

    // Long task observer
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

    // Style mutation observer
    const styleObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          m.styleWrites++
          styleWriteCount++
          lastStyleWriteTime = performance.now()
        }
      }
    })
    styleObserver.observe(document.body, {attributes: true, attributeFilter: ['style'], subtree: true})

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

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    animationId = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(animationId)
      styleObserver.disconnect()
      longTaskObserver?.disconnect()
      layoutShiftObserver?.disconnect()
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

export const ProfiledComponent = React.memo(function ProfiledComponent({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const context = usePerformanceContext()

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
 * Decorator that enables performance monitoring for a story.
 * When the Performance Monitor addon is enabled, metrics will be collected
 * and displayed in the addon panel.
 *
 * @example
 * ```tsx
 * export default {
 *   decorators: [withPerformanceMonitor],
 * }
 * ```
 */
export function withPerformanceMonitor(Story: React.ComponentType) {
  return (
    <PerformanceProvider enabled>
      <ProfiledComponent id="story">
        <Story />
      </ProfiledComponent>
    </PerformanceProvider>
  )
}
