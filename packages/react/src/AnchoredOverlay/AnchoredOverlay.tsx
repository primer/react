import type React from 'react'
import {useCallback, useEffect} from 'react'
import type {OverlayProps} from '../Overlay'
import Overlay from '../Overlay'
import type {FocusTrapHookSettings} from '../hooks/useFocusTrap'
import {useFocusTrap} from '../hooks/useFocusTrap'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition, useProvidedRefOrCreate, useRenderForcingRef} from '../hooks'
import {useId} from '../hooks/useId'
import type {AnchorPosition, PositionSettings} from '@primer/behaviors'
import {useResponsiveValue, type ResponsiveValue} from '../hooks/useResponsiveValue'
import {IconButton, type IconButtonProps} from '../Button'
import {XIcon} from '@primer/octicons-react'
import classes from './AnchoredOverlay.module.css'
import {clsx} from 'clsx'

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
}

export type AnchoredOverlayProps = AnchoredOverlayBaseProps &
  (AnchoredOverlayPropsWithAnchor | AnchoredOverlayPropsWithoutAnchor) &
  Partial<Pick<PositionSettings, 'align' | 'side' | 'anchorOffset' | 'alignmentOffset'>>

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
  className,
  pinPosition,
  variant = defaultVariant,
  preventOverflow = true,
  onPositionChange,
  displayCloseButton = true,
  closeButtonProps = defaultCloseButtonProps,
}) => {
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()
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
      if (!open) {
        onOpen?.('anchor-click')
      } else {
        onClose?.('anchor-click')
      }
    },
    [open, onOpen, onClose],
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
      onPositionChange: positionChange,
    },
    [overlayRef.current],
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
    ...focusZoneSettings,
  })
  useFocusTrap({containerRef: overlayRef, disabled: !open || !position, ...focusTrapSettings})

  const currentResponsiveVariant = useResponsiveValue(variant, 'anchored')

  const showXIcon = onClose && variant.narrow === 'fullscreen' && displayCloseButton
  const XButtonAriaLabelledBy = closeButtonProps['aria-labelledby']
  const XButtonAriaLabel = closeButtonProps['aria-label']

  return (
    <>
      {renderAnchor &&
        renderAnchor({
          ref: anchorRef,
          id: anchorId,
          'aria-haspopup': 'true',
          'aria-expanded': open,
          tabIndex: 0,
          onClick: onAnchorClick,
          onKeyDown: onAnchorKeyDown,
        })}
      {open ? (
        <Overlay
          {...overlayProps}
          returnFocusRef={anchorRef}
          onClickOutside={onClickOutside}
          ignoreClickRefs={[anchorRef]}
          onEscape={onEscape}
          ref={updateOverlayRef}
          role="none"
          visibility={position ? 'visible' : 'hidden'}
          height={height}
          width={width}
          top={currentResponsiveVariant === 'anchored' ? position?.top || 0 : undefined}
          left={currentResponsiveVariant === 'anchored' ? position?.left || 0 : undefined}
          responsiveVariant={variant.narrow === 'fullscreen' ? 'fullscreen' : undefined}
          data-variant={currentResponsiveVariant}
          anchorSide={position?.anchorSide}
          className={className}
          preventOverflow={preventOverflow}
        >
          {showXIcon ? (
            <div className={classes.ResponsiveCloseButtonContainer}>
              <IconButton
                {...(closeButtonProps as IconButtonProps)}
                {...(XButtonAriaLabelledBy
                  ? {'aria-labelledby': XButtonAriaLabelledBy, 'aria-label': undefined}
                  : {'aria-label': XButtonAriaLabel ?? 'Close', 'aria-labelledby': undefined})}
                type="button"
                variant="invisible"
                icon={XIcon}
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

AnchoredOverlay.displayName = 'AnchoredOverlay'
