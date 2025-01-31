import type React from 'react'
import {useEffect} from 'react'
import {iterateFocusableElements} from '@primer/behaviors/utils'

export type UseOpenAndCloseFocusSettings = {
  initialFocusRef?: React.RefObject<HTMLElement>
  containerRef: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  preventFocusOnOpen?: boolean
}

export function useOpenAndCloseFocus({
  initialFocusRef,
  returnFocusRef,
  containerRef,
  preventFocusOnOpen,
}: UseOpenAndCloseFocusSettings): void {
  useEffect(() => {
    const isOpen = containerRef.current || initialFocusRef?.current

    // Do nothing if component is open and focus should be prevented on open
    if (isOpen && preventFocusOnOpen) {
      return
    }

    // If initial focus ref is given and present, apply focus
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus()
    // If container ref is present, apply focus
    } else if (containerRef.current) {
      const firstItem = iterateFocusableElements(containerRef.current).next().value
      firstItem?.focus()
    }

    // Else, component is closed, and focus should be applied to given returnFocusRef element
    return function () {
      returnFocusRef.current?.focus()
    }
  }, [initialFocusRef, returnFocusRef, containerRef, preventFocusOnOpen])
}
