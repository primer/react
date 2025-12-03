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
const UPDATE_INTERVAL_MS = 50 // How often to emit to panel (was 100ms)
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

function computeP95(arr: number[]): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.floor(sorted.length * 0.95)
  return Math.round(sorted[Math.min(idx, sorted.length - 1)] * 10) / 10
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

  // New metrics
  forcedReflowCount: number
  eventListenerCount: number
  observerCount: number
  cssVarChanges: number
  scriptEvalTime: number
  gcPressure: number // MB/s allocation rate
  paintCount: number
  compositorLayers: number | null

  // Additional jank metrics
  totalBlockingTime: number // Sum of (longTask - 50ms) for all long tasks
  domMutationsPerFrame: number // DOM mutations in current measurement window
  domMutationFrames: number[] // Rolling window of mutations per frame
  slowReactUpdates: number // React updates > 16ms
  reactUpdateDurations: number[] // Recent React update durations for analysis
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
  forcedReflowCount: number
  eventListenerCount: number
  observerCount: number
  cssVarChanges: number
  scriptEvalTime: number
  gcPressure: number
  paintCount: number
  compositorLayers: number | null
  totalBlockingTime: number
  domMutationsPerFrame: number
  slowReactUpdates: number
  reactP95Duration: number
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
