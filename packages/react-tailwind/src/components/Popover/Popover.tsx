'use client'

import {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'
import {mergeClassName} from '../../internal/mergeClassName'
import type {FloatingContentProps} from '../../utils/types'
import {Button, type ButtonProps} from '../Button'

const popupClassName =
  'min-w-[var(--overlay-width-small)] rounded-md bg-[var(--overlay-bgColor)] p-6 text-default shadow-floating-sm outline-none contrast-more:border-current data-[closed]:hidden'

export type PopoverRootProps = BasePopover.Root.Props

const Root = BasePopover.Root
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

export interface PopoverContentProps extends PopoverPopupProps, FloatingContentProps {}

const Content = React.forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    align = 'center',
    alignOffset,
    children,
    className,
    portal = true,
    positionerClassName,
    side = 'bottom',
    sideOffset = 8,
    ...rest
  },
  ref,
) {
  const inlinePortalRef = React.useRef<HTMLDivElement>(null)
  const content = (
    <PopupMarkerContext.Provider value="Popover.Content">
      <Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <Popup {...rest} ref={ref} className={className}>
          {children}
        </Popup>
      </Positioner>
    </PopupMarkerContext.Provider>
  )
  if (portal) return <Portal>{content}</Portal>

  return (
    <div ref={inlinePortalRef} className="contents">
      <Portal container={inlinePortalRef} className="contents">
        {content}
      </Portal>
    </div>
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

const Portal = ({children, ...rest}: BasePopover.Portal.Props) => (
  <BasePopover.Portal {...rest}>{children}</BasePopover.Portal>
)

const Arrow = React.forwardRef<HTMLDivElement, Omit<BasePopover.Arrow.Props, 'data-component'>>(function PopoverArrow(
  {className, ...rest},
  ref,
) {
  return (
    <BasePopover.Arrow
      {...rest}
      ref={ref}
      className={mergeClassName('fill-[var(--overlay-bgColor)] stroke-[var(--borderColor-default)]', className)}
      data-component="Popover.Arrow"
    />
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
;('use client')
