import React from 'react'
import {Button} from '../Button'
import Text from '../Text'
import {Stack} from '../Stack'

// Formatters with fixed decimal places to prevent layout shifts
const fpsFormatter = new Intl.NumberFormat('en-US', {minimumIntegerDigits: 2, maximumFractionDigits: 0})
const msFormatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const numberFormatter = new Intl.NumberFormat('en-US')

// Hook to count DOM elements within a container
function useDOMElementCount(ref: React.RefObject<HTMLElement | null>) {
  const [count, setCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    const countElements = () => {
      if (ref.current) {
        setCount(ref.current.querySelectorAll('*').length)
      }
    }

    // Initial count
    countElements()

    // Re-count when DOM changes (handles dynamic content)
    if (ref.current) {
      const observer = new MutationObserver(countElements)
      observer.observe(ref.current, {childList: true, subtree: true})
      return () => observer.disconnect()
    }
    return undefined
  }, [ref])

  return count
}

// Performance monitor component that displays FPS and frame timing
export function PerformanceMonitor({domCountRef}: {domCountRef: React.RefObject<HTMLElement | null>}) {
  const domCount = useDOMElementCount(domCountRef)
  const [stats, setStats] = React.useState({
    fps: 0,
    frameTime: 0,
    maxFrameTime: 0,
    inputLatency: 0,
    maxInputLatency: 0,
    paintTime: 0,
    maxPaintTime: 0,
    longTasks: 0,
    longestTask: 0,
    droppedFrames: 0,
    layoutReads: 0,
  })
  const frameTimesRef = React.useRef<number[]>([])
  const lastTimeRef = React.useRef(0)
  const maxFrameTimeRef = React.useRef(0)
  const inputLatenciesRef = React.useRef<number[]>([])
  const maxInputLatencyRef = React.useRef(0)
  const paintTimesRef = React.useRef<number[]>([])
  const maxPaintTimeRef = React.useRef(0)
  const longTaskCountRef = React.useRef(0)
  const longestTaskRef = React.useRef(0)
  const droppedFramesRef = React.useRef(0)
  const expectedFrameTimeRef = React.useRef(16.67) // ~60fps
  const layoutReadsRef = React.useRef(0)

  React.useEffect(() => {
    let animationId: number
    lastTimeRef.current = performance.now()

    const measure = () => {
      const now = performance.now()
      const delta = now - lastTimeRef.current
      lastTimeRef.current = now

      frameTimesRef.current.push(delta)
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift()
      }

      // Track dropped frames (frames that took > 2x expected frame time)
      if (delta > expectedFrameTimeRef.current * 2) {
        droppedFramesRef.current += Math.floor(delta / expectedFrameTimeRef.current) - 1
      }

      // Track max frame time (reset after 2 seconds of good frames)
      if (delta > maxFrameTimeRef.current) {
        maxFrameTimeRef.current = delta
      } else if (delta < 20 && maxFrameTimeRef.current > 20) {
        // Slowly decay max if we're getting good frames
        maxFrameTimeRef.current = maxFrameTimeRef.current * 0.99
      }

      const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
      const fps = Math.round(1000 / avgFrameTime)

      // Calculate average input latency
      const avgInputLatency =
        inputLatenciesRef.current.length > 0
          ? inputLatenciesRef.current.reduce((a, b) => a + b, 0) / inputLatenciesRef.current.length
          : 0

      // Calculate average paint time
      const avgPaintTime =
        paintTimesRef.current.length > 0
          ? paintTimesRef.current.reduce((a, b) => a + b, 0) / paintTimesRef.current.length
          : 0

      setStats({
        fps,
        frameTime: Math.round(avgFrameTime * 10) / 10,
        maxFrameTime: Math.round(maxFrameTimeRef.current * 10) / 10,
        inputLatency: Math.round(avgInputLatency * 10) / 10,
        maxInputLatency: Math.round(maxInputLatencyRef.current * 10) / 10,
        paintTime: Math.round(avgPaintTime * 10) / 10,
        maxPaintTime: Math.round(maxPaintTimeRef.current * 10) / 10,
        longTasks: longTaskCountRef.current,
        longestTask: Math.round(longestTaskRef.current),
        droppedFrames: droppedFramesRef.current,
        layoutReads: layoutReadsRef.current,
      })

      animationId = requestAnimationFrame(measure)
    }

    // Track input latency during pointer events (time from event to next paint)
    // Also track paint time using double RAF - first RAF is before paint, second is after
    const handlePointerMove = (event: PointerEvent) => {
      const eventTime = event.timeStamp
      requestAnimationFrame(() => {
        const rafTime = performance.now()
        const latency = rafTime - eventTime

        inputLatenciesRef.current.push(latency)
        if (inputLatenciesRef.current.length > 30) {
          inputLatenciesRef.current.shift()
        }

        if (latency > maxInputLatencyRef.current) {
          maxInputLatencyRef.current = latency
        } else if (latency < 20 && maxInputLatencyRef.current > 20) {
          maxInputLatencyRef.current = maxInputLatencyRef.current * 0.98
        }

        // Measure paint time: time from first RAF to after paint completes
        // The second RAF callback runs after the browser has painted
        requestAnimationFrame(() => {
          const afterPaintTime = performance.now()
          const paintDuration = afterPaintTime - rafTime

          paintTimesRef.current.push(paintDuration)
          if (paintTimesRef.current.length > 30) {
            paintTimesRef.current.shift()
          }

          if (paintDuration > maxPaintTimeRef.current) {
            maxPaintTimeRef.current = paintDuration
          } else if (paintDuration < 10 && maxPaintTimeRef.current > 10) {
            maxPaintTimeRef.current = maxPaintTimeRef.current * 0.98
          }
        })
      })
    }

    // Track Long Tasks (tasks > 50ms that block main thread)
    let longTaskObserver: PerformanceObserver | null = null
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        longTaskObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            longTaskCountRef.current++
            if (entry.duration > longestTaskRef.current) {
              longestTaskRef.current = entry.duration
            }
          }
        })
        // Don't use buffered: true - we only want long tasks from this story, not historical ones
        longTaskObserver.observe({type: 'longtask'})
      } catch {
        // Long task observer not supported
      }
    }

    // Track layout reads (potential layout thrashing) by monitoring getBoundingClientRect calls
    let isDragging = false
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = function () {
      if (isDragging) {
        layoutReadsRef.current++
      }
      return originalGetBoundingClientRect.call(this)
    }

    // Only measure when dragging (data-page-layout-dragging is set on body)
    const observer = new MutationObserver(() => {
      isDragging = document.body.hasAttribute('data-page-layout-dragging')
      if (isDragging) {
        window.addEventListener('pointermove', handlePointerMove)
      } else {
        window.removeEventListener('pointermove', handlePointerMove)
        // Reset input latency and paint time tracking when drag ends
        inputLatenciesRef.current = []
        paintTimesRef.current = []
      }
    })

    observer.observe(document.body, {attributes: true, attributeFilter: ['data-page-layout-dragging']})
    window.addEventListener('pointermove', handlePointerMove)

    animationId = requestAnimationFrame(measure)
    return () => {
      cancelAnimationFrame(animationId)
      observer.disconnect()
      longTaskObserver?.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    }
  }, [])

  // Reset counters function
  const resetCounters = () => {
    longTaskCountRef.current = 0
    longestTaskRef.current = 0
    droppedFramesRef.current = 0
    maxFrameTimeRef.current = 0
    maxInputLatencyRef.current = 0
    inputLatenciesRef.current = []
    maxPaintTimeRef.current = 0
    paintTimesRef.current = []
    layoutReadsRef.current = 0
  }

  const fpsColor =
    stats.fps >= 55 ? 'var(--fgColor-success)' : stats.fps >= 30 ? 'var(--fgColor-attention)' : 'var(--fgColor-danger)'
  const inputLatencyColor =
    stats.inputLatency <= 16
      ? 'var(--fgColor-success)'
      : stats.inputLatency <= 50
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'
  const longTaskColor =
    stats.longTasks === 0
      ? 'var(--fgColor-success)'
      : stats.longTasks <= 5
        ? 'var(--fgColor-attention)'
        : 'var(--fgColor-danger)'
  const paintTimeColor =
    stats.paintTime <= 8
      ? 'var(--fgColor-success)'
      : stats.paintTime <= 16
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
        <Button type="button" size="small" onClick={resetCounters}>
          Reset
        </Button>
      </Stack>
      <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px'}}>
        {domCount != null && (
          <>
            <span>DOM elements:</span>
            <span style={{fontVariantNumeric: 'tabular-nums'}}>{numberFormatter.format(domCount)}</span>
          </>
        )}
        <span>FPS:</span>
        <span style={{color: fpsColor, fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>
          {fpsFormatter.format(stats.fps)}
        </span>
        <span>Frame time:</span>
        <span style={{fontVariantNumeric: 'tabular-nums'}}>{msFormatter.format(stats.frameTime)}ms</span>
        <span>Max frame:</span>
        <span
          style={{
            color: stats.maxFrameTime > 32 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(stats.maxFrameTime)}ms
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
          {msFormatter.format(stats.inputLatency)}ms
        </span>
        <span>Max input lag:</span>
        <span
          style={{
            color: stats.maxInputLatency > 50 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(stats.maxInputLatency)}ms
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
          {msFormatter.format(stats.paintTime)}ms
        </span>
        <span>Max paint:</span>
        <span
          style={{
            color: stats.maxPaintTime > 16 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {msFormatter.format(stats.maxPaintTime)}ms
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
          {stats.longTasks}
        </span>
        <span>Longest task:</span>
        <span
          style={{
            color: stats.longestTask > 100 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {stats.longestTask}ms
        </span>
        <span>Dropped frames:</span>
        <span
          style={{
            color: stats.droppedFrames > 10 ? 'var(--fgColor-danger)' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {stats.droppedFrames}
        </span>

        <span style={{borderTop: '1px solid var(--borderColor-default)', paddingTop: '4px'}}>Layout reads:</span>
        <span
          style={{
            color:
              stats.layoutReads === 0
                ? 'var(--fgColor-muted)'
                : stats.layoutReads < 100
                  ? 'var(--fgColor-attention)'
                  : 'var(--fgColor-danger)',
            fontWeight: stats.layoutReads > 0 ? 600 : 'normal',
            fontVariantNumeric: 'tabular-nums',
            borderTop: '1px solid var(--borderColor-default)',
            paddingTop: '4px',
          }}
        >
          {numberFormatter.format(stats.layoutReads)}
        </span>
      </div>
      <Text size="small" style={{marginTop: '8px', color: 'var(--fgColor-muted)'}}>
        Drag to resize.
      </Text>
    </div>
  )
}
