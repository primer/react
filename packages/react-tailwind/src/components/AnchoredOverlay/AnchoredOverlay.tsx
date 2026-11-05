'use client'

import {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'
import {cn} from '../../internal/cn'
import {FloatingArrowGraphic, floatingArrowClassName} from '../../internal/floatingArrow'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {mergeClassName} from '../../internal/mergeClassName'
import {
  NarrowFullscreenCloseButton,
  type NarrowFullscreenCloseButtonProps,
} from '../../internal/NarrowFullscreenCloseButton'
import {
  isNarrowFullscreen,
  narrowFullscreenPopupClassName,
  narrowFullscreenPositionerClassName,
} from '../../internal/narrowFullscreen'
import {overlaySizeClassName} from '../../internal/overlaySize'
import type {AnchoredOverlayVariant, FloatingContentProps, OverlaySizeProps} from '../../utils/types'
import {usePortalContainer} from '../../internal/portalRoot'

const contentClassName =
  'min-w-48 max-w-[calc(100vw-var(--base-size-32))] max-h-dvh overflow-auto rounded-lg bg-[var(--overlay-bgColor)] text-default shadow-floating-sm outline-none contrast-more:border-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-200 motion-reduce:transition-none'

export type AnchoredOverlayRootProps<Payload = unknown> = BasePopover.Root.Props<Payload>

// A distinct function keeps the attached parts off Base UI's shared `Popover.Root`, which Popover also wraps.
function Root<Payload = unknown>(props: AnchoredOverlayRootProps<Payload>) {
  return <BasePopover.Root {...props} />
}
const PopupMarkerContext = React.createContext('AnchoredOverlay.Popup')

export type AnchoredOverlayTriggerProps = Omit<BasePopover.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLElement, AnchoredOverlayTriggerProps>(function AnchoredOverlayTrigger(
  {className, ...rest},
  ref,
) {
  return (
    <BasePopover.Trigger
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={mergeClassName('', className)}
      data-component="AnchoredOverlay.Trigger"
    />
  )
})

export type AnchoredOverlayCloseButtonProps = Omit<NarrowFullscreenCloseButtonProps, 'data-component'>

export interface AnchoredOverlayContentProps
  extends Omit<BasePopover.Popup.Props, 'data-component'>,
    FloatingContentProps,
    OverlaySizeProps {
  /** Props for the close button that the fullscreen variant shows, such as a more specific `aria-label`. */
  closeButtonProps?: AnchoredOverlayCloseButtonProps
  /**
   * Whether the fullscreen variant shows a close button.
   * @default true
   */
  displayCloseButton?: boolean
  /**
   * How the content is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a
   * close button.
   * @default 'anchored'
   */
  variant?: AnchoredOverlayVariant
}

const Content = React.forwardRef<HTMLDivElement, AnchoredOverlayContentProps>(function AnchoredOverlayContent(
  {
    align = 'start',
    alignOffset,
    anchor,
    children,
    className,
    closeButtonProps,
    displayCloseButton = true,
    height,
    maxHeight,
    maxWidth,
    portal = true,
    positionerClassName,
    side = 'bottom',
    sideOffset = 4,
    variant = 'anchored',
    width,
    ...rest
  },
  ref,
) {
  const fullscreen = isNarrowFullscreen(variant)
  const content = (
    <PopupMarkerContext.Provider value="AnchoredOverlay.Content">
      <Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        side={side}
        sideOffset={sideOffset}
        className={cn(fullscreen && narrowFullscreenPositionerClassName, positionerClassName)}
        data-responsive={fullscreen ? 'fullscreen' : undefined}
      >
        {fullscreen && displayCloseButton ? (
          <BasePopover.Close
            render={<NarrowFullscreenCloseButton {...closeButtonProps} data-component="AnchoredOverlay.CloseButton" />}
          />
        ) : null}
        <Popup
          {...rest}
          ref={ref}
          className={mergeClassName(
            cn(
              contentClassName,
              overlaySizeClassName({height, maxHeight, maxWidth, width}),
              fullscreen && narrowFullscreenPopupClassName,
            ),
            className,
          )}
        >
          {children}
        </Popup>
      </Positioner>
    </PopupMarkerContext.Provider>
  )

  return (
    <FloatingPortal part={Portal} portal={portal}>
      {content}
    </FloatingPortal>
  )
})

export type AnchoredOverlayPopupProps = Omit<BasePopover.Popup.Props, 'data-component'>

const Popup = React.forwardRef<HTMLDivElement, AnchoredOverlayPopupProps>(function AnchoredOverlayPopup(
  {className, ...rest},
  ref,
) {
  const marker = React.useContext(PopupMarkerContext)
  return (
    <BasePopover.Popup
      {...rest}
      ref={ref}
      className={mergeClassName(contentClassName, className)}
      data-component={marker}
    />
  )
})

export type AnchoredOverlayPositionerProps = Omit<BasePopover.Positioner.Props, 'data-component'>

const Positioner = React.forwardRef<HTMLDivElement, AnchoredOverlayPositionerProps>(function AnchoredOverlayPositioner(
  {className, ...rest},
  ref,
) {
  return (
    <BasePopover.Positioner
      {...rest}
      ref={ref}
      className={mergeClassName('z-popover', className)}
      data-component="AnchoredOverlay.Positioner"
    />
  )
})

function Portal({children, container, ...rest}: BasePopover.Portal.Props) {
  const portalContainer = usePortalContainer(container)
  return (
    <BasePopover.Portal {...rest} container={portalContainer}>
      {children}
    </BasePopover.Portal>
  )
}

const Arrow = React.forwardRef<HTMLDivElement, Omit<BasePopover.Arrow.Props, 'data-component'>>(
  function AnchoredOverlayArrow({children, className, ...rest}, ref) {
    return (
      <BasePopover.Arrow
        {...rest}
        ref={ref}
        className={mergeClassName(
          cn(
            floatingArrowClassName,
            '[--arrow-bg-color:var(--overlay-bgColor)] [--arrow-border-color:var(--borderColor-default)]',
          ),
          className,
        )}
        data-component="AnchoredOverlay.Arrow"
      >
        {children ?? <FloatingArrowGraphic />}
      </BasePopover.Arrow>
    )
  },
)

const Backdrop = React.forwardRef<HTMLDivElement, Omit<BasePopover.Backdrop.Props, 'data-component'>>(
  function AnchoredOverlayBackdrop({className, ...rest}, ref) {
    return (
      <BasePopover.Backdrop
        {...rest}
        ref={ref}
        className={mergeClassName('fixed inset-0 z-popover bg-transparent', className)}
        data-component="AnchoredOverlay.Backdrop"
      />
    )
  },
)

const Close = React.forwardRef<HTMLElement, Omit<BasePopover.Close.Props, 'data-component'>>(
  function AnchoredOverlayClose({className, ...rest}, ref) {
    return (
      <BasePopover.Close
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={mergeClassName('', className)}
        data-component="AnchoredOverlay.Close"
      />
    )
  },
)

const Title = React.forwardRef<HTMLHeadingElement, Omit<BasePopover.Title.Props, 'data-component'>>(
  function AnchoredOverlayTitle({className, ...rest}, ref) {
    return (
      <BasePopover.Title
        {...rest}
        ref={ref}
        className={mergeClassName('font-semibold text-default', className)}
        data-component="AnchoredOverlay.Title"
      />
    )
  },
)

const Description = React.forwardRef<HTMLParagraphElement, Omit<BasePopover.Description.Props, 'data-component'>>(
  function AnchoredOverlayDescription({className, ...rest}, ref) {
    return (
      <BasePopover.Description
        {...rest}
        ref={ref}
        className={mergeClassName('mt-1 text-sm text-muted', className)}
        data-component="AnchoredOverlay.Description"
      />
    )
  },
)

export const AnchoredOverlay = Object.assign(Root, {
  Root,
  Trigger,
  Content,
  Popup,
  Positioner,
  Portal,
  Arrow,
  Backdrop,
  Close,
  Title,
  Description,
})
;(AnchoredOverlay as {displayName?: string}).displayName = 'AnchoredOverlay'
