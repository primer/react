import React, { useEffect } from 'react'
import {initialFocus} from '../behaviors/initialFocus'


export type UseOpenAndCloseFocusProps = {
  initialFocusRef?: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>
  returnRef: React.RefObject<HTMLElement>
}

export function useOpenAndCloseFocus({initialFocusRef, returnRef, containerRef}: UseOpenAndCloseFocusProps): void {
  useEffect(() => {
    const focusElement = initialFocusRef ? initialFocusRef.current : null
    const returnFocus = returnRef.current
    initialFocus({initialFocusElement: focusElement, containerElement: containerRef.current})
    return function() {
      returnFocus?.focus()
    }
  }, [initialFocusRef, returnRef, containerRef])
}