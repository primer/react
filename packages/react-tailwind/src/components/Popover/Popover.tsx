import {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'
import {cn} from '../../internal/cn'
import {Button, type ButtonProps} from '../Button'

const popupClassName =
  'min-w-48 rounded-md border border-default bg-default p-3 text-default shadow-floating-lg outline-none contrast-more:border-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-150 motion-reduce:transition-none'

function mergeClassName<State>(base: string, className: string | ((state: State) => string | undefined) | undefined) {
  return typeof className === 'function' ? (state: State) => cn(base, className(state)) : cn(base, className)
}

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

export interface PopoverContentProps extends PopoverPopupProps {
  align?: BasePopover.Positioner.Props['align']
  side?: BasePopover.Positioner.Props['side']
  sideOffset?: BasePopover.Positioner.Props['sideOffset']
  alignOffset?: BasePopover.Positioner.Props['alignOffset']
  portal?: boolean
  positionerClassName?: string
}

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
  return portal ? <Portal>{content}</Portal> : content
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
      className={mergeClassName('fill-default stroke-default', className)}
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
        className={mergeClassName('text-lg font-semibold text-default', className)}
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
