import React from 'react'
import {useMenuInitialFocus} from './useMenuInitialFocus'
import {useTypeaheadFocus} from './useTypeaheadFocus'
import {MenuContextProps} from '../ActionMenu'

/**
 * Keyboard navigation is a mix of 3 hooks
 * useMenuInitialFocus, useTypeaheadFocus and useTabPress
 */
export const useMenuKeyboardNavigation = (
  open: boolean,
  onOpen: MenuContextProps['onOpen'],
  onClose: MenuContextProps['onClose'],
  containerRef: React.RefObject<HTMLElement>,
  anchorRef: React.RefObject<HTMLElement>
) => {
  const {openWithFocus} = useMenuInitialFocus(open, onOpen, containerRef, anchorRef)
  useTabPress(onClose, containerRef, anchorRef)
  useTypeaheadFocus(open, containerRef, anchorRef)

  return {containerRef, anchorRef, openWithFocus}
}

const useTabPress = (
  onClose: MenuContextProps['onClose'],
  containerRef: React.RefObject<HTMLElement>,
  anchorRef: React.RefObject<HTMLElement>
) => {
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && typeof onClose === 'function') onClose('tab')
    }

    const container = containerRef.current
    const anchor = anchorRef.current
    if (!container || !anchor) return

    container.addEventListener('keydown', handler)
    anchor.addEventListener('keydown', handler)
    return () => {
      container.removeEventListener('keydown', handler)
      anchor.addEventListener('keydown', handler)
    }
  }, [onClose, anchorRef, containerRef])
}
