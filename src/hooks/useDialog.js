import {useCallback, useEffect} from 'react'

function useDialog({modalRef, isOpen, onDismiss} = {}) {
  const onClickOutside = useCallback(
    (e) => {
      if (modalRef && modalRef.current && !modalRef.current.contains(e.target)) {
        onDismiss()
      }
    },
    [onDismiss, modalRef]
  )

  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', onClickOutside)
      return () => {
        document.removeEventListener('click', onClickOutside)
      }
    }
  }, [isOpen, onClickOutside])

  const getFocusableItem = (e, movement) => {
    if (modalRef && modalRef.current) {
      const items = Array.from(modalRef.current?.querySelectorAll('*')).filter(focusable)
      if (items.length === 0) return
      e.preventDefault()

      const focusedElement = document.activeElement
      const index = items.indexOf(focusedElement)
      const offsetIndex = index + movement
      const fallbackIndex = movement === 1 ? 0 : items.length - 1
      return items[offsetIndex] || items[fallbackIndex]
    }
  }

  function visible(el) {
    return !el.hidden && (!el.type || el.type !== 'hidden') && (el.offsetWidth > 0 || el.offsetHeight > 0)
  }

  const focusable = (el) => {
    return el.tabIndex >= 0 && !el.disabled && visible(el)
  }

  const handleTab = (e) => {
    const movement = e.shiftKey ? -1 : 1
    getFocusableItem(e, movement).focus()
  }

  const onKeyDown = (event) => {
    switch (event.key) {
      case 'Tab':
        handleTab(event)
        break
      case 'Escape':
        onDismiss()
        event.stopPropagation()
        break
    }
  }

  const getDialogProps = () => {
    return {onKeyDown}
  }

  return {getDialogProps}
}

export default useDialog
