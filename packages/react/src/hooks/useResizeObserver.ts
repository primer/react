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
  target?: RefObject<T>,
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
      const observer = new ResizeObserver(entries => {
        savedCallback.current(entries)
      })

      observer.observe(targetEl)

      return () => {
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
