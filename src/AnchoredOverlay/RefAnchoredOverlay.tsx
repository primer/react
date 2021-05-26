import React, {useCallback, useMemo} from 'react'
import Overlay, {OverlayProps} from '../Overlay'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {FocusZoneHookSettings, useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition, useRenderForcingRef} from '../hooks'

export interface RefAnchoredOverlayProps extends Pick<OverlayProps, 'height' | 'width'> {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   */
  anchorRef: React.RefObject<HTMLElement>

  /**
   * Determines whether the overlay portion of the component should be shown or not
   */
  open: boolean

  /**
   * A callback which is called whenever the overlay is currently closed and an "open gesture" is detected.
   */
  onOpen?: (gesture: 'anchor-click' | 'anchor-key-press') => unknown

  /**
   * A callback which is called whenever the overlay is currently open and a "close gesture" is detected.
   */
  onClose?: (gesture: 'click-outside' | 'escape') => unknown

  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>

  /**
   * Settings to apply to the Focus Zone on the internal `Overlay` component.
   */
  focusZoneSettings?: Partial<FocusZoneHookSettings>
}

/**
 * An `AnchoredOverlay` provides an anchor that will open a floating overlay positioned relative to the anchor.
 * The overlay can be opened and navigated using keyboard or mouse.
 */
export const RefAnchoredOverlay: React.FC<RefAnchoredOverlayProps> = ({
  anchorRef,
  children,
  open,
  onClose,
  height,
  width,
  overlayProps,
  focusZoneSettings
}) => {
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()

  const onClickOutside = useCallback(() => onClose?.('click-outside'), [onClose])
  const onEscape = useCallback(() => onClose?.('escape'), [onClose])

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: overlayRef
    },
    [overlayRef.current]
  )
  const overlayPosition = useMemo(() => {
    return position && {top: `${position.top}px`, left: `${position.left}px`}
  }, [position])

  useFocusZone({
    containerRef: overlayRef,
    disabled: !open || !position,
    ...focusZoneSettings
  })
  useFocusTrap({containerRef: overlayRef, disabled: !open || !position})

  return (
    <>
      {open ? (
        <Overlay
          returnFocusRef={anchorRef}
          onClickOutside={onClickOutside}
          onEscape={onEscape}
          ref={updateOverlayRef}
          role="listbox"
          visibility={position ? 'visible' : 'hidden'}
          height={height}
          width={width}
          {...overlayPosition}
          {...overlayProps}
        >
          {children}
        </Overlay>
      ) : null}
    </>
  )
}

RefAnchoredOverlay.displayName = 'AnchoredOverlay'
