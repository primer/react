'use client'

import {useMemo, useSyncExternalStore} from 'react'
import {getActiveElement} from '../../internal/getActiveElement'

function elementHasOverflow(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}

function createOverflowStore(element: HTMLElement | null, retainFocus: boolean) {
  let retainUntilBlur = false

  return {
    getSnapshot: () =>
      element !== null && (elementHasOverflow(element) || (retainUntilBlur && getActiveElement(element) === element)),
    subscribe(notify: () => void) {
      if (element === null) return () => {}

      const update = () => {
        if (retainFocus) {
          if (getActiveElement(element) !== element) retainUntilBlur = false
          else if (elementHasOverflow(element)) retainUntilBlur = true
        }
        notify()
      }
      const handleBlur = () => {
        retainUntilBlur = false
        notify()
      }

      if (retainFocus) {
        element.addEventListener('focus', update)
        element.addEventListener('blur', handleBlur)
        if (getActiveElement(element) !== element) retainUntilBlur = false
        else if (elementHasOverflow(element)) retainUntilBlur = true
      }

      const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
      resizeObserver?.observe(element)

      const mutationObserver = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(update)
      mutationObserver?.observe(element, {attributes: true, characterData: true, childList: true, subtree: true})

      return () => {
        mutationObserver?.disconnect()
        resizeObserver?.disconnect()
        if (retainFocus) {
          element.removeEventListener('focus', update)
          element.removeEventListener('blur', handleBlur)
        }
      }
    },
  }
}

function useOverflowState(element: HTMLElement | null, retainFocus: boolean): boolean {
  const store = useMemo(() => createOverflowStore(element, retainFocus), [element, retainFocus])
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false)
}

export function useOverflow(element: HTMLElement | null): boolean {
  return useOverflowState(element, false)
}

export function useOverflowWithFocusRetention(element: HTMLElement | null): boolean {
  return useOverflowState(element, true)
}
