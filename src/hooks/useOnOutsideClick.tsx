import React, {useEffect, useCallback} from 'react'


export type UseOnOutsideClickParameters = {
  overlayRef: React.RefObject<HTMLDivElement>
  triggerRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onClickOutside: (e: MouseEvent) => void
}


const shouldCallClickHandler = (triggerRef: React.RefObject<HTMLElement>, overlayRef: React.RefObject<HTMLDivElement>, e: MouseEvent) => {
  let shouldCallHandler = true

    if (overlayRef && 'current' in overlayRef && overlayRef.current?.contains(e.target as Node)) {
      shouldCallHandler = false
    } else if (triggerRef && triggerRef.current?.contains(e.target as Node)) {
      shouldCallHandler = false
    }

  return shouldCallHandler
}


export const useOnOutsideClick = ({overlayRef, triggerRef, isOpen, onClickOutside}: UseOnOutsideClickParameters) => {
  const onOutsideClickInternal = useCallback(
    (e: MouseEvent) => {
      if (!shouldCallClickHandler(triggerRef, overlayRef, e)) return
      onClickOutside(e)
    }, [onClickOutside, overlayRef, triggerRef]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', onOutsideClickInternal)
      return () => {
        document.removeEventListener('mousedown', onOutsideClickInternal)
      }
    }
  }, [isOpen, onOutsideClickInternal])
}