'use client'

import {Tooltip as BaseTooltip} from '@base-ui/react/tooltip'
import React from 'react'
import {cn} from '../../internal/cn'
import {FloatingArrowGraphic, floatingArrowClassName} from '../../internal/floatingArrow'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {joinIdRefs} from '../../internal/idRefs'
import {mergeClassName} from '../../internal/mergeClassName'
import type {FloatingContentProps} from '../../utils/types'
import {KeybindingHint} from '../KeybindingHint/KeybindingHint'
import {getAccessibleKeybindingHintString, usePlatform} from '../KeybindingHint/utils'
import {usePortalContainer} from '../../internal/portalRoot'
import {
  TooltipContext,
  TooltipProviderContext,
  tooltipDelayMs,
  type TooltipDelay,
  type TooltipType,
} from './TooltipContext'

export type {TooltipDelay, TooltipType} from './TooltipContext'

const popupClassName =
  'w-max max-w-[250px] overflow-visible text-balance wrap-break-word rounded-md bg-[var(--tooltip-bgColor)] px-2 py-1 text-center text-xs text-[var(--tooltip-fgColor)] outline-none [-webkit-font-smoothing:subpixel-antialiased] forced-colors:outline forced-colors:outline-transparent data-[closed]:hidden data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:transition motion-safe:duration-100 motion-safe:ease-in motion-reduce:transition-none'

export interface TooltipRootProps extends BaseTooltip.Root.Props {
  /**
   * Id of the element holding the tooltip text, so other elements can reference it from `aria-labelledby` or
   * `aria-describedby`. Generated when omitted.
   */
  id?: string
  /**
   * How the tooltip relates to its trigger. `description` adds the text to the trigger's accessible description
   * through `aria-describedby`. `label` names the trigger through `aria-labelledby`, for triggers without visible
   * text such as icon-only buttons; an `aria-labelledby` passed to the trigger takes precedence, and a trigger that
   * already has an `aria-label` keeps it, so the tooltip stays visual.
   * @default 'description'
   */
  type?: TooltipType
  /**
   * Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax,
   * such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
   */
  keybindingHint?: string | string[]
  /**
   * How long the pointer rests on the trigger before the tooltip opens: `short` (50ms), `medium` (400ms) or `long`
   * (1200ms). Keyboard focus opens it straight away. Without a value, the surrounding `Tooltip.Provider` delay
   * applies, falling back to `short`.
   * @default 'short'
   */
  delay?: TooltipDelay
}

const PopupMarkerContext = React.createContext('Tooltip.Popup')

const Root = ({
  children,
  delay,
  disabled,
  id: idProp,
  keybindingHint,
  type = 'description',
  ...rest
}: TooltipRootProps) => {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const hints = (Array.isArray(keybindingHint) ? keybindingHint : [keybindingHint]).filter((hint): hint is string =>
    Boolean(hint),
  )
  return (
    <TooltipContext.Provider value={{delay, disabled, hints, id, type}}>
      <BaseTooltip.Root {...rest} disabled={disabled}>
        {children}
      </BaseTooltip.Root>
    </TooltipContext.Provider>
  )
}

export type TooltipTriggerProps = Omit<BaseTooltip.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(function TooltipTrigger(
  {className, 'aria-describedby': describedBy, 'aria-labelledby': labelledBy, delay, ...rest},
  ref,
) {
  const tooltip = React.useContext(TooltipContext)
  const hasProvider = React.useContext(TooltipProviderContext)
  const namedDelay = tooltip?.delay ?? (hasProvider ? undefined : 'short')
  // A disabled tooltip never shows, so it neither names nor describes the trigger.
  const wired = tooltip?.disabled ? undefined : tooltip
  // A trigger already named by `aria-label` keeps that name rather than gaining a redundant `aria-labelledby`.
  const hasOwnLabel = Boolean(
    rest['aria-label'] ||
      (React.isValidElement<{'aria-label'?: string}>(rest.render) && rest.render.props['aria-label']),
  )
  const descriptionId =
    wired?.type === 'description'
      ? wired.id
      : wired && wired.hints.length > 0
        ? `${wired.id}-keybinding-hint`
        : undefined
  return (
    <BaseTooltip.Trigger
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      aria-describedby={joinIdRefs(describedBy, descriptionId)}
      aria-labelledby={labelledBy ?? (wired?.type === 'label' && !hasOwnLabel ? wired.id : undefined)}
      delay={delay ?? (namedDelay ? tooltipDelayMs[namedDelay] : undefined)}
      className={mergeClassName('', className)}
      data-component="Tooltip.Trigger"
    />
  )
})

export type TooltipPopupProps = Omit<BaseTooltip.Popup.Props, 'data-component'>

const Popup = React.forwardRef<HTMLDivElement, TooltipPopupProps>(function TooltipPopup(
  {className, 'aria-hidden': ariaHidden = true, ...rest},
  ref,
) {
  const marker = React.useContext(PopupMarkerContext)
  return (
    <BaseTooltip.Popup
      {...rest}
      ref={ref}
      aria-hidden={ariaHidden}
      className={mergeClassName(popupClassName, className)}
      data-component={marker}
    />
  )
})

export interface TooltipContentProps extends TooltipPopupProps, FloatingContentProps {
  /**
   * Keeps the popup in the DOM while closed so the trigger's `aria-labelledby` or `aria-describedby` always
   * resolves. Defaults to `true` unless the tooltip is disabled.
   */
  keepMounted?: boolean
}

const KeybindingHintContent = ({
  children,
  hintId,
  hints,
  textId,
}: {
  children: React.ReactNode
  hintId?: string
  hints: string[]
  textId?: string
}) => {
  const platform = usePlatform()
  return (
    <>
      <span id={textId}>
        {children}{' '}
        <span className="sr-only" id={hintId}>
          ({hints.map(hint => getAccessibleKeybindingHintString(hint, platform)).join(' or ')})
        </span>
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
    anchor,
    children,
    className,
    keepMounted,
    portal = true,
    positionerClassName,
    side = 'bottom',
    sideOffset = 4,
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
        anchor={anchor}
        side={side}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <Popup
          {...rest}
          ref={ref}
          id={hints.length > 0 ? undefined : tooltip?.id}
          aria-hidden="true"
          className={className}
        >
          {hints.length > 0 ? (
            // A label names the trigger with its text alone; the hint joins the trigger's description instead.
            <KeybindingHintContent
              hintId={isLabel ? `${tooltip.id}-keybinding-hint` : undefined}
              hints={hints}
              textId={isLabel ? undefined : tooltip?.id}
            >
              {isLabel ? <span id={tooltip.id}>{children}</span> : children}
            </KeybindingHintContent>
          ) : (
            children
          )}
        </Popup>
      </Positioner>
    </PopupMarkerContext.Provider>
  )
  return (
    <FloatingPortal keepMounted={keepMounted ?? !tooltip?.disabled} part={Portal} portal={portal}>
      {content}
    </FloatingPortal>
  )
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

export interface TooltipProviderProps extends Omit<BaseTooltip.Provider.Props, 'delay'> {
  /**
   * Open delay for tooltips in this group that don't set their own `delay`: `short` (50ms), `medium` (400ms) or
   * `long` (1200ms). Once one tooltip in the group is open, adjacent tooltips open without a delay.
   * @default 'short'
   */
  delay?: TooltipDelay
}

function Provider({delay = 'short', ...rest}: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value>
      <BaseTooltip.Provider {...rest} delay={tooltipDelayMs[delay]} />
    </TooltipProviderContext.Provider>
  )
}

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
  Provider,
  Arrow,
  Viewport,
})
;(Tooltip as {displayName?: string}).displayName = 'Tooltip'
