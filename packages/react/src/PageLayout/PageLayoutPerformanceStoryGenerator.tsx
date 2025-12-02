import React from 'react'
import {Button} from '../Button'
import Text from '../Text'
import {Stack} from '../Stack'

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

// ============================================================================
// Performance Metrics Types
// ============================================================================

export interface PerformanceMetrics {
  // DOM metrics
  domElements: number | null

  // Frame timing
  fps: number
  frameTime: number
  maxFrameTime: number
  droppedFrames: number

  // Input responsiveness
  inputLatency: number
  maxInputLatency: number

  // Paint timing
  paintTime: number
  maxPaintTime: number
  paintCycles: number

  // Main thread blocking
  longTasks: number
  longestTask: number
  slowEvents: number

  // Layout thrashing indicators
  layoutReads: number
  styleWrites: number

  // React Profiler metrics
  reactRenderCount: number
  reactTotalActualDuration: number
  reactMaxActualDuration: number
  reactLastActualDuration: number
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
  layoutReads: 0,
  styleWrites: 0,
  reactRenderCount: 0,
  reactTotalActualDuration: 0,
  reactMaxActualDuration: 0,
  reactLastActualDuration: 0,
}

// ============================================================================
// Performance Contexts (split to avoid unnecessary re-renders)
// ============================================================================

// Callbacks context - stable, never changes after mount
// Used by ProfiledComponent to report renders without subscribing to metrics
interface PerformanceCallbacksContextValue {
  reportReactRender: (actualDuration: number) => void
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
  layoutReads: number
  styleWrites: number
  // React
  reactRenderCount: number
  reactTotalActualDuration: number
  reactMaxActualDuration: number
  reactLastActualDuration: number
  // DOM
  domElements: number | null
}

export function PerformanceProvider({
  children,
  showMonitor = true,
}: {
  children: React.ReactNode
  showMonitor?: boolean
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
    layoutReads: 0,
    styleWrites: 0,
    reactRenderCount: 0,
    reactTotalActualDuration: 0,
    reactMaxActualDuration: 0,
    reactLastActualDuration: 0,
    domElements: null,
  })

  // Rolling average arrays (never read during render)
  const frameTimesRef = React.useRef<number[]>([])
  const inputLatenciesRef = React.useRef<number[]>([])
  const paintTimesRef = React.useRef<number[]>([])

  // State for rendering - updated once per RAF from mutable refs
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(initialMetrics)

  // React Profiler callback - updates mutable ref only
  const reportReactRender = React.useCallback((actualDuration: number) => {
    const m = mutableRef.current
    m.reactRenderCount++
    m.reactTotalActualDuration += actualDuration
    m.reactLastActualDuration = actualDuration
    if (actualDuration > m.reactMaxActualDuration) {
      m.reactMaxActualDuration = actualDuration
    }
  }, [])

  // DOM element count setter - updates mutable ref only
  const setDomElements = React.useCallback((count: number | null) => {
    mutableRef.current.domElements = count
  }, [])

  // Reset all metrics
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
    m.layoutReads = 0
    m.styleWrites = 0
    m.reactRenderCount = 0
    m.reactTotalActualDuration = 0
    m.reactMaxActualDuration = 0
    m.reactLastActualDuration = 0
    frameTimesRef.current = []
    inputLatenciesRef.current = []
    paintTimesRef.current = []
    setMetrics(initialMetrics)
  }, [])

  // Browser metrics collection effect
  React.useEffect(() => {
    const m = mutableRef.current
    let animationId: number
    let lastTime = performance.now()
    const expectedFrameTime = 16.67

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
        layoutReads: m.layoutReads,
        styleWrites: m.styleWrites,
        reactRenderCount: m.reactRenderCount,
        reactTotalActualDuration: m.reactTotalActualDuration,
        reactMaxActualDuration: m.reactMaxActualDuration,
        reactLastActualDuration: m.reactLastActualDuration,
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

    // Layout read tracking
    let isDragging = false
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = function () {
      if (isDragging) m.layoutReads++
      return originalGetBoundingClientRect.call(this)
    }

    const originalOffsetWidthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    const originalOffsetHeightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
    if (originalOffsetWidthDescriptor?.get) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get() {
          if (isDragging) m.layoutReads++
          return originalOffsetWidthDescriptor.get!.call(this)
        },
        configurable: true,
      })
    }
    if (originalOffsetHeightDescriptor?.get) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        get() {
          if (isDragging) m.layoutReads++
          return originalOffsetHeightDescriptor.get!.call(this)
        },
        configurable: true,
      })
    }

    // Style write tracking
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
    CSSStyleDeclaration.prototype.setProperty = function (...args) {
      if (isDragging) m.styleWrites++
      return originalSetProperty.apply(this, args)
    }

    // Drag state observer
    const dragObserver = new MutationObserver(() => {
      isDragging = document.body.hasAttribute('data-page-layout-dragging')
      if (isDragging) {
        window.addEventListener('pointermove', handlePointerMove)
      } else {
        window.removeEventListener('pointermove', handlePointerMove)
        inputLatenciesRef.current = []
        paintTimesRef.current = []
      }
    })
    dragObserver.observe(document.body, {attributes: true, attributeFilter: ['data-page-layout-dragging']})
    window.addEventListener('pointermove', handlePointerMove)

    animationId = requestAnimationFrame(measure)

    return () => {
      cancelAnimationFrame(animationId)
      dragObserver.disconnect()
      longTaskObserver?.disconnect()
      eventObserver?.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
      if (originalOffsetWidthDescriptor) {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidthDescriptor)
      }
      if (originalOffsetHeightDescriptor) {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeightDescriptor)
      }
      CSSStyleDeclaration.prototype.setProperty = originalSetProperty
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
        {showMonitor && <PerformanceMonitorInternal metrics={metrics} reset={reset} />}
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
    (_profilerId: string, _phase: 'mount' | 'update' | 'nested-update', actualDuration: number) => {
      callbacks?.reportReactRender(actualDuration)
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
// Internal Performance Monitor (rendered by provider, outside profiled tree)
// ============================================================================

function PerformanceMonitorInternal({metrics, reset}: {metrics: PerformanceMetrics; reset: () => void}) {
  return <PerformanceMonitorView metrics={metrics} onReset={reset} />
}

// ============================================================================
// Stateless Performance Monitor View
// ============================================================================

interface PerformanceMonitorViewProps {
  metrics: PerformanceMetrics
  onReset: () => void
}

export function PerformanceMonitorView({metrics, onReset}: PerformanceMonitorViewProps) {
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

  const paintTimeColor =
    metrics.paintTime <= 8
      ? 'var(--fgColor-success)'
      : metrics.paintTime <= 16
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  const avgReactRender = metrics.reactRenderCount > 0 ? metrics.reactTotalActualDuration / metrics.reactRenderCount : 0

  const reactRenderColor =
    avgReactRender <= 2
      ? 'var(--fgColor-success)'
      : avgReactRender <= 8
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'

  return (
    <div
      style={{
        padding: '12px',
        background: 'var(--bgColor-canvas-subtle)',
        borderRadius: '6px',
        marginBottom: '16px',
        fontFamily: 'monospace',
        fontSize: '12px',
      }}
    >
      <Stack direction="horizontal" align="center" justify="space-between" style={{marginBottom: '8px'}}>
        <Text weight="semibold" size="medium">
          Performance Monitor
        </Text>
        <Button type="button" size="small" onClick={onReset}>
          Reset
        </Button>
      </Stack>
      <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px'}}>
        {metrics.domElements != null && (
          <>
            <span>DOM elements:</span>
            <span style={{fontVariantNumeric: 'tabular-nums'}}>{numberFormatter.format(metrics.domElements)}</span>
          </>
        )}
        <span>FPS:</span>
        <span style={{color: fpsColor, fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>
          {fpsFormatter.format(metrics.fps)}
        </span>
        <span>Frame time:</span>
        <span style={{fontVariantNumeric: 'tabular-nums'}}>{msFormatter.format(metrics.frameTime)}ms</span>
        <span>Max frame:</span>
        <span
          style={{
            color: metrics.maxFrameTime > 32 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(metrics.maxFrameTime)}ms
        </span>

        <span style={{borderTop: '1px solid var(--borderColor-default)', paddingTop: '4px'}}>Input latency:</span>
        <span
          style={{
            color: inputLatencyColor,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            borderTop: '1px solid var(--borderColor-default)',
            paddingTop: '4px',
          }}
        >
          {msFormatter.format(metrics.inputLatency)}ms
        </span>
        <span>Max input lag:</span>
        <span
          style={{
            color: metrics.maxInputLatency > 50 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(metrics.maxInputLatency)}ms
        </span>

        <span style={{borderTop: '1px solid var(--borderColor-default)', paddingTop: '4px'}}>Paint time:</span>
        <span
          style={{
            color: paintTimeColor,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            borderTop: '1px solid var(--borderColor-default)',
            paddingTop: '4px',
          }}
        >
          {msFormatter.format(metrics.paintTime)}ms
        </span>
        <span>Max paint:</span>
        <span
          style={{
            color: metrics.maxPaintTime > 16 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(metrics.maxPaintTime)}ms
        </span>

        <span style={{borderTop: '1px solid var(--borderColor-default)', paddingTop: '4px'}}>
          Long tasks (&gt;50ms):
        </span>
        <span
          style={{
            color: longTaskColor,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            borderTop: '1px solid var(--borderColor-default)',
            paddingTop: '4px',
          }}
        >
          {metrics.longTasks}
        </span>
        <span>Longest task:</span>
        <span
          style={{
            color: metrics.longestTask > 100 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {metrics.longestTask}ms
        </span>
        <span>Dropped frames:</span>
        <span
          style={{
            color: metrics.droppedFrames > 10 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {metrics.droppedFrames}
        </span>

        <span style={{borderTop: '1px solid var(--borderColor-default)', paddingTop: '4px'}}>Layout reads:</span>
        <span
          style={{
            color:
              metrics.layoutReads === 0
                ? 'var(--fgColor-muted)'
                : metrics.layoutReads < 100
                  ? 'var(--fgColor-attention)'
                  : 'var(--fgColor-danger)',
            fontWeight: metrics.layoutReads > 0 ? 600 : 'normal',
            fontVariantNumeric: 'tabular-nums',
            borderTop: '1px solid var(--borderColor-default)',
            paddingTop: '4px',
          }}
        >
          {numberFormatter.format(metrics.layoutReads)}
        </span>
        <span>Slow events:</span>
        <span
          style={{
            color:
              metrics.slowEvents === 0
                ? 'var(--fgColor-muted)'
                : metrics.slowEvents <= 5
                  ? 'var(--fgColor-attention)'
                  : 'var(--fgColor-danger)',
            fontWeight: metrics.slowEvents > 0 ? 600 : 'normal',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {metrics.slowEvents}
        </span>
        <span>Paint cycles:</span>
        <span style={{fontVariantNumeric: 'tabular-nums'}}>{numberFormatter.format(metrics.paintCycles)}</span>
        <span>Style writes:</span>
        <span
          style={{
            color:
              metrics.styleWrites === 0
                ? 'var(--fgColor-muted)'
                : metrics.styleWrites < 500
                  ? 'inherit'
                  : 'var(--fgColor-attention)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {numberFormatter.format(metrics.styleWrites)}
        </span>

        {/* React Profiler Section */}
        <span style={{borderTop: '1px solid var(--borderColor-default)', paddingTop: '4px'}}>React renders:</span>
        <span
          style={{
            fontVariantNumeric: 'tabular-nums',
            borderTop: '1px solid var(--borderColor-default)',
            paddingTop: '4px',
          }}
        >
          {metrics.reactRenderCount}
        </span>
        <span>Avg render:</span>
        <span
          style={{
            color: reactRenderColor,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(avgReactRender)}ms
        </span>
        <span>Max render:</span>
        <span
          style={{
            color: metrics.reactMaxActualDuration > 16 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(metrics.reactMaxActualDuration)}ms
        </span>
        <span>Last render:</span>
        <span style={{fontVariantNumeric: 'tabular-nums'}}>
          {msFormatter.format(metrics.reactLastActualDuration)}ms
        </span>
      </div>
      <Text size="small" style={{marginTop: '8px', color: 'var(--fgColor-muted)'}}>
        Drag to resize.
      </Text>
    </div>
  )
}
