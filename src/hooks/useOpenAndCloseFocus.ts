import React, { useEffect } from 'react'
import { iterateTabbableElements } from "../utils/iterateTabbable"


export type UseOpenAndCloseFocusProps = {
  initialFocusRef?: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
}

export function useOpenAndCloseFocus({initialFocusRef, returnFocusRef, containerRef}: UseOpenAndCloseFocusProps): void {
  useEffect(() => {
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus()
    } else if (containerRef && containerRef.current) {
      const firstItem = iterateTabbableElements(containerRef.current).next().value
      firstItem?.focus()
    }
    return function() {
      returnFocusRef?.current?.focus()
    }
  }, [initialFocusRef, returnFocusRef, containerRef])
}