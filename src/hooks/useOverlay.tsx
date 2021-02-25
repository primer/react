import {useOnOutsideClick, useProvidedRefOrCreate, useReturnFocus, useOnEscapePress} from './index'
import {TouchOrMouseEvent} from './useOnOutsideClick'
import {useRef} from 'react'

export type UseOverlayProps = {
  triggerRef: React.RefObject<HTMLElement>
  returnRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}


export const useOverlay = ({returnRef, onEscape, triggerRef, isOpen, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useRef<HTMLDivElement>(null)
  useOnOutsideClick({overlayRef, triggerRef, isOpen, onClickOutside})
  useOnEscapePress({isOpen, onEscape})
  useReturnFocus({returnRef, isOpen})

  return {ref: overlayRef}
}