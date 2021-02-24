import {useOnOutsideClick} from './index'


export type UseOverlayProps = {
  overlayRef: React.RefObject<HTMLDivElement>
  triggerRef: React.RefObject<HTMLElement>
  isOpen: boolean
  onClickOutside: (e: MouseEvent) => void
}


export const useOverlay = ({overlayRef, triggerRef, isOpen, onClickOutside}: UseOverlayProps): void => {
  useOnOutsideClick({overlayRef, triggerRef, isOpen, onClickOutside})
}