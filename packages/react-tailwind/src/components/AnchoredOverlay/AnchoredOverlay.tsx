import {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'
import {cn} from '../../internal/cn'

const contentClassName =
  'min-w-48 rounded-md border border-default bg-default p-3 text-default shadow-floating-lg outline-none contrast-more:border-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-150 motion-reduce:transition-none'

function mergeClassName<State>(base: string, className: string | ((state: State) => string | undefined) | undefined) {
  return typeof className === 'function' ? (state: State) => cn(base, className(state)) : cn(base, className)
}

export type AnchoredOverlayRootProps = BasePopover.Root.Props

const Root = BasePopover.Root
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

export interface AnchoredOverlayContentProps extends Omit<BasePopover.Popup.Props, 'data-component'> {
  align?: BasePopover.Positioner.Props['align']
  side?: BasePopover.Positioner.Props['side']
  sideOffset?: BasePopover.Positioner.Props['sideOffset']
  alignOffset?: BasePopover.Positioner.Props['alignOffset']
  portal?: boolean
  positionerClassName?: string
}

const Content = React.forwardRef<HTMLDivElement, AnchoredOverlayContentProps>(function AnchoredOverlayContent(
  {
    align = 'start',
    alignOffset,
    children,
    className,
    portal = true,
    positionerClassName,
    side = 'bottom',
    sideOffset = 4,
    ...rest
  },
  ref,
) {
  const content = (
    <PopupMarkerContext.Provider value="AnchoredOverlay.Content">
      <Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <Popup {...rest} ref={ref} className={mergeClassName(contentClassName, className)}>
          {children}
        </Popup>
      </Positioner>
    </PopupMarkerContext.Provider>
  )

  return portal ? <Portal>{content}</Portal> : content
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

const Portal = ({children, ...rest}: BasePopover.Portal.Props) => (
  <BasePopover.Portal {...rest}>{children}</BasePopover.Portal>
)

const Arrow = React.forwardRef<HTMLDivElement, Omit<BasePopover.Arrow.Props, 'data-component'>>(
  function AnchoredOverlayArrow({className, ...rest}, ref) {
    return (
      <BasePopover.Arrow
        {...rest}
        ref={ref}
        className={mergeClassName('fill-default stroke-default', className)}
        data-component="AnchoredOverlay.Arrow"
      />
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
        className={mergeClassName('text-lg font-semibold text-default', className)}
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
