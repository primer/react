import type {RefObject} from 'react'
import {useRef, useState} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// https://gist.github.com/strothj/708afcf4f01dd04de8f49c92e88093c3
export type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void

export interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly
}

export interface UseResizeObserverOptions {
  /**
   * When true, throttles callback execution using requestAnimationFrame.
   * This improves INP by coalescing rapid resize events to at most one
   * callback per animation frame (~60fps).
   * @default false
   */
  throttle?: boolean
}

export function useResizeObserver<T extends HTMLElement>(
  callback: ResizeObserverCallback,
  target?: RefObject<T | null>,
  depsArray: unknown[] = [],
  options: UseResizeObserverOptions = {},
) {
  const {throttle = false} = options
  const [targetClientRect, setTargetClientRect] = useState<DOMRect | null>(null)
  const savedCallback = useRef(callback)
  const pendingFrameRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    savedCallback.current = callback
  })

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : document.documentElement
    if (!targetEl) {
      return
    }

    // Create the callback - optionally throttled with requestAnimationFrame
    const invokeCallback = (entries: ResizeObserverEntry[]) => {
      if (throttle) {
        // Cancel any pending frame to coalesce rapid resize events
        if (pendingFrameRef.current !== null) {
          cancelAnimationFrame(pendingFrameRef.current)
        }
        pendingFrameRef.current = requestAnimationFrame(() => {
          pendingFrameRef.current = null
          savedCallback.current(entries)
        })
      } else {
        savedCallback.current(entries)
      }
    }

    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(entries => {
        invokeCallback(entries)
      })

      observer.observe(targetEl)

      return () => {
        observer.disconnect()
        // Clean up any pending frame on unmount
        if (pendingFrameRef.current !== null) {
          cancelAnimationFrame(pendingFrameRef.current)
        }
      }
    } else {
      const saveTargetDimensions = () => {
        const currTargetRect = targetEl.getBoundingClientRect()

        if (currTargetRect.width !== targetClientRect?.width || currTargetRect.height !== targetClientRect.height) {
          invokeCallback([
            {
              contentRect: currTargetRect,
            },
          ])
        }
        setTargetClientRect(currTargetRect)
      }
      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', saveTargetDimensions)

      return () => {
        window.removeEventListener('resize', saveTargetDimensions)
        // Clean up any pending frame on unmount
        if (pendingFrameRef.current !== null) {
          cancelAnimationFrame(pendingFrameRef.current)
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.current, throttle, ...depsArray])
}
