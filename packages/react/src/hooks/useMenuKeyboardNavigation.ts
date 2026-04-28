import React from 'react'
import {iterateFocusableElements} from '@primer/behaviors/utils'
import {useMenuInitialFocus} from './useMenuInitialFocus'
import {useMnemonics} from './useMnemonics'
import type {MenuCloseHandler} from '../ActionMenu'

/**
 * Keyboard navigation is a mix of 4 hooks
 * 1. useMenuInitialFocus
 * 2. useTypeaheadFocus
 * 3. useCloseMenuOnTab
 * 4. useMoveFocusToMenuItem
 */
export const useMenuKeyboardNavigation = (
  open: boolean,
  onClose: MenuCloseHandler | undefined,
  containerRef?: React.RefObject<HTMLElement | null>,
  anchorRef?: React.RefObject<HTMLElement | null>,
  isSubmenu: boolean = false,
) => {
  useMenuInitialFocus(open, containerRef, anchorRef)
  useMnemonics(open, containerRef)
  useCloseMenuOnTab(open, onClose, containerRef, anchorRef)
  useMoveFocusToMenuItem(open, containerRef, anchorRef)
  useCloseSubmenuOnArrow(open, isSubmenu, onClose, containerRef)
}

/**
 * When Tab or Shift+Tab is pressed, the menu should close
 * and the focus should naturally move to the next item
 */
const useCloseMenuOnTab = (
  open: boolean,
  onClose: MenuCloseHandler | undefined,
  containerRef?: React.RefObject<HTMLElement | null>,
  anchorRef?: React.RefObject<HTMLElement | null>,
) => {
  React.useEffect(() => {
    const container = containerRef?.current
    const anchor = anchorRef?.current

    const handler = (event: KeyboardEvent) => {
      if (open && event.key === 'Tab') onClose?.('tab')
    }

    container?.addEventListener('keydown', handler)
    anchor?.addEventListener('keydown', handler)
    return () => {
      container?.removeEventListener('keydown', handler)
      anchor?.removeEventListener('keydown', handler)
    }
  }, [open, onClose, containerRef, anchorRef])
}

/**
 * Close submenu when left arrow key is pressed
 */
const useCloseSubmenuOnArrow = (
  open: boolean,
  isSubmenu: boolean,
  onClose: MenuCloseHandler | undefined,
  containerRef?: React.RefObject<HTMLElement | null>,
) => {
  React.useEffect(() => {
    const container = containerRef?.current

    const handler = (event: KeyboardEvent) => {
      if (open && isSubmenu && event.key === 'ArrowLeft') onClose?.('arrow-left')
    }

    container?.addEventListener('keydown', handler)
    return () => {
      container?.removeEventListener('keydown', handler)
    }
  }, [open, onClose, containerRef, isSubmenu])
}

/**
 * When Arrow Keys are pressed and the focus is on the anchor,
 * focus should move to a menu item
 */
const useMoveFocusToMenuItem = (
  open: boolean,
  containerRef?: React.RefObject<HTMLElement | null>,
  anchorRef?: React.RefObject<HTMLElement | null>,
) => {
  React.useEffect(() => {
    const container = containerRef?.current
    const anchor = anchorRef?.current
    const timeoutIds = new Set<ReturnType<typeof setTimeout>>()

    const focusAfterReactBatch = (element: HTMLElement | undefined) => {
      /** We push imperative focus to the next tick to prevent React's batching */
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId)
        element?.focus()
      })
      timeoutIds.add(timeoutId)
    }

    const handler = (event: KeyboardEvent) => {
      if (!open || !container) return

      const iterable = iterateFocusableElements(container)

      if (event.key === 'ArrowDown') {
        // TODO: does commenting this out break anything?
        // event.preventDefault() // prevent scroll event
        const firstElement = iterable.next().value
        focusAfterReactBatch(firstElement)
      } else if (event.key === 'ArrowUp') {
        // TODO: does commenting this out break anything?
        // event.preventDefault() // prevent scroll event
        const elements = [...iterable]
        const lastElement = elements[elements.length - 1]
        focusAfterReactBatch(lastElement)
      }
    }

    anchor?.addEventListener('keydown', handler)
    return () => {
      anchor?.removeEventListener('keydown', handler)
      for (const timeoutId of timeoutIds) clearTimeout(timeoutId)
    }
  }, [open, containerRef, anchorRef])
}
