import type {RefObject} from 'react'
import {useRef} from 'react'
import {useDependencyListLayoutEffect} from '../internal/hooks/useDependencyListEffect'
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
  enabled: boolean = true,
) {
  const targetClientRectRef = useRef<DOMRect | null>(null)
  const savedCallback = useRef(callback)

  useLayoutEffect(() => {
    savedCallback.current = callback
  })

  useDependencyListLayoutEffect(
    () => {
      if (!enabled) {
        return
      }
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
          const targetClientRect = targetClientRectRef.current

          if (currTargetRect.width !== targetClientRect?.width || currTargetRect.height !== targetClientRect.height) {
            savedCallback.current([
              {
                contentRect: currTargetRect,
              },
            ])
          }
          targetClientRectRef.current = currTargetRect
        }
        // eslint-disable-next-line github/prefer-observers
        window.addEventListener('resize', saveTargetDimensions)

        return () => {
          window.removeEventListener('resize', saveTargetDimensions)
        }
      }
    },
    () => [target && 'current' in target ? target.current : document.documentElement, enabled, ...depsArray],
  )
}
