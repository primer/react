import type {RefObject} from 'react'
import {useRef, useEffect} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// https://gist.github.com/strothj/708afcf4f01dd04de8f49c92e88093c3
export type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void

export interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly
}

/**
 * Observes size changes on an element or the window.
 *
 * Callbacks are automatically throttled using requestAnimationFrame (~60fps)
 * to improve INP by coalescing rapid resize events.
 *
 * @param callback - Called with resize entries when size changes
 * @param target - Element ref to observe. If omitted, observes window resize.
 */
export function useResizeObserver<T extends HTMLElement>(
  callback: ResizeObserverCallback,
  target?: RefObject<T | null>,
) {
  const savedCallback = useRef(callback)
  const pendingFrameRef = useRef<number | null>(null)
  // For fallback path: track last known dimensions with refs to avoid stale closures
  const lastDimensionsRef = useRef<{width: number; height: number} | null>(null)

  // Keep callback ref up to date
  useLayoutEffect(() => {
    savedCallback.current = callback
  })

  // Invoke helper - always throttles with rAF
  const invokeRef = useRef((entries: ResizeObserverEntry[]) => {
    if (pendingFrameRef.current !== null) {
      cancelAnimationFrame(pendingFrameRef.current)
    }
    pendingFrameRef.current = requestAnimationFrame(() => {
      pendingFrameRef.current = null
      savedCallback.current(entries)
    })
  })

  // Clean up any pending animation frame on unmount
  useEffect(() => {
    return () => {
      if (pendingFrameRef.current !== null) {
        cancelAnimationFrame(pendingFrameRef.current)
      }
    }
  }, [])

  // For window resize (no target), use native resize event - simpler and more
  // semantically correct than ResizeObserver on documentElement
  useEffect(() => {
    if (target !== undefined) {
      return
    }

    const handleResize = () => {
      invokeRef.current([{contentRect: document.documentElement.getBoundingClientRect()}])
    }

    // eslint-disable-next-line github/prefer-observers
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [target])

  // For specific element targets, use individual ResizeObserver
  useLayoutEffect(() => {
    // Skip if no target - handled by resize event above
    if (target === undefined) {
      return
    }

    const targetEl = target.current
    if (!targetEl) {
      return
    }

    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(entries => {
        invokeRef.current(entries)
      })

      observer.observe(targetEl)

      return () => {
        observer.disconnect()
      }
    } else {
      // Fallback for environments without ResizeObserver
      const handleResize = () => {
        const rect = targetEl.getBoundingClientRect()
        const last = lastDimensionsRef.current

        if (last === null || rect.width !== last.width || rect.height !== last.height) {
          lastDimensionsRef.current = {width: rect.width, height: rect.height}
          invokeRef.current([{contentRect: rect}])
        }
      }

      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [target])
}
