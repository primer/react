import type React from 'react'
import {useEffect} from 'react'
import {iterateFocusableElements} from '@primer/behaviors/utils'

export type UseOpenAndCloseFocusSettings = {
  initialFocusRef?: React.RefObject<HTMLElement | null>
  containerRef: React.RefObject<HTMLElement | null>
  returnFocusRef: React.RefObject<HTMLElement | null>
  preventFocusOnOpen?: boolean
}

export function useOpenAndCloseFocus({
  initialFocusRef,
  returnFocusRef,
  containerRef,
  preventFocusOnOpen,
}: UseOpenAndCloseFocusSettings): void {
  useEffect(() => {
    // If focus should be applied on open, apply focus to correct element,
    // either the initialFocusRef if given, otherwise the first focusable element
    if (!preventFocusOnOpen) {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus()
      } else if (containerRef.current) {
        const firstItem = iterateFocusableElements(containerRef.current).next().value
        firstItem?.focus()
      }
    }

    // If returnFocusRef element is rendered, apply focus
    const returnFocusRefCurrent = returnFocusRef.current
    return function () {
      returnFocusRefCurrent?.focus()
    }
  }, [initialFocusRef, returnFocusRef, containerRef, preventFocusOnOpen])
}
