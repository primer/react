import type {TouchOrMouseEvent} from './useOnOutsideClick'
import {useOnOutsideClick} from './useOnOutsideClick'
import {useOpenAndCloseFocus} from './useOpenAndCloseFocus'
import {useOnEscapePress} from './useOnEscapePress'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'

export type UseOverlaySettings = {
  ignoreClickRefs?: React.RefObject<HTMLElement | null>[]
  initialFocusRef?: React.RefObject<HTMLElement | null>
  returnFocusRef: React.RefObject<HTMLElement | null>
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
  overlayRef?: React.RefObject<HTMLDivElement | null>
  preventFocusOnOpen?: boolean
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement | null>
}

export const useOverlay = ({
  overlayRef: _overlayRef,
  returnFocusRef,
  initialFocusRef,
  onEscape,
  ignoreClickRefs,
  onClickOutside,
  preventFocusOnOpen,
}: UseOverlaySettings): OverlayReturnProps => {
  const overlayRef = useProvidedRefOrCreate<HTMLDivElement>(_overlayRef)
  useOpenAndCloseFocus({containerRef: overlayRef, returnFocusRef, initialFocusRef, preventFocusOnOpen})
  useOnOutsideClick({containerRef: overlayRef, ignoreClickRefs, onClickOutside})

  // We only want one overlay to close at a time
  const preventeddefaultCheckedEscape: UseOverlaySettings['onEscape'] = event => {
    onEscape(event)
    event.preventDefault()
  }
  useOnEscapePress(preventeddefaultCheckedEscape)
  return {ref: overlayRef}
}
