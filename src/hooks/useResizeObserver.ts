import {RefObject} from 'react'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// https://gist.github.com/strothj/708afcf4f01dd04de8f49c92e88093c3
export type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void

export interface ResizeObserverEntry {
  contentRect: DOMRectReadOnly
}

export function useResizeObserver<T extends HTMLElement>(callback: ResizeObserverCallback, target?: RefObject<T>) {
  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : document.documentElement
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!targetEl) return () => {}
    const observer = new window.ResizeObserver(entries => callback(entries))
    observer.observe(targetEl)
    return () => {
      observer.disconnect()
    }
  }, [callback, target])
}
