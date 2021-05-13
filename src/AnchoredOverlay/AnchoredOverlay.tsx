import React, {useCallback, useMemo, useRef} from 'react'
import Overlay, {OverlayProps} from '../Overlay'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {FocusZoneHookSettings, useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition, useRenderForcingRef} from '../hooks'
import {uniqueId} from '../utils/uniqueId'

export interface AnchoredOverlayProps extends Pick<OverlayProps, 'height' | 'width'> {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   */
  renderAnchor: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element

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
export const AnchoredOverlay: React.FC<AnchoredOverlayProps> = ({
  renderAnchor,
  children,
  open,
  onOpen,
  onClose,
  height,
  width,
  overlayProps,
  focusZoneSettings
}) => {
  const anchorRef = useRef<HTMLElement>(null)
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()
  const anchorId = useMemo(uniqueId, [])

  const onClickOutside = useCallback(() => onClose?.('click-outside'), [onClose])
  const onEscape = useCallback(() => onClose?.('escape'), [onClose])

  const onAnchorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!event.defaultPrevented) {
        if (!open && ['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(event.key)) {
          onOpen?.('anchor-key-press')
          event.preventDefault()
        }
      }
    },
    [open, onOpen]
  )
  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented && event.button === 0 && !open) {
        onOpen?.('anchor-click')
      }
    },
    [open, onOpen]
  )

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
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        tabIndex: 0,
        onClick: onAnchorClick,
        onKeyDown: onAnchorKeyDown
      })}
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

AnchoredOverlay.displayName = 'AnchoredOverlay'
