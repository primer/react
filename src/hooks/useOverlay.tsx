import {useOnOutsideClick, useProvidedRefOrCreate} from './index'
import { useOnEscapePress } from './useOnEscapePress'
import {TouchOrMouseEvent} from './useOnOutsideClick'

export type UseOverlayProps = {
  forwardedRef: React.ForwardedRef<HTMLDivElement>
  triggerRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}


export const useOverlay = ({forwardedRef, onEscape, triggerRef, isOpen, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef)
  useOnOutsideClick({overlayRef, triggerRef, isOpen, onClickOutside})
  useOnEscapePress({isOpen, onEscape})

  return {ref: overlayRef}
}