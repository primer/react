'use client'

import {useCallback, useSyncExternalStore} from 'react'

function elementHasOverflow(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}

export function useOverflow(element: HTMLElement | null): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (element === null) {
        return () => {}
      }

      const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(notify)
      resizeObserver?.observe(element)

      const mutationObserver = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(notify)
      mutationObserver?.observe(element, {attributes: true, characterData: true, childList: true, subtree: true})

      return () => {
        mutationObserver?.disconnect()
        resizeObserver?.disconnect()
      }
    },
    [element],
  )
  const getSnapshot = useCallback(() => (element === null ? false : elementHasOverflow(element)), [element])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
