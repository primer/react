import React, { useEffect } from 'react'
import { iterateTabbableElements } from "../utils/iterateTabbable"


export type UseOpenAndCloseFocusProps = {
  initialFocusRef?: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>
  returnRef: React.RefObject<HTMLElement>
}

export function useOpenAndCloseFocus({initialFocusRef, returnRef, containerRef}: UseOpenAndCloseFocusProps): void {
  useEffect(() => {
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus()
    } else if (containerRef && containerRef.current) {
      const firstItem = iterateTabbableElements(containerRef.current).next().value
      firstItem?.focus()
    }
    return function() {
      returnRef?.current?.focus()
    }
  }, [initialFocusRef, returnRef, containerRef])
}