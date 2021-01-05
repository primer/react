import {useCallback, useEffect} from 'react'

function visible(el) {
  return !el.hidden && (!el.type || el.type !== 'hidden') && (el.offsetWidth > 0 || el.offsetHeight > 0)
}

function focusable(el) {
  return el.tabIndex >= 0 && !el.disabled && visible(el)
}

function useDialog({modalRef, isOpen, onDismiss, initialFocusRef, closeButtonRef, returnFocusRef} = {}) {
  const onClickOutside = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onDismiss()
        if (returnFocusRef && returnFocusRef.current) {
          returnFocusRef.current.focus()
        }
      }
    },
    [onDismiss, modalRef, returnFocusRef]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', onClickOutside)
      return () => {
        document.removeEventListener('click', onClickOutside)
      }
    }
  }, [isOpen, onClickOutside])

  useEffect(() => {
    if (isOpen) {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus()
      } else if (closeButtonRef && closeButtonRef.current) {
        closeButtonRef.current.focus()
      }
    }
  }, [isOpen, initialFocusRef, closeButtonRef, returnFocusRef])

  const getFocusableItem = useCallback(
    (e, movement) => {
      if (modalRef && modalRef.current) {
        const items = Array.from(modalRef.current.querySelectorAll('*')).filter(focusable)
        if (items.length === 0) return
        e.preventDefault()

        const focusedElement = document.activeElement
        const index = items.indexOf(focusedElement)
        const offsetIndex = index + movement
        const fallbackIndex = movement === 1 ? 0 : items.length - 1
        return items[offsetIndex] || items[fallbackIndex]
      }
    },
    [modalRef]
  )

  const handleTab = useCallback(
    (e) => {
      const movement = e.shiftKey ? -1 : 1
      getFocusableItem(e, movement).focus()
    },
    [getFocusableItem]
  )

  const onKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case 'Tab':
          handleTab(event)
          break
        case 'Escape':
          onDismiss()
          if (returnFocusRef && returnFocusRef.current) {
            returnFocusRef.current.focus()
          }
          event.stopPropagation()
          break
      }
    },
    [handleTab, onDismiss, returnFocusRef]
  )

  const getDialogProps = () => {
    return {onKeyDown}
  }

  return {getDialogProps}
}

export default useDialog
