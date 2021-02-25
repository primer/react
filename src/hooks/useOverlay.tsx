import {useOnOutsideClick, useProvidedRefOrCreate, useReturnFocus, useOnEscapePress} from './index'
import {TouchOrMouseEvent} from './useOnOutsideClick'

export type UseOverlayProps = {
  forwardedRef: React.ForwardedRef<HTMLDivElement>
  triggerRef: React.RefObject<HTMLElement>
  returnRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}


export const useOverlay = ({forwardedRef, returnRef, onEscape, triggerRef, isOpen, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef)
  useOnOutsideClick({overlayRef, triggerRef, isOpen, onClickOutside})
  useOnEscapePress({isOpen, onEscape})
  useReturnFocus({returnRef, isOpen})

  return {ref: overlayRef}
}