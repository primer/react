import React, {useCallback, useMemo, useRef} from 'react'
import {uniqueId} from '../utils/uniqueId'
import {RefAnchoredOverlay, RefAnchoredOverlayProps} from './RefAnchoredOverlay'

export interface AnchoredOverlayProps extends Omit<RefAnchoredOverlayProps, 'anchorRef'> {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   */
  renderAnchor: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element
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
        open={open}
        onClose={onClose}
        height={height}
        width={width}
        overlayProps={overlayProps}
        focusZoneSettings={focusZoneSettings}
      >
        {children}
      </RefAnchoredOverlay>
    </>
  )
}

AnchoredOverlay.displayName = 'AnchoredOverlay'
