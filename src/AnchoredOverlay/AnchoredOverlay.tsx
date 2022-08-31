import React, {useCallback, useEffect} from 'react'
import Overlay, {OverlayProps} from '../Overlay'
import {FocusTrapHookSettings, useFocusTrap} from '../hooks/useFocusTrap'
import {FocusZoneHookSettings, useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition, useProvidedRefOrCreate, useRenderForcingRef} from '../hooks'
import {useElementObserver} from '../hooks/useElementObserver'
import {useSSRSafeId} from '@react-aria/ssr'
import type {PositionSettings} from '@primer/behaviors'

interface AnchoredOverlayPropsWithAnchor {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   */
  renderAnchor: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element

  /**
   * An override to the internal ref that will be spread on to the renderAnchor
   */
  anchorRef?: React.RefObject<HTMLElement>

  /**
   * An override to the internal id that will be spread on to the renderAnchor
   */
  anchorId?: string
}

interface AnchoredOverlayPropsWithoutAnchor {
  /**
   * A custom function component used to render the anchor element.
   * When renderAnchor is null, an anchorRef is required.
   */
  renderAnchor: null

  /**
   * An override to the internal renderAnchor ref that will be used to position the overlay.
   * When renderAnchor is null this can be used to make an anchor that is detached from ActionMenu.
   */
  anchorRef: React.RefObject<HTMLElement>
  /**
   * An override to the internal id that will be spread on to the renderAnchor
   */
  anchorId?: string
}

export type AnchoredOverlayWrapperAnchorProps =
  | Partial<AnchoredOverlayPropsWithAnchor>
  | AnchoredOverlayPropsWithoutAnchor

export type OnCloseGesture = 'anchor-click' | 'anchor-key-press' | 'escape' | 'click-outside' | 'scroll-outside'

interface AnchoredOverlayBaseProps extends Pick<OverlayProps, 'height' | 'width'> {
  /**
   * Determines whether the overlay portion of the component should be shown or not
   */
  open: boolean

  /**
   * A callback which is called whenever the overlay is currently closed and an "open gesture" is detected.
   */
  onOpen?: (gesture: 'anchor-click' | 'anchor-key-press', event?: React.KeyboardEvent<HTMLElement>) => unknown

  /**
   * A callback which is called whenever the overlay is currently open and a "close gesture" is detected.
   */
  onClose?: (gesture: OnCloseGesture) => unknown

  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>

  /**
   * Settings to apply to the Focus Zone on the internal `Overlay` component.
   */
  focusTrapSettings?: Partial<FocusTrapHookSettings>

  /**
   * Settings to apply to the Focus Zone on the internal `Overlay` component.
   */
  focusZoneSettings?: Partial<FocusZoneHookSettings>
}

export type AnchoredOverlayProps = AnchoredOverlayBaseProps &
  (AnchoredOverlayPropsWithAnchor | AnchoredOverlayPropsWithoutAnchor) &
  Partial<Pick<PositionSettings, 'align' | 'side'>>

/**
 * An `AnchoredOverlay` provides an anchor that will open a floating overlay positioned relative to the anchor.
 * The overlay can be opened and navigated using keyboard or mouse.
 */
export const AnchoredOverlay: React.FC<React.PropsWithChildren<AnchoredOverlayProps>> = ({
  renderAnchor,
  anchorRef: externalAnchorRef,
  anchorId: externalAnchorId,
  children,
  open,
  onOpen,
  onClose,
  height,
  width,
  overlayProps,
  focusTrapSettings,
  focusZoneSettings,
  side,
  align
}) => {
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()
  const anchorId = useSSRSafeId(externalAnchorId)

  const onClickOutside = useCallback(() => onClose?.('click-outside'), [onClose])
  const onEscape = useCallback(() => onClose?.('escape'), [onClose])

  const onAnchorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!event.defaultPrevented) {
        if (!open && ['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(event.key)) {
          onOpen?.('anchor-key-press', event)
          event.preventDefault()
        }
      }
    },
    [open, onOpen]
  )
  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      if (!open) {
        onOpen?.('anchor-click')
      } else {
        onClose?.('anchor-click')
      }
    },
    [open, onOpen, onClose]
  )

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: overlayRef,
      side,
      align
    },
    [overlayRef.current],
    true // observe
  )

  useEffect(() => {
    // ensure overlay ref gets cleared when closed, so position can reset between closing/re-opening
    if (!open && overlayRef.current) {
      updateOverlayRef(null)
    }
  }, [open, overlayRef, updateOverlayRef])

  useFocusZone({
    containerRef: overlayRef,
    disabled: !open || !position,
    ...focusZoneSettings
  })
  useFocusTrap({containerRef: overlayRef, disabled: !open || !position, ...focusTrapSettings})

  // when anchor goes outside of clipping rect, close the overlay

  useElementObserver({
    elementRef: anchorRef,
    condition: open, // performance optimisation: only observe if overlay is open
    callback: anchorRect => {
      const clippingRect = getClippingDOMRect(anchorRef.current as Element)
      const isAnchorOutsideClippingRect = anchorRect.top > clippingRect.bottom || anchorRect.bottom < clippingRect.top

      if (isAnchorOutsideClippingRect) onClose?.('scroll-outside')
    }
  })

  return (
    <>
      {renderAnchor &&
        renderAnchor({
          ref: anchorRef,
          id: anchorId,
          'aria-haspopup': 'true',
          'aria-expanded': open ? 'true' : undefined,
          tabIndex: 0,
          onClick: onAnchorClick,
          onKeyDown: onAnchorKeyDown
        })}
      {open ? (
        <Overlay
          returnFocusRef={anchorRef}
          onClickOutside={onClickOutside}
          ignoreClickRefs={[anchorRef]}
          onEscape={onEscape}
          ref={updateOverlayRef}
          role="none"
          visibility={position ? 'visible' : 'hidden'}
          height={height}
          width={width}
          top={position?.top || 0}
          left={position?.left || 0}
          anchorSide={position?.anchorSide}
          {...overlayProps}
        >
          {children}
        </Overlay>
      ) : null}
    </>
  )
}

AnchoredOverlay.displayName = 'AnchoredOverlay'

AnchoredOverlay.defaultProps = {
  side: 'outside-bottom',
  align: 'start'
}

/**
 * Based on primer/behaviors: https://github.com/primer/behaviors/blob/main/src/anchored-position.ts#L188
 *
 * Returns the rectangle (relative to the window) that will clip the given element
 * if it is rendered outside of its bounds.
 */
function getClippingDOMRect(element: Element): DOMRect {
  let parentNode: typeof element.parentNode = element
  while (parentNode !== null) {
    if (parentNode === document.body) {
      break
    }
    const parentNodeStyle = getComputedStyle(parentNode as Element)
    if (parentNodeStyle.overflow !== 'visible') {
      break
    }
    parentNode = parentNode.parentNode
  }
  const clippingNode = parentNode === document.body || !(parentNode instanceof HTMLElement) ? document.body : parentNode

  return clippingNode.getBoundingClientRect()
}
