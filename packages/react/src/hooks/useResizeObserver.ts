import type {RefObject} from 'react'
import {useRef} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// https://gist.github.com/strothj/708afcf4f01dd04de8f49c92e88093c3
export type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void

export interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly
}

export function useResizeObserver<T extends HTMLElement>(callback: ResizeObserverCallback, target?: RefObject<T>) {
  const savedCallback = useRef(callback)

  useLayoutEffect(() => {
    savedCallback.current = callback
  })

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : document.documentElement
    if (!targetEl) {
      return
    }

    const observer = new ResizeObserver(entries => {
      savedCallback.current(entries)
    })

    observer.observe(targetEl)

    return () => {
      observer.disconnect()
    }
  }, [target])
}
