import {useOnOutsideClick, useOpenAndCloseFocus, useOnEscapePress} from './index'
import {TouchOrMouseEvent} from './useOnOutsideClick'
import {AnchoredPositionHookSettings, useAnchoredPosition} from './useAnchoredPosition'
import {useRef} from 'react'

export type UseOverlayProps = {
  ignoreClickRefs: React.RefObject<HTMLElement> []
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  onEscape: (e: KeyboardEvent) => void
  onClickOutside: (e: TouchOrMouseEvent) => void
  anchorRef: React.RefObject<HTMLElement>
  positionDeps?: React.DependencyList
  positionSettings?: AnchoredPositionHookSettings
}

export type OverlayReturnProps = {
  ref: React.RefObject<HTMLDivElement>
  top?: number | undefined
  left?: number | undefined
}


export const useOverlay = ({anchorRef, positionSettings = {}, positionDeps, returnFocusRef, initialFocusRef, onEscape, ignoreClickRefs, onClickOutside}: UseOverlayProps): OverlayReturnProps => {
  const overlayRef = useRef<HTMLDivElement>(null)
  positionSettings.anchorElementRef = anchorRef
  positionSettings.floatingElementRef = overlayRef
  useOpenAndCloseFocus({containerRef: overlayRef, returnFocusRef, initialFocusRef})
  useOnOutsideClick({containerRef: overlayRef, ignoreClickRefs, onClickOutside})
  useOnEscapePress({onEscape})
  const {position} = useAnchoredPosition(positionSettings, positionDeps)
  return {ref: overlayRef, ...position}
}