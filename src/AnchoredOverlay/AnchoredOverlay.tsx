import React, {useCallback, useMemo, useRef} from 'react'
import {OverlayProps} from '../Overlay'
import {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {uniqueId} from '../utils/uniqueId'
import {RefAnchoredOverlay} from './RefAnchoredOverlay'
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
  const anchorId = useMemo(uniqueId, [])

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
      <RefAnchoredOverlay
        anchorRef={anchorRef}
        children={children}
        open={open}
        onClose={onClose}
        height={height}
        width={width}
        overlayProps={overlayProps}
        focusZoneSettings={focusZoneSettings}
      />
    </>
  )
}

AnchoredOverlay.displayName = 'AnchoredOverlay'
