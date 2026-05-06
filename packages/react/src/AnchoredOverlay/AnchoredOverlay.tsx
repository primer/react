import type React from 'react'
import {useCallback, useEffect, useState, type JSX} from 'react'
import type {OverlayProps} from '../Overlay'
import Overlay from '../Overlay'
import type {FocusTrapHookSettings} from '../hooks/useFocusTrap'
import {useFocusTrap} from '../hooks/useFocusTrap'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition, useProvidedRefOrCreate, useRenderForcingRef} from '../hooks'
import {useId} from '../hooks/useId'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {type ResponsiveValue} from '../hooks/useResponsiveValue'
import {IconButton, type IconButtonProps} from '../Button'
import {XIcon} from '@primer/octicons-react'
import classes from './AnchoredOverlay.module.css'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import {widthMap} from '../Overlay/Overlay'

interface AnchoredOverlayPropsWithAnchor {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   */
  renderAnchor: <T extends Omit<React.HTMLAttributes<HTMLElement>, 'aria-label' | 'aria-labelledby'>>(
    props: T,
  ) => JSX.Element

  /**
   * An override to the internal ref that will be spread on to the renderAnchor
   */
  anchorRef?: React.RefObject<HTMLElement | null>

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
  anchorRef: React.RefObject<HTMLElement | null>
  /**
   * An override to the internal id that will be spread on to the renderAnchor
   */
  anchorId?: string
}

export type AnchoredOverlayWrapperAnchorProps =
  | Partial<AnchoredOverlayPropsWithAnchor>
  | AnchoredOverlayPropsWithoutAnchor

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
  onClose?: (gesture: 'anchor-click' | 'click-outside' | 'escape' | 'close') => unknown

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

  /**
   * Optional className to be added to the overlay component.
   */
  className?: string
  /**
   * preventOverflow Optional. The Overlay width will be adjusted responsively if there is not enough space to display the Overlay.
   * If `preventOverflow` is `true`, the width of the `Overlay` will not be adjusted.
   */
  preventOverflow?: boolean
  /**
   * If true, the overlay will attempt to prevent position shifting when sitting at the top of the anchor.
   */
  pinPosition?: boolean
  /**
   * Optional prop to set variant for narrow screen sizes
   */
  variant?: ResponsiveValue<'anchored', 'anchored' | 'fullscreen'>
  /**
   * An override to the internal position that will be used to position the overlay.
   */
  onPositionChange?: ({position}: {position: AnchorPosition}) => void
  /**
   * Optional prop to display a close button in the overlay.
   */
  displayCloseButton?: boolean
  /**
   * Props to be spread on the close button in the overlay.
   */
  closeButtonProps?: Partial<IconButtonProps>
  /**
   * When `"popover"`, uses the Popover API only if the CSS anchor positioning feature flag is enabled
   * and the browser supports native CSS anchor positioning. Has no effect otherwise. Defaults to `"portal"`.
   */
  renderAs?: 'portal' | 'popover'
}

export type AnchoredOverlayProps = AnchoredOverlayBaseProps &
  (AnchoredOverlayPropsWithAnchor | AnchoredOverlayPropsWithoutAnchor) &
  Partial<Pick<PositionSettings, 'align' | 'side' | 'anchorOffset' | 'alignmentOffset' | 'displayInViewport'>>

const defaultVariant = {
  regular: 'anchored',
  narrow: 'anchored',
}

const defaultCloseButtonProps: Partial<IconButtonProps> = {}

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
  side = overlayProps?.['anchorSide'] || 'outside-bottom',
  align = 'start',
  alignmentOffset,
  anchorOffset,
  displayInViewport,
  className,
  pinPosition,
  variant = defaultVariant,
  preventOverflow = true,
  onPositionChange,
  displayCloseButton = true,
  closeButtonProps = defaultCloseButtonProps,
  renderAs = 'portal',
}) => {
  const cssAnchorPositioningFlag = useFeatureFlag('primer_react_css_anchor_positioning')
  // Lazy initial state so feature detection runs once per mount on the client.
  // Guarded for SSR where `document` is undefined.
  const [supportsNativeCSSAnchorPositioning] = useState(
    () => typeof document !== 'undefined' && 'anchorName' in document.documentElement.style,
  )

  const cssAnchorPositioning = cssAnchorPositioningFlag && supportsNativeCSSAnchorPositioning
  // Only use Popover API when both CSS anchor positioning is enabled AND renderAs is true
  const shouldRenderAsPopover = cssAnchorPositioning && renderAs === 'popover'
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
  // eslint-disable-next-line react-hooks/refs
  if (anchorRef.current !== anchorElement) {
    setAnchorElement(anchorRef.current)
  }
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()
  const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null)
  const anchorId = useId(externalAnchorId)

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
    [open, onOpen],
  )
  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      // Prevent the browser's native popovertarget toggle so React
      // stays the single source of truth for popover visibility.
      if (cssAnchorPositioning) {
        event.preventDefault()
      }
      if (!open) {
        onOpen?.('anchor-click')
      } else {
        onClose?.('anchor-click')
      }
    },
    [open, onOpen, onClose, cssAnchorPositioning],
  )

  const positionChange = (position: AnchorPosition | undefined) => {
    if (onPositionChange && position) {
      onPositionChange({position})
    }
  }

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: overlayRef,
      pinPosition,
      side,
      align,
      alignmentOffset,
      anchorOffset,
      displayInViewport,
      onPositionChange: positionChange,
      // When native CSS anchor positioning is active, skip JS-based position
      // computation, scroll listeners, and resize observers since the browser
      // handles repositioning natively.
      enabled: !cssAnchorPositioning,
    },

    [overlayElement],
  )

  useEffect(() => {
    // ensure overlay ref gets cleared when closed, so position can reset between closing/re-opening
    if (!open && overlayRef.current) {
      updateOverlayRef(null)
    }
  }, [open, overlayRef, updateOverlayRef])

  useFocusZone({
    containerRef: overlayRef,
    disabled: !open || (!position && !cssAnchorPositioning),
    ...focusZoneSettings,
  })
  useFocusTrap({
    containerRef: overlayRef,
    disabled: !open || (!position && !cssAnchorPositioning),
    ...focusTrapSettings,
  })

  const popoverId = useId()
  const id = popoverId.replaceAll(':', '_') // popoverId can contain colons which are invalid in CSS custom property names, so we replace them with underscores

  useEffect(() => {
    if (!cssAnchorPositioning || !anchorElement) return

    const currentOverlay = overlayRef.current

    // Link the anchor and the overlay (when present) via CSS anchor positioning.
    anchorElement.style.setProperty('anchor-name', `--anchored-overlay-anchor-${id}`)

    let pendingPositionFrame: number | null = null
    if (open && currentOverlay) {
      currentOverlay.style.setProperty('position-anchor', `--anchored-overlay-anchor-${id}`)

      // Defer the getBoundingClientRect read into a `requestAnimationFrame` so the style write above
      // does not force a synchronous layout.
      pendingPositionFrame = requestAnimationFrame(() => {
        pendingPositionFrame = null
        const overlayWidth = width ? parseInt(widthMap[width]) : null
        const result = getDefaultPosition(anchorElement, overlayWidth)

        currentOverlay.setAttribute('data-align', result.horizontal)

        // Apply offset only when viewport is too narrow
        const offset = result.horizontal === 'left' ? result.leftOffset : result.rightOffset
        currentOverlay.style.setProperty(`--anchored-overlay-anchor-offset-${result.horizontal}`, `${offset || 0}px`)
      })

      // Only call showPopover when shouldRenderAsPopover is enabled
      if (shouldRenderAsPopover) {
        try {
          if (!currentOverlay.matches(':popover-open')) {
            currentOverlay.showPopover()
          }
        } catch {
          // Ignore if popover is already showing or not supported
        }
      }
    }

    return () => {
      if (pendingPositionFrame !== null) cancelAnimationFrame(pendingPositionFrame)
      anchorElement.style.removeProperty('anchor-name')
      // The overlay may no longer be in the DOM at this point, so we need to check for its presence before trying to update it.
      if (currentOverlay) {
        currentOverlay.style.removeProperty('position-anchor')
      }
    }
    // overlayRef is a stable ref object; including it in deps is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssAnchorPositioning, shouldRenderAsPopover, open, anchorElement, overlayElement, id, width])

  const showXIcon = onClose && variant.narrow === 'fullscreen' && displayCloseButton
  const XButtonAriaLabelledBy = closeButtonProps['aria-labelledby']
  const XButtonAriaLabel = closeButtonProps['aria-label']

  const {className: overlayClassName, _PrivateDisablePortal, ...restOverlayProps} = overlayProps || {}

  return (
    <>
      {renderAnchor &&
        // eslint-disable-next-line react-hooks/refs
        renderAnchor({
          ref: anchorRef,
          id: anchorId,
          'aria-haspopup': 'true',
          'aria-expanded': open,
          tabIndex: 0,
          onClick: onAnchorClick,
          onKeyDown: onAnchorKeyDown,
          ...(shouldRenderAsPopover ? {popoverTarget: popoverId} : {}),
        })}
      {open ? (
        <Overlay
          returnFocusRef={anchorRef}
          onClickOutside={onClickOutside}
          ignoreClickRefs={[anchorRef]}
          onEscape={onEscape}
          role="none"
          visibility={cssAnchorPositioning || position ? 'visible' : 'hidden'}
          height={height}
          width={width}
          top={cssAnchorPositioning ? undefined : position?.top || 0}
          left={cssAnchorPositioning ? undefined : position?.left || 0}
          responsiveVariant={variant.narrow === 'fullscreen' ? 'fullscreen' : undefined}
          anchorSide={cssAnchorPositioning ? undefined : position?.anchorSide}
          className={clsx(className, overlayClassName, cssAnchorPositioning ? classes.AnchoredOverlay : undefined)}
          preventOverflow={preventOverflow}
          data-component="AnchoredOverlay"
          _PrivateDisablePortal={_PrivateDisablePortal}
          {...(shouldRenderAsPopover ? {popover: 'manual'} : {})}
          {...restOverlayProps}
          {...(shouldRenderAsPopover ? {id: popoverId} : {})}
          ref={node => {
            if (overlayProps?.ref) {
              assignRef(overlayProps.ref, node)
            }
            updateOverlayRef(node)
            setOverlayElement(node)
          }}
          data-anchor-position={cssAnchorPositioning}
          data-side={cssAnchorPositioning ? side : position?.anchorSide}
        >
          {showXIcon ? (
            <div className={classes.ResponsiveCloseButtonContainer}>
              <IconButton
                {...(closeButtonProps as IconButtonProps)}
                type="button"
                variant="invisible"
                icon={XIcon}
                {...(XButtonAriaLabelledBy
                  ? {'aria-labelledby': XButtonAriaLabelledBy, 'aria-label': undefined}
                  : {'aria-label': XButtonAriaLabel ?? 'Close', 'aria-labelledby': undefined})}
                className={clsx(classes.ResponsiveCloseButton, closeButtonProps.className)}
                onClick={() => {
                  onClose('close')
                }}
              />
            </div>
          ) : null}

          {children}
        </Overlay>
      ) : null}
    </>
  )
}

function getDefaultPosition(
  anchorElement: HTMLElement,
  overlayWidth: number | null,
): {horizontal: 'left' | 'right'; leftOffset?: number; rightOffset?: number} {
  const rect = anchorElement.getBoundingClientRect()
  const vw = window.innerWidth
  const viewportMargin = 8
  const spaceLeft = rect.left
  const spaceRight = vw - rect.right
  const horizontal: 'left' | 'right' = spaceLeft > spaceRight ? 'left' : 'right'

  // If there's no explicit overlay width, or either side has enough space
  // to contain the overlay, let CSS position-try-fallbacks handle positioning
  if (!overlayWidth || spaceLeft >= overlayWidth + viewportMargin || spaceRight >= overlayWidth + viewportMargin) {
    return {horizontal}
  }

  // If the viewport is too narrow to fit the overlay on either side, calculate offsets to prevent overflow
  // leftOffset is how much to shift the overlay to the right, rightOffset is how much to shift the overlay to the left
  const leftOffset = Math.max(0, overlayWidth - rect.right + viewportMargin)
  const rightOffset = Math.max(0, rect.left + overlayWidth - vw + viewportMargin)

  return {horizontal, leftOffset, rightOffset}
}

function assignRef<T>(
  ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null,
) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

AnchoredOverlay.displayName = 'AnchoredOverlay'
