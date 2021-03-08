import {useOnOutsideClick, useOpenAndCloseFocus, useOnEscapePress} from './index'
import {TouchOrMouseEvent} from './useOnOutsideClick'
import {useRef} from 'react'

export type UseOverlayProps = {
  triggerRef: React.RefObject<HTMLElement>
  initialFocusRef?: React.RefObject<HTMLElement>
  returnRef: React.RefObject<HTMLElement>
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}


export const useOverlay = ({returnRef, initialFocusRef, onEscape, triggerRef, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useRef<HTMLDivElement>(null)
  useOpenAndCloseFocus({containerRef: overlayRef, returnRef, initialFocusRef})
  useOnOutsideClick({overlayRef, triggerRef, onClickOutside})
  useOnEscapePress({onEscape})
  return {ref: overlayRef}
}