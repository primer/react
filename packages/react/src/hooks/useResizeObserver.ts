import type {RefObject} from 'react'
import {useRef, useState} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// https://gist.github.com/strothj/708afcf4f01dd04de8f49c92e88093c3
export type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void

export interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly
}

export function useResizeObserver<T extends HTMLElement>(
  callback: ResizeObserverCallback,
  target?: RefObject<T | null>,
  depsArray: unknown[] = [],
) {
  const [targetClientRect, setTargetClientRect] = useState<DOMRect | null>(null)
  const savedCallback = useRef(callback)

  useLayoutEffect(() => {
    savedCallback.current = callback
  })

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : document.documentElement
    if (!targetEl) {
      return
    }

    if (typeof ResizeObserver === 'function') {
      // Track whether this is the first callback (fires immediately on observe())
      let isFirstCallback = true
      let pendingFrame: number | null = null
      let latestEntries: ResizeObserverEntry[] | null = null

      const observer = new ResizeObserver(entries => {
        // First callback must be immediate - ResizeObserver fires synchronously
        // on observe() and consumers may depend on this timing
        if (isFirstCallback) {
          isFirstCallback = false
          savedCallback.current(entries)
          return
        }

        // Subsequent callbacks are throttled with rAF for better INP,
        // reducing layout thrashing during rapid resize events (e.g., window drag)
        latestEntries = entries
        if (pendingFrame === null) {
          pendingFrame = requestAnimationFrame(() => {
            pendingFrame = null
            if (latestEntries) {
              savedCallback.current(latestEntries)
            }
          })
        }
      })

      observer.observe(targetEl)

      return () => {
        if (pendingFrame !== null) {
          cancelAnimationFrame(pendingFrame)
        }
        observer.disconnect()
      }
    } else {
      const saveTargetDimensions = () => {
        const currTargetRect = targetEl.getBoundingClientRect()

        if (currTargetRect.width !== targetClientRect?.width || currTargetRect.height !== targetClientRect.height) {
          savedCallback.current([
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
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.current, ...depsArray])
}
