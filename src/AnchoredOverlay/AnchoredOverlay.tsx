import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import Overlay from '../Overlay'
import Button, {ButtonProps} from '../Button'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition, useRenderForcingRef} from '../hooks'
import {uniqueId} from '../utils/uniqueId'

export interface AnchoredOverlayProps {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   * Uses a `DropdownButton` by default.
   */
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element

  /**
   * Children node to use as the contents of the overlay
   */
  children: React.ReactNode

  /**
   * Determines whether the overlay portion of the component should be shown or not
   */
  open: boolean

  /**
   * A callback which is called whenever the overlay is open an a "close gesture" is detected.
   */
  onOpen?: (gesture: 'anchor-click' | 'anchor-key-press') => unknown

  /**
   * A callback which is called whenever the overlay is open an a "close gesture" is detected.
   */
  onClose?: (gesture: 'click-outside' | 'escape') => unknown
}

/**
 * An `AnchoredOverlay` provides an anchor (button by default) that will open a floating overlay.
 * The overlay can be opened and navigated using keyboard or mouse.
 */
export function AnchoredOverlay({
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props} />,
  children,
  open,
  onOpen,
  onClose
}: AnchoredOverlayProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()
  const [focusType, setFocusType] = useState<null | 'anchor' | 'list'>(null)
  const anchorId = useMemo(uniqueId, [])

  const onClickOutside = useCallback(() => onClose?.('click-outside'), [onClose])
  const onEscape = useCallback(() => onClose?.('escape'), [onClose])

  useEffect(() => {
    if (!open) {
      setFocusType(null)
    }
  }, [open])

  const onAnchorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!event.defaultPrevented) {
        if (!open) {
          if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            setFocusType('list')
            onOpen?.('anchor-key-press')
            event.preventDefault()
          } else if ([' ', 'Enter'].includes(event.key)) {
            setFocusType('anchor')
            onOpen?.('anchor-key-press')
            event.preventDefault()
          }
        } else if (focusType === 'anchor') {
          if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(event.key)) {
            setFocusType('list')
            event.preventDefault()
          } else if (event.key === 'Escape') {
            onClose?.('escape')
            event.preventDefault()
          }
        }
      }
    },
    [open, focusType, onOpen, onClose]
  )
  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented && event.button === 0 && !open) {
        onOpen?.('anchor-click')
        setFocusType('anchor')
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

  useFocusZone({containerRef: overlayRef, disabled: !open || focusType !== 'list' || !position})
  useFocusTrap({containerRef: overlayRef, disabled: !open || focusType !== 'list' || !position})

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
          initialFocusRef={anchorRef}
          returnFocusRef={anchorRef}
          onClickOutside={onClickOutside}
          onEscape={onEscape}
          ref={updateOverlayRef}
          role="listbox"
          visibility={position ? 'visible' : 'hidden'}
          {...position}
        >
          {children}
        </Overlay>
      ) : null}
    </>
  )
}

AnchoredOverlay.displayName = 'AnchoredOverlay'
