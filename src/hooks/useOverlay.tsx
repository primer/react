import {useOnOutsideClick, TouchOrMouseEvent} from './useOnOutsideClick'
import {useOpenAndCloseFocus} from './useOpenAndCloseFocus'
import {useOnEscapePress} from './useOnEscapePress'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

export type UseOverlaySettings = {
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
  overlayRef?: React.RefObject<HTMLDivElement>
  preventFocusOnOpen?: boolean
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
}

export const useOverlay = ({
  overlayRef: _overlayRef,
  returnFocusRef,
  initialFocusRef,
  onEscape,
  ignoreClickRefs,
  onClickOutside,
  preventFocusOnOpen
}: UseOverlaySettings): OverlayReturnProps => {
  const overlayRef = useProvidedRefOrCreate<HTMLDivElement>(_overlayRef)
  useOpenAndCloseFocus({containerRef: overlayRef, returnFocusRef, initialFocusRef, preventFocusOnOpen})
  useOnOutsideClick({containerRef: overlayRef, ignoreClickRefs, onClickOutside})

  /** Don't bubble Escape event up the tree  */
  const onEscapeWithStoppedPropagation: UseOverlaySettings['onEscape'] = event => {
    event.stopPropagation()
    onEscape(event)
  }
  useOnEscapePress(onEscapeWithStoppedPropagation, undefined, overlayRef)
  return {ref: overlayRef}
}
