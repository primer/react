import React, {useEffect, useCallback} from 'react'

type TouchOrMouseEvent = MouseEvent | TouchEvent

export type UseOnOutsideClickParameters = {
  overlayRef: React.RefObject<HTMLDivElement>
  triggerRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onClickOutside: (e: TouchOrMouseEvent) => void
}



const shouldCallClickHandler = (triggerRef: React.RefObject<HTMLElement>, overlayRef: React.RefObject<HTMLDivElement>, e: TouchOrMouseEvent) => {
  let shouldCallHandler = true
  // only call click handler when primary button is pressed
  if (e instanceof MouseEvent && e.button > 0) {
    shouldCallHandler = false
  }

    if (overlayRef && 'current' in overlayRef && overlayRef.current?.contains(e.target as Node)) {
      shouldCallHandler = false
    } else if (triggerRef && triggerRef.current?.contains(e.target as Node)) {
      shouldCallHandler = false
    }

  return shouldCallHandler
}


export const useOnOutsideClick = ({overlayRef, triggerRef, isOpen, onClickOutside}: UseOnOutsideClickParameters): void => {
  const onOutsideClickInternal = useCallback(
    (e: TouchOrMouseEvent) => {
      if (!shouldCallClickHandler(triggerRef, overlayRef, e)) return
      onClickOutside(e)
    }, [onClickOutside, overlayRef, triggerRef]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', onOutsideClickInternal)
      document.addEventListener('touchstart', onOutsideClickInternal)
      return () => {
        document.removeEventListener('mousedown', onOutsideClickInternal)
        document.removeEventListener('touchstart', onOutsideClickInternal)
      }
    }
  }, [isOpen, onOutsideClickInternal])
}