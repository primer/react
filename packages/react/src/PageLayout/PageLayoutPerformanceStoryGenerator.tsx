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
  // Additional React Profiler metrics
  reactBaseDuration: number // Worst-case render time (no memoization)
  reactMountCount: number // Number of mount renders
  reactUpdateCount: number // Number of update renders
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
  reactBaseDuration: 0,
  reactMountCount: 0,
  reactUpdateCount: 0,
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
  layoutReads: number
  styleWrites: number
  // React
  reactRenderCount: number
  reactTotalActualDuration: number
  reactMaxActualDuration: number
  reactLastActualDuration: number
  reactBaseDuration: number
  reactMountCount: number
  reactUpdateCount: number
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
    reactBaseDuration: 0,
    reactMountCount: 0,
    reactUpdateCount: 0,
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
      } else {
        m.reactUpdateCount++
      }
    },
    [],
  )

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
    m.reactBaseDuration = 0
    m.reactMountCount = 0
    m.reactUpdateCount = 0
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
        reactBaseDuration: m.reactBaseDuration,
        reactMountCount: m.reactMountCount,
        reactUpdateCount: m.reactUpdateCount,
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

  // Reset metrics after initial mount to exclude mount render from measurements
  React.useEffect(() => {
    // Use RAF to ensure we're past the initial paint
    const id = requestAnimationFrame(() => {
      reset()
    })
    return () => cancelAnimationFrame(id)
  }, [reset])

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
  const [isCollapsed, setIsCollapsed] = React.useState(false)

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

  // Collapsed view - just key metrics in a row
  if (isCollapsed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '8px',
          right: '8px',
          zIndex: 9999,
          padding: '6px 10px',
          background: 'rgba(0, 0, 0, 0.85)',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
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
            color: '#888',
            cursor: 'pointer',
            padding: '0 4px',
            fontSize: '14px',
          }}
          aria-label="Expand"
        >
          ◀
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '8px',
        left: '8px',
        zIndex: 9999,
        padding: '8px 10px',
        background: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ccc',
        width: '220px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px'}}>
        <span style={{fontWeight: 600, color: '#fff', fontSize: '11px'}}>⚡ Perf</span>
        <div style={{display: 'flex', gap: '4px'}}>
          <button
            type="button"
            onClick={onReset}
            style={{
              background: '#333',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '3px',
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
              color: '#666',
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: '12px',
            }}
            aria-label="Collapse"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1px 6px', lineHeight: 1.5}}>
        {/* Frame Section */}
        <span style={{color: '#888'}}>FPS</span>
        <span style={{color: fpsColor, fontWeight: 600}}>{fpsFormatter.format(metrics.fps)}</span>

        <span style={{color: '#888'}}>Frame</span>
        <span>
          {msFormatter.format(metrics.frameTime)}ms{' '}
          <span style={{color: metrics.maxFrameTime > 32 ? '#f85149' : '#666', fontSize: '9px'}}>
            (max {msFormatter.format(metrics.maxFrameTime)})
          </span>
        </span>

        {/* Input Section */}
        <span style={{color: '#888', borderTop: '1px solid #333', paddingTop: '3px', marginTop: '2px'}}>Input</span>
        <span style={{borderTop: '1px solid #333', paddingTop: '3px', marginTop: '2px'}}>
          <span style={{color: inputLatencyColor, fontWeight: 600}}>{msFormatter.format(metrics.inputLatency)}ms</span>{' '}
          <span style={{color: metrics.maxInputLatency > 50 ? '#f85149' : '#666', fontSize: '9px'}}>
            (max {msFormatter.format(metrics.maxInputLatency)})
          </span>
        </span>

        <span style={{color: '#888'}}>Paint</span>
        <span>
          {msFormatter.format(metrics.paintTime)}ms{' '}
          <span style={{color: metrics.maxPaintTime > 16 ? '#f85149' : '#666', fontSize: '9px'}}>
            (max {msFormatter.format(metrics.maxPaintTime)})
          </span>
        </span>

        {/* Tasks Section */}
        <span style={{color: '#888', borderTop: '1px solid #333', paddingTop: '3px', marginTop: '2px'}}>Tasks</span>
        <span style={{borderTop: '1px solid #333', paddingTop: '3px', marginTop: '2px'}}>
          <span style={{color: longTaskColor, fontWeight: metrics.longTasks > 0 ? 600 : 'normal'}}>
            {metrics.longTasks} long
          </span>
          {metrics.longestTask > 0 && (
            <span style={{color: metrics.longestTask > 100 ? '#f85149' : '#888', fontSize: '9px'}}>
              {' '}
              ({metrics.longestTask}ms)
            </span>
          )}
        </span>

        <span style={{color: '#888'}}>Dropped</span>
        <span style={{color: metrics.droppedFrames > 10 ? '#f85149' : metrics.droppedFrames > 0 ? '#d29922' : '#666'}}>
          {metrics.droppedFrames} frames
        </span>

        {/* Layout Section */}
        <span style={{color: '#888', borderTop: '1px solid #333', paddingTop: '3px', marginTop: '2px'}}>Layout</span>
        <span style={{borderTop: '1px solid #333', paddingTop: '3px', marginTop: '2px'}}>
          <span
            style={{
              color: metrics.layoutReads > 100 ? '#f85149' : metrics.layoutReads > 0 ? '#d29922' : '#666',
              fontWeight: metrics.layoutReads > 0 ? 600 : 'normal',
            }}
          >
            {metrics.layoutReads} reads
          </span>
        </span>

        <span style={{color: '#888'}}>Style</span>
        <span style={{color: metrics.styleWrites > 500 ? '#d29922' : '#666'}}>{metrics.styleWrites} writes</span>

        {/* React Section */}
        <span style={{color: '#888', borderTop: '1px solid #333', paddingTop: '3px', marginTop: '2px'}}>React</span>
        <span
          style={{
            borderTop: '1px solid #333',
            paddingTop: '3px',
            marginTop: '2px',
            color:
              metrics.reactUpdateCount === 0
                ? '#3fb950' // No updates = great
                : metrics.reactMaxActualDuration <= 8
                  ? '#3fb950' // Fast renders = fine
                  : metrics.reactMaxActualDuration <= 16
                    ? '#d29922' // Medium renders = warning
                    : '#f85149', // Slow renders = bad
            fontWeight: 600,
          }}
        >
          {metrics.reactUpdateCount} updates
          {metrics.reactUpdateCount === 0 ? ' ✓' : metrics.reactMaxActualDuration <= 8 ? ' ✓' : ''}
          {metrics.reactUpdateCount > 0 && (
            <span style={{fontWeight: 'normal', color: '#888', fontSize: '9px'}}>
              {' '}
              (max {msFormatter.format(metrics.reactMaxActualDuration)}ms)
            </span>
          )}
        </span>

        {/* DOM count */}
        {metrics.domElements != null && (
          <>
            <span style={{color: '#666', fontSize: '9px'}}>DOM</span>
            <span style={{color: '#666', fontSize: '9px'}}>{numberFormatter.format(metrics.domElements)} nodes</span>
          </>
        )}
      </div>
    </div>
  )
}
