import {useOnOutsideClick, useOpenAndCloseFocus, useOnEscapePress} from './index'
import {TouchOrMouseEvent} from './useOnOutsideClick'
import {useRef} from 'react'

export type UseOverlayProps = {
  ignoreClickRefs: React.RefObject<HTMLElement> []
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}


export const useOverlay = ({returnFocusRef, initialFocusRef, onEscape, ignoreClickRefs, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useRef<HTMLDivElement>(null)
  useOpenAndCloseFocus({containerRef: overlayRef, returnFocusRef, initialFocusRef})
  useOnOutsideClick({containerRef: overlayRef, ignoreClickRefs, onClickOutside})
  useOnEscapePress({onEscape})
  return {ref: overlayRef}
}