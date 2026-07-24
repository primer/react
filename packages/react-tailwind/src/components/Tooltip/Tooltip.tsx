import {Tooltip as BaseTooltip} from '@base-ui/react/tooltip'
import React from 'react'
import {cn} from '../../internal/cn'

const popupClassName =
  'max-w-xs rounded-md bg-inset px-2 py-1 text-xs text-on-emphasis shadow-floating-sm outline-none contrast-more:outline contrast-more:outline-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-150 motion-reduce:transition-none'

function mergeClassName<State>(base: string, className: string | ((state: State) => string | undefined) | undefined) {
  return typeof className === 'function' ? (state: State) => cn(base, className(state)) : cn(base, className)
}

export type TooltipRootProps = BaseTooltip.Root.Props

const TooltipIdContext = React.createContext<string | undefined>(undefined)
const PopupMarkerContext = React.createContext('Tooltip.Popup')

const Root = ({children, ...rest}: TooltipRootProps) => {
  const tooltipId = React.useId()
  return (
    <TooltipIdContext.Provider value={tooltipId}>
      <BaseTooltip.Root {...rest}>{children}</BaseTooltip.Root>
    </TooltipIdContext.Provider>
  )
}

export type TooltipTriggerProps = Omit<BaseTooltip.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(function TooltipTrigger(
  {className, 'aria-describedby': describedBy, ...rest},
  ref,
) {
  const tooltipId = React.useContext(TooltipIdContext)
  return (
    <BaseTooltip.Trigger
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      aria-describedby={[describedBy, tooltipId].filter(Boolean).join(' ') || undefined}
      className={mergeClassName('', className)}
      data-component="Tooltip.Trigger"
    />
  )
})

export type TooltipPopupProps = Omit<BaseTooltip.Popup.Props, 'data-component'>

const Popup = React.forwardRef<HTMLDivElement, TooltipPopupProps>(function TooltipPopup({className, ...rest}, ref) {
  const marker = React.useContext(PopupMarkerContext)
  return (
    <BaseTooltip.Popup
      {...rest}
      ref={ref}
      className={mergeClassName(popupClassName, className)}
      data-component={marker}
    />
  )
})

export interface TooltipContentProps extends TooltipPopupProps {
  align?: BaseTooltip.Positioner.Props['align']
  side?: BaseTooltip.Positioner.Props['side']
  sideOffset?: BaseTooltip.Positioner.Props['sideOffset']
  alignOffset?: BaseTooltip.Positioner.Props['alignOffset']
  portal?: boolean
  positionerClassName?: string
}

const Content = React.forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  {
    align = 'center',
    alignOffset,
    children,
    className,
    portal = true,
    positionerClassName,
    side = 'top',
    sideOffset = 8,
    ...rest
  },
  ref,
) {
  const tooltipId = React.useContext(TooltipIdContext)
  const content = (
    <PopupMarkerContext.Provider value="Tooltip.Content">
      <Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <Popup {...rest} ref={ref} id={tooltipId} role="tooltip" className={className}>
          {children}
        </Popup>
      </Positioner>
    </PopupMarkerContext.Provider>
  )
  return portal ? <Portal>{content}</Portal> : content
})

const Positioner = React.forwardRef<HTMLDivElement, Omit<BaseTooltip.Positioner.Props, 'data-component'>>(
  function TooltipPositioner({className, ...rest}, ref) {
    return (
      <BaseTooltip.Positioner
        {...rest}
        ref={ref}
        className={mergeClassName('z-popover', className)}
        data-component="Tooltip.Positioner"
      />
    )
  },
)

const Portal = ({children, ...rest}: BaseTooltip.Portal.Props) => (
  <BaseTooltip.Portal {...rest}>{children}</BaseTooltip.Portal>
)

const Arrow = React.forwardRef<HTMLDivElement, Omit<BaseTooltip.Arrow.Props, 'data-component'>>(function TooltipArrow(
  {className, ...rest},
  ref,
) {
  return (
    <BaseTooltip.Arrow
      {...rest}
      ref={ref}
      className={mergeClassName('fill-inset', className)}
      data-component="Tooltip.Arrow"
    />
  )
})

const Viewport = React.forwardRef<HTMLDivElement, Omit<BaseTooltip.Viewport.Props, 'data-component'>>(
  function TooltipViewport({className, ...rest}, ref) {
    return (
      <BaseTooltip.Viewport
        {...rest}
        ref={ref}
        className={mergeClassName('', className)}
        data-component="Tooltip.Viewport"
      />
    )
  },
)

export const Tooltip = Object.assign(Root, {
  Root,
  Trigger,
  Content,
  Popup,
  Positioner,
  Portal,
  Provider: BaseTooltip.Provider,
  Arrow,
  Viewport,
})
;(Tooltip as {displayName?: string}).displayName = 'Tooltip'
