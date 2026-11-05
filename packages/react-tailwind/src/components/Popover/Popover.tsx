'use client'

import {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'
import {cn} from '../../internal/cn'
import {FloatingArrowGraphic, floatingArrowClassName} from '../../internal/floatingArrow'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {mergeClassName} from '../../internal/mergeClassName'
import type {FloatingContentProps, PopoverHeight, PopoverWidth} from '../../utils/types'
import {Button, type ButtonProps} from '../Button'
import {usePortalContainer} from '../../internal/portalRoot'

const popupClassName =
  'rounded-md bg-[var(--overlay-bgColor)] p-6 text-default shadow-floating-sm outline-none contrast-more:border-current data-[closed]:hidden'

const widthClassNames = {
  xsmall: 'w-[var(--overlay-width-xsmall)]',
  small: 'w-[var(--overlay-width-small)]',
  medium: 'w-[var(--overlay-width-medium)]',
  large: 'w-[var(--overlay-width-large)]',
  xlarge: 'w-[var(--overlay-width-xlarge)]',
  auto: 'w-auto',
} as const satisfies Record<PopoverWidth, string>

const heightClassNames = {
  small: 'h-[var(--overlay-height-small)]',
  medium: 'h-[var(--overlay-height-medium)]',
  large: 'h-[var(--overlay-height-large)]',
  xlarge: 'h-[var(--overlay-height-xlarge)]',
  'fit-content': 'h-fit',
  auto: 'h-auto',
} as const satisfies Record<PopoverHeight, string>

export type PopoverRootProps<Payload = unknown> = BasePopover.Root.Props<Payload>

// A distinct function keeps the attached parts off Base UI's shared `Popover.Root`, which AnchoredOverlay also wraps.
function Root<Payload = unknown>(props: PopoverRootProps<Payload>) {
  return <BasePopover.Root {...props} />
}
const PopupMarkerContext = React.createContext('Popover.Popup')

export type PopoverTriggerProps = Omit<BasePopover.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(function PopoverTrigger({className, ...rest}, ref) {
  return (
    <BasePopover.Trigger
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={mergeClassName('', className)}
      data-component="Popover.Trigger"
    />
  )
})

export type PopoverButtonProps = Omit<ButtonProps, 'data-component' | 'render'>

const ButtonTrigger = React.forwardRef<HTMLElement, PopoverButtonProps>(function PopoverButton(
  {children, disabled, loading, ...rest},
  ref,
) {
  return (
    <BasePopover.Trigger
      disabled={disabled || loading}
      ref={ref as React.Ref<HTMLButtonElement>}
      render={<Button {...rest} disabled={disabled} loading={loading} data-component="Popover.Button" />}
    >
      {children}
    </BasePopover.Trigger>
  )
})

export type PopoverPopupProps = Omit<BasePopover.Popup.Props, 'data-component'>

const Popup = React.forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup({className, ...rest}, ref) {
  const marker = React.useContext(PopupMarkerContext)
  return (
    <BasePopover.Popup
      {...rest}
      ref={ref}
      className={mergeClassName(popupClassName, className)}
      data-component={marker}
    />
  )
})

export interface PopoverContentProps extends PopoverPopupProps, FloatingContentProps {
  /**
   * Height of the content, on the overlay height token scale.
   * @default 'fit-content'
   */
  height?: PopoverHeight
  /**
   * Width of the content, on the overlay width token scale.
   * @default 'small'
   */
  width?: PopoverWidth
}

const Content = React.forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    align = 'center',
    alignOffset,
    anchor,
    children,
    className,
    height = 'fit-content',
    portal = true,
    positionerClassName,
    side = 'bottom',
    sideOffset = 8,
    width = 'small',
    ...rest
  },
  ref,
) {
  const content = (
    <PopupMarkerContext.Provider value="Popover.Content">
      <Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <Popup
          {...rest}
          ref={ref}
          className={mergeClassName(cn(widthClassNames[width], heightClassNames[height]), className)}
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

export type PopoverPositionerProps = Omit<BasePopover.Positioner.Props, 'data-component'>

const Positioner = React.forwardRef<HTMLDivElement, PopoverPositionerProps>(function PopoverPositioner(
  {className, ...rest},
  ref,
) {
  return (
    <BasePopover.Positioner
      {...rest}
      ref={ref}
      className={mergeClassName('z-popover', className)}
      data-component="Popover.Positioner"
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

const Arrow = React.forwardRef<HTMLDivElement, Omit<BasePopover.Arrow.Props, 'data-component'>>(function PopoverArrow(
  {children, className, ...rest},
  ref,
) {
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
      data-component="Popover.Arrow"
    >
      {children ?? <FloatingArrowGraphic />}
    </BasePopover.Arrow>
  )
})

const Backdrop = React.forwardRef<HTMLDivElement, Omit<BasePopover.Backdrop.Props, 'data-component'>>(
  function PopoverBackdrop({className, ...rest}, ref) {
    return (
      <BasePopover.Backdrop
        {...rest}
        ref={ref}
        className={mergeClassName('fixed inset-0 z-popover bg-transparent', className)}
        data-component="Popover.Backdrop"
      />
    )
  },
)

const Title = React.forwardRef<HTMLHeadingElement, Omit<BasePopover.Title.Props, 'data-component'>>(
  function PopoverTitle({className, ...rest}, ref) {
    return (
      <BasePopover.Title
        {...rest}
        ref={ref}
        className={mergeClassName('m-0 text-title-small font-semibold text-default', className)}
        data-component="Popover.Title"
      />
    )
  },
)

const Description = React.forwardRef<HTMLParagraphElement, Omit<BasePopover.Description.Props, 'data-component'>>(
  function PopoverDescription({className, ...rest}, ref) {
    return (
      <BasePopover.Description
        {...rest}
        ref={ref}
        className={mergeClassName('mt-1 text-sm text-muted', className)}
        data-component="Popover.Description"
      />
    )
  },
)

const Close = React.forwardRef<HTMLElement, Omit<BasePopover.Close.Props, 'data-component'>>(function PopoverClose(
  {className, ...rest},
  ref,
) {
  return (
    <BasePopover.Close
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={mergeClassName('', className)}
      data-component="Popover.Close"
    />
  )
})

const Viewport = React.forwardRef<HTMLDivElement, Omit<BasePopover.Viewport.Props, 'data-component'>>(
  function PopoverViewport({className, ...rest}, ref) {
    return (
      <BasePopover.Viewport
        {...rest}
        ref={ref}
        className={mergeClassName('', className)}
        data-component="Popover.Viewport"
      />
    )
  },
)

export const Popover = Object.assign(Root, {
  Root,
  Trigger,
  Button: ButtonTrigger,
  Popup,
  Content,
  Positioner,
  Portal,
  Arrow,
  Backdrop,
  Title,
  Description,
  Close,
  Viewport,
})
;(Popover as {displayName?: string}).displayName = 'Popover'
