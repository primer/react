import type {RefObject} from 'react'
import {useCallback, useRef, useState} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {areDependenciesEqual} from './useDependencies'

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
  const [targetClientRect, setTargetClientRect] = useState<DOMRect | null>(null)
  const savedCallback = useRef(callback)
  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  const dependenciesRef = useRef<React.DependencyList | undefined>(undefined)

  useLayoutEffect(() => {
    savedCallback.current = callback
  })

  const runCleanup = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = undefined
  }, [])

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : document.documentElement
    const nextDependencies = [targetEl, enabled, ...depsArray]
    if (dependenciesRef.current && areDependenciesEqual(dependenciesRef.current, nextDependencies)) {
      return
    }

    runCleanup()
    dependenciesRef.current = nextDependencies

    if (!enabled) {
      return
    }
    if (!targetEl) {
      return
    }

    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(entries => {
        savedCallback.current(entries)
      })

      observer.observe(targetEl)

      cleanupRef.current = () => {
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
      // eslint-disable-next-line github/prefer-observers, @eslint-react/web-api/no-leaked-event-listener
      window.addEventListener('resize', saveTargetDimensions)

      cleanupRef.current = () => {
        window.removeEventListener('resize', saveTargetDimensions)
      }
    }
  })

  useLayoutEffect(() => {
    return runCleanup
  }, [runCleanup])
}
