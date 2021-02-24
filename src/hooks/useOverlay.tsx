import {useOnOutsideClick, useProvidedRefOrCreate} from './index'


export type UseOverlayProps = {
  forwardedRef: React.ForwardedRef<HTMLDivElement>
  triggerRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onClickOutside: (e: MouseEvent) => void
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}


export const useOverlay = ({forwardedRef, triggerRef, isOpen, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef)
  useOnOutsideClick({overlayRef, triggerRef, isOpen, onClickOutside})

  return {ref: overlayRef}
}