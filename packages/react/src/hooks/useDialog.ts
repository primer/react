import {useCallback, useEffect} from 'react'
import {useOnEscapePress} from './useOnEscapePress'

const noop = () => null

function visible(el: HTMLInputElement) {
  return !el.hidden && (!el.type || el.type !== 'hidden') && (el.offsetWidth > 0 || el.offsetHeight > 0)
}

function focusable(el: Element) {
  const inputEl = el as HTMLInputElement
  return inputEl.tabIndex >= 0 && !inputEl.disabled && visible(inputEl)
}

type UseDialogParameters = {
  modalRef: React.RefObject<HTMLElement | null>
  overlayRef: React.RefObject<HTMLElement | null>
  isOpen?: boolean
  onDismiss?: () => void
  initialFocusRef?: React.RefObject<HTMLElement | null>
  closeButtonRef?: React.RefObject<HTMLElement | null>
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

function useDialog({
  modalRef,
  overlayRef,
  isOpen,
  onDismiss = noop,
  initialFocusRef,
  closeButtonRef,
}: UseDialogParameters) {
  const onClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        modalRef.current &&
        overlayRef.current &&
        e.target instanceof Node &&
        !modalRef.current.contains(e.target) &&
        overlayRef.current.contains(e.target)
      ) {
        onDismiss()
      }
    },
    [onDismiss, modalRef, overlayRef],
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
  }, [isOpen, initialFocusRef, closeButtonRef])

  const getFocusableItem = useCallback(
    (e: React.KeyboardEvent, movement: number) => {
      if (modalRef.current) {
        const items = Array.from(modalRef.current.querySelectorAll('*')).filter(focusable)
        if (items.length === 0) return
        e.preventDefault()
        const focusedElement = document.activeElement
        if (!focusedElement) {
          return
        }

        const index = items.indexOf(focusedElement)
        const offsetIndex = index + movement
        const fallbackIndex = movement === 1 ? 0 : items.length - 1
        const focusableItem = items[offsetIndex] || items[fallbackIndex]
        return focusableItem as HTMLElement
      }
    },
    [modalRef],
  )

  const handleTab = useCallback(
    (e: React.KeyboardEvent) => {
      const movement = e.shiftKey ? -1 : 1
      const focusableItem = getFocusableItem(e, movement)
      if (!focusableItem) {
        return
      }

      focusableItem.focus()
    },
    [getFocusableItem],
  )

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Tab':
          handleTab(event)
          break
      }
    },
    [handleTab],
  )

  const getDialogProps = () => {
    return {onKeyDown}
  }

  useOnEscapePress(
    (event: KeyboardEvent) => {
      if (isOpen) {
        onDismiss()
        event.preventDefault()
      }
    },
    [isOpen, onDismiss],
  )

  return {getDialogProps}
}

export default useDialog
