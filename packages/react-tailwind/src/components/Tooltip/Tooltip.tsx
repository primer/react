'use client'

import {Tooltip as BaseTooltip} from '@base-ui/react/tooltip'
import React from 'react'
import {cn} from '../../internal/cn'
import {FloatingArrowGraphic, floatingArrowClassName} from '../../internal/floatingArrow'
import {mergeClassName} from '../../internal/mergeClassName'
import type {FloatingContentProps} from '../../utils/types'
import {KeybindingHint} from '../KeybindingHint/KeybindingHint'
import {getAccessibleKeybindingHintString, usePlatform} from '../KeybindingHint/utils'
import {usePortalContainer} from '../../internal/portalRoot'
import {TooltipContext, type TooltipType} from './TooltipContext'

export type {TooltipType} from './TooltipContext'

const popupClassName =
  'w-max max-w-64 overflow-visible text-balance rounded-md bg-[var(--tooltip-bgColor)] px-2 py-1 text-center text-xs text-[var(--tooltip-fgColor)] outline-none contrast-more:outline contrast-more:outline-current data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-100 motion-safe:ease-in motion-reduce:transition-none'

export interface TooltipRootProps extends BaseTooltip.Root.Props {
  /**
   * How the tooltip relates to its trigger. `description` adds supplementary text through `aria-describedby`.
   * `label` repeats the trigger's accessible name visually, so the trigger must already be named, for example
   * with `aria-label`; the tooltip is then hidden from assistive technology.
   * @default 'description'
   */
  type?: TooltipType
  /**
   * Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax,
   * such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
   */
  keybindingHint?: string | string[]
}

const PopupMarkerContext = React.createContext('Tooltip.Popup')

const Root = ({children, keybindingHint, type = 'description', ...rest}: TooltipRootProps) => {
  const id = React.useId()
  const hints = (Array.isArray(keybindingHint) ? keybindingHint : [keybindingHint]).filter((hint): hint is string =>
    Boolean(hint),
  )
  return (
    <TooltipContext.Provider value={{hints, id, type}}>
      <BaseTooltip.Root {...rest}>{children}</BaseTooltip.Root>
    </TooltipContext.Provider>
  )
}

export type TooltipTriggerProps = Omit<BaseTooltip.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(function TooltipTrigger(
  {className, 'aria-describedby': describedBy, ...rest},
  ref,
) {
  const tooltip = React.useContext(TooltipContext)
  const tooltipId =
    tooltip?.type === 'description'
      ? tooltip.id
      : tooltip && tooltip.hints.length > 0
        ? `${tooltip.id}-keybinding-hint`
        : undefined
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

export interface TooltipContentProps extends TooltipPopupProps, FloatingContentProps {
  /**
   * Keeps the popup in the DOM while closed so `aria-describedby` always resolves. Defaults to `true` when the
   * trigger is described by the tooltip: description tooltips, and label tooltips with a keybinding hint.
   */
  keepMounted?: boolean
}

const KeybindingHintContent = ({
  children,
  hintId,
  hints,
}: {
  children: React.ReactNode
  hintId?: string
  hints: string[]
}) => {
  const platform = usePlatform()
  return (
    <>
      {children}{' '}
      <span className="sr-only" id={hintId}>
        ({hints.map(hint => getAccessibleKeybindingHintString(hint, platform)).join(' or ')})
      </span>
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-1 whitespace-nowrap [&:not(:first-child)]:ml-1"
        data-component="Tooltip.KeybindingHintContainer"
      >
        {hints.map((hint, index) => (
          <React.Fragment key={`${index}-${hint}`}>
            {index > 0 && ' or '}
            <KeybindingHint keys={hint} format="condensed" variant="onEmphasis" size="small" />
          </React.Fragment>
        ))}
      </span>
    </>
  )
}

const Content = React.forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  {
    align = 'center',
    alignOffset,
    children,
    className,
    keepMounted,
    portal = true,
    positionerClassName,
    side = 'top',
    sideOffset = 8,
    ...rest
  },
  ref,
) {
  const tooltip = React.useContext(TooltipContext)
  const isLabel = tooltip?.type === 'label'
  const hints = tooltip?.hints ?? []
  const content = (
    <PopupMarkerContext.Provider value="Tooltip.Content">
      <Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <Popup
          {...rest}
          ref={ref}
          id={tooltip?.id}
          role={isLabel ? undefined : 'tooltip'}
          aria-hidden={isLabel || undefined}
          className={className}
        >
          {hints.length > 0 ? (
            <KeybindingHintContent hintId={isLabel ? `${tooltip.id}-keybinding-hint` : undefined} hints={hints}>
              {children}
            </KeybindingHintContent>
          ) : (
            children
          )}
        </Popup>
      </Positioner>
    </PopupMarkerContext.Provider>
  )
  return portal ? <Portal keepMounted={keepMounted ?? (!isLabel || hints.length > 0)}>{content}</Portal> : content
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

function Portal({children, container, ...rest}: BaseTooltip.Portal.Props) {
  const portalContainer = usePortalContainer(container)
  return (
    <BaseTooltip.Portal {...rest} container={portalContainer}>
      {children}
    </BaseTooltip.Portal>
  )
}

const Arrow = React.forwardRef<HTMLDivElement, Omit<BaseTooltip.Arrow.Props, 'data-component'>>(function TooltipArrow(
  {children, className, ...rest},
  ref,
) {
  return (
    <BaseTooltip.Arrow
      {...rest}
      ref={ref}
      className={mergeClassName(
        cn(
          floatingArrowClassName,
          '[--arrow-bg-color:var(--tooltip-bgColor)] [--arrow-border-color:var(--tooltip-bgColor)]',
        ),
        className,
      )}
      data-component="Tooltip.Arrow"
    >
      {children ?? <FloatingArrowGraphic />}
    </BaseTooltip.Arrow>
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
;('use client')
