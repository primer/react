import {useOnOutsideClick, useInitialFocus, useReturnFocus, useOnEscapePress} from './index'
import {TouchOrMouseEvent} from './useOnOutsideClick'
import {useRef} from 'react'

export type UseOverlayProps = {
  triggerRef: React.RefObject<HTMLElement>
  initialFocusRef?: React.RefObject<HTMLElement>
  returnRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}


export const useOverlay = ({returnRef, initialFocusRef, onEscape, triggerRef, isOpen, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useRef<HTMLDivElement>(null)
  useInitialFocus({containerRef: overlayRef, initialFocusRef, isOpen})
  useOnOutsideClick({overlayRef, triggerRef, isOpen, onClickOutside})
  useOnEscapePress({isOpen, onEscape})
  useReturnFocus({returnRef, isOpen})

  return {ref: overlayRef}
}