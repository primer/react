import React, { useEffect } from 'react'
import {initialFocus} from '../behaviors/initialFocus'


export type UseInitialFocusProps = {
  initialFocusRef?: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>
  returnRef: React.RefObject<HTMLElement>
}

export function useInitialFocus({initialFocusRef, returnRef, containerRef}: UseInitialFocusProps): void {
  const focusElement = initialFocusRef ? initialFocusRef.current : null
  const returnFocus = returnRef.current
  useEffect(() => {
    initialFocus({initialFocusElement: focusElement, containerElement: containerRef.current})
    return function() {
      returnFocus?.focus()
    }
  }, [focusElement, returnFocus, containerRef])
}