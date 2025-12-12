import React from 'react'

export interface PaneWidthMetrics {
  minWidth: number
  maxWidth: number
  currentWidth: number
}

export interface UsePaneWidthOptions {
  paneRef: React.RefObject<HTMLDivElement>
  isDragging?: boolean
  isKeyboardDrag?: boolean
}

/**
 * Hook to manage pane width calculations with optimized window resize handling.
 * Uses requestAnimationFrame for smooth visual updates aligned with browser paint cycle.
 */
export function usePaneWidth({paneRef, isDragging = false, isKeyboardDrag = false}: UsePaneWidthOptions) {
  const [minWidth, setMinWidth] = React.useState(0)
  const [maxWidth, setMaxWidth] = React.useState(0)
  const [currentWidth, setCurrentWidth] = React.useState(0)

  // Refs to track pending updates
  const rafIdRef = React.useRef<number | null>(null)
  const idleIdRef = React.useRef<number | null>(null)

  const updateMetrics = React.useCallback(() => {
    if (paneRef.current === null) return

    const paneStyles = getComputedStyle(paneRef.current as Element)
    const maxPaneWidthDiffPixels = paneStyles.getPropertyValue('--pane-max-width-diff')
    const minWidthPixels = paneStyles.getPropertyValue('--pane-min-width')
    const paneWidth = paneRef.current.getBoundingClientRect().width
    const maxPaneWidthDiff = Number(maxPaneWidthDiffPixels.split('px')[0])
    const minPaneWidth = Number(minWidthPixels.split('px')[0])
    const viewportWidth = window.innerWidth
    const maxPaneWidth = viewportWidth > maxPaneWidthDiff ? viewportWidth - maxPaneWidthDiff : viewportWidth

    // Update CSS variable immediately for visual clamping - this prevents overflow during resize
    paneRef.current.style.setProperty('--pane-max-width-visual', `${maxPaneWidth}px`)

    return {
      minPaneWidth,
      maxPaneWidth,
      paneWidth: paneWidth || 0,
    }
  }, [paneRef])

  const updateStateAndAria = React.useCallback(
    (metrics: {minPaneWidth: number; maxPaneWidth: number; paneWidth: number}) => {
      // Defer state updates to avoid blocking during active resize
      // Use requestIdleCallback with fallback to setTimeout
      const hasIdleCallback = typeof window !== 'undefined' && 'requestIdleCallback' in window
      const idleCallback = hasIdleCallback
        ? window.requestIdleCallback!
        : (cb: IdleRequestCallback) => setTimeout(cb, 1) as unknown as number

      if (idleIdRef.current !== null) {
        if (hasIdleCallback) {
          window.cancelIdleCallback!(idleIdRef.current)
        } else {
          clearTimeout(idleIdRef.current)
        }
      }

      idleIdRef.current = idleCallback(() => {
        setMinWidth(metrics.minPaneWidth)
        setMaxWidth(metrics.maxPaneWidth)
        setCurrentWidth(metrics.paneWidth)
        idleIdRef.current = null
      })
    },
    [],
  )

  // Initial setup and dragging state changes
  React.useEffect(() => {
    const metrics = updateMetrics()
    if (metrics) {
      // For initial mount and dragging state changes, update immediately
      setMinWidth(metrics.minPaneWidth)
      setMaxWidth(metrics.maxPaneWidth)
      setCurrentWidth(metrics.paneWidth)
    }
  }, [paneRef, isKeyboardDrag, isDragging, updateMetrics])

  // Window resize handler with requestAnimationFrame
  React.useEffect(() => {
    const handleResize = () => {
      // Only schedule one animation frame at a time
      if (rafIdRef.current !== null) return

      rafIdRef.current = requestAnimationFrame(() => {
        const metrics = updateMetrics()
        if (metrics) {
          // Defer non-critical state updates
          updateStateAndAria(metrics)
        }
        rafIdRef.current = null
      })
    }

    // eslint-disable-next-line github/prefer-observers
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      // Cleanup pending animation frames
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }

      // Cleanup pending idle callbacks
      const hasIdleCallback = typeof window !== 'undefined' && 'requestIdleCallback' in window
      if (idleIdRef.current !== null) {
        if (hasIdleCallback) {
          window.cancelIdleCallback!(idleIdRef.current)
        } else {
          clearTimeout(idleIdRef.current)
        }
        idleIdRef.current = null
      }
    }
  }, [updateMetrics, updateStateAndAria])

  return {minWidth, maxWidth, currentWidth}
}
