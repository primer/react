import React, {useEffect, useCallback} from 'react'

export type UseInitialFocusProps = {
  initialFocusRef?: React.RefObject<HTMLElement>
  containerRef: React.RefObject<HTMLElement>
  isOpen: boolean
}


function visible(el: HTMLInputElement) {
  return !el.hidden && (!el.type || el.type !== 'hidden') && (el.offsetWidth > 0 || el.offsetHeight > 0)
}

function focusable(el: Element) {
  const inputEl = el as HTMLInputElement
  return inputEl.tabIndex >= 0 && !inputEl.disabled && visible(inputEl)
}

export const useInitialFocus = ({initialFocusRef, containerRef, isOpen}: UseInitialFocusProps) => {
  useEffect(() => {
    if (isOpen) {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus()
      } else {
        const firstItem = getFirstFocusableItem()
        firstItem ? firstItem.focus() : null
      }
    }
  }, [isOpen, initialFocusRef])


  const getFirstFocusableItem = useCallback(() => {
    let firstItem = null
    if (containerRef && containerRef.current) {
      const items = Array.from(containerRef.current.querySelectorAll('*')).filter(focusable)
      if (items.length === 0) return
      firstItem = items[0]
    }
    return firstItem as HTMLElement
  },[containerRef])
}