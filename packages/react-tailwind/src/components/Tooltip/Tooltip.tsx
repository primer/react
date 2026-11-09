'use client'

import {Tooltip as BaseTooltip} from '@base-ui/react/tooltip'
import React from 'react'
import {cn} from '../../internal/cn'
import {FloatingArrowGraphic, floatingArrowClassName} from '../../internal/floatingArrow'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {joinIdRefs} from '../../internal/idRefs'
import {mergeClassName} from '../../internal/mergeClassName'
import {mergeRefs} from '../../internal/refs'
import {mergeRenderDescription} from '../../internal/renderDescription'
import type {FloatingContentProps} from '../../utils/types'
import {KeybindingHint} from '../KeybindingHint/KeybindingHint'
import {getAccessibleKeybindingHintString, usePlatform} from '../KeybindingHint/utils'
import {VisuallyHidden} from '../VisuallyHidden'
import {useFloatingPortalContainer} from '../../internal/portalRoot'
import {
  TooltipContext,
  TooltipProviderContext,
  tooltipDelayMs,
  type TooltipDelay,
  type TooltipType,
} from './TooltipContext'

export type {TooltipDelay, TooltipType} from './TooltipContext'

const popupClassName =
  'primer:w-max primer:max-w-[250px] primer:overflow-visible primer:text-balance primer:wrap-break-word primer:rounded-md primer:bg-[var(--tooltip-bgColor)] primer:px-2 primer:py-1 primer:text-center primer:text-xs primer:text-[var(--tooltip-fgColor)] primer:outline-none primer:[-webkit-font-smoothing:subpixel-antialiased] primer:forced-colors:outline primer:forced-colors:outline-transparent primer:data-[closed]:hidden primer:data-[starting-style]:opacity-0 primer:data-[ending-style]:opacity-0 primer:motion-safe:transition primer:motion-safe:duration-100 primer:motion-safe:ease-in primer:motion-reduce:transition-none'

export interface TooltipRootProps extends BaseTooltip.Root.Props {
  /**
   * Id of the element holding the tooltip text, so other elements can reference it from `aria-labelledby` or
   * `aria-describedby`. Generated when omitted.
   */
  id?: string
  /**
   * How the tooltip relates to its trigger. `description` adds the text to the trigger's accessible description
   * through `aria-describedby`. `label` names the trigger through `aria-labelledby`, for triggers without visible
   * text such as icon-only buttons; an `aria-labelledby` passed to the trigger takes precedence, and an `aria-label`
   * passed to the trigger or its render element is preserved, so the tooltip stays visual.
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
const PopupNameContext = React.createContext<Pick<React.AriaAttributes, 'aria-label' | 'aria-labelledby'>>({})

const Root = ({
  children,
  delay,
  disabled,
  handle,
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
    <TooltipContext.Provider value={{associationId: generatedId, delay, disabled, handle, hints, id, type}}>
      <BaseTooltip.Root {...rest} disabled={disabled} handle={handle}>
        {children}
      </BaseTooltip.Root>
    </TooltipContext.Provider>
  )
}

export type TooltipTriggerProps = Omit<BaseTooltip.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(function TooltipTrigger(
  {className, 'aria-describedby': describedBy, 'aria-labelledby': labelledBy, delay, handle, render, ...rest},
  ref,
) {
  const tooltip = React.useContext(TooltipContext)
  const hasProvider = React.useContext(TooltipProviderContext)
  const namedDelay = tooltip?.delay ?? (hasProvider ? undefined : 'short')
  // A disabled tooltip never shows, so it neither names nor describes the trigger.
  const wired = tooltip?.disabled ? undefined : tooltip
  const associationId = !handle || handle === wired?.handle ? wired?.associationId : undefined
  const renderedAria = React.isValidElement<React.AriaAttributes>(render) ? render.props : undefined
  const label = renderedAria && 'aria-label' in renderedAria ? renderedAria['aria-label'] : rest['aria-label']
  const hasOwnLabel = Boolean(label?.trim())
  const suppliedLabel = wired?.type === 'label' && !labelledBy?.trim() ? undefined : labelledBy
  const descriptionId =
    wired?.type === 'description'
      ? wired.id
      : wired && wired.hints.length > 0
        ? `${wired.id}-keybinding-hint`
        : undefined
  const description = joinIdRefs(describedBy, descriptionId)
  const fallbackLabel = suppliedLabel === undefined && wired?.type === 'label' ? wired.id : undefined
  const generatedLabel = hasOwnLabel ? undefined : fallbackLabel
  let resolvedRender = mergeRenderDescription(render, description)
  // A callback's own label takes precedence over a generated reference, not an explicit trigger reference.
  const resolveRenderedName = (element: React.ReactElement, fromCallback: boolean) => {
    if (!React.isValidElement<React.AriaAttributes>(element) || !fallbackLabel) return element
    const renderedLabel = element.props['aria-label']
    const renderedLabelledBy = element.props['aria-labelledby']
    const hasRenderedLabel = Boolean(renderedLabel?.trim())
    if (fromCallback && generatedLabel && hasRenderedLabel && renderedLabelledBy === generatedLabel) {
      return React.cloneElement(element, {'aria-labelledby': undefined})
    }
    if (
      !hasRenderedLabel &&
      ((typeof renderedLabelledBy === 'string' && !renderedLabelledBy.trim()) ||
        (fromCallback && hasOwnLabel && renderedLabel !== undefined && renderedLabelledBy === undefined))
    ) {
      return React.cloneElement(element, {'aria-labelledby': fallbackLabel})
    }
    return element
  }
  if (typeof resolvedRender === 'function' && fallbackLabel) {
    const renderCallback = resolvedRender
    resolvedRender = (props, state) => resolveRenderedName(renderCallback(props, state), true)
  } else if (React.isValidElement(resolvedRender) && fallbackLabel) {
    resolvedRender = resolveRenderedName(resolvedRender, false)
  }
  return (
    <BaseTooltip.Trigger
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      aria-describedby={description}
      aria-labelledby={suppliedLabel ?? generatedLabel}
      handle={handle}
      delay={delay ?? (namedDelay ? tooltipDelayMs[namedDelay] : undefined)}
      className={mergeClassName('', className)}
      data-component="Tooltip.Trigger"
      data-tooltip-trigger={associationId}
      render={resolvedRender}
    />
  )
})

export type TooltipPopupProps = Omit<BaseTooltip.Popup.Props, 'data-component'>

const Popup = React.forwardRef<HTMLDivElement, TooltipPopupProps>(function TooltipPopup(
  {className, 'aria-hidden': ariaHidden = true, ...rest},
  ref,
) {
  const marker = React.useContext(PopupMarkerContext)
  const tooltip = React.useContext(TooltipContext)
  return (
    <BaseTooltip.Popup
      {...rest}
      ref={ref}
      aria-hidden={ariaHidden}
      className={mergeClassName(popupClassName, className)}
      data-component={marker}
      data-tooltip-popup={tooltip?.associationId}
    />
  )
})

export interface TooltipContentProps extends TooltipPopupProps, FloatingContentProps {
  /**
   * Keeps the visual popup in the DOM while closed after it mounts. Defaults to `true` unless the tooltip is disabled.
   * The text target referenced by the trigger is rendered separately, including on the server.
   */
  keepMounted?: boolean
  /**
   * Portal destination. Defaults to the nearest `Portal.Provider` container, then the shared portal root. Pass
   * `null` to wait for a container; ignored when `portal` is false.
   */
  container?: BaseTooltip.Portal.Props['container']
}

function getNamedShortcutDescription(name: Pick<React.AriaAttributes, 'aria-label' | 'aria-labelledby'>, hint: string) {
  const label = name['aria-label']?.trim()
  return label && !name['aria-labelledby']?.trim() ? `${label} ${hint}` : undefined
}

const KeybindingHintContent = ({
  children,
  hintId,
  hints,
  labelId,
  textId,
}: {
  children: React.ReactNode
  hintId?: string
  hints: string[]
  labelId?: string
  textId?: string
}) => {
  const platform = usePlatform()
  const popupName = React.useContext(PopupNameContext)
  const accessibleHint = `(${hints.map(hint => getAccessibleKeybindingHintString(hint, platform)).join(' or ')})`
  const descriptionName = textId ? getNamedShortcutDescription(popupName, accessibleHint) : undefined
  return (
    <>
      <span id={textId} aria-label={descriptionName} role={descriptionName ? 'group' : undefined}>
        {/* The shortcut is outside this text target so it does not become part of a label. */}
        <span
          {...(descriptionName ? {} : popupName)}
          id={labelId}
          role={
            !descriptionName && (popupName['aria-label'] !== undefined || popupName['aria-labelledby'] !== undefined)
              ? 'group'
              : undefined
          }
        >
          {children}
        </span>{' '}
        <span className="primer:sr-only" id={hintId}>
          {accessibleHint}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="primer:inline-flex primer:items-center primer:gap-1 primer:whitespace-nowrap primer:[&:not(:first-child)]:ml-1"
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

function getTooltipReferenceText(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTooltipReferenceText).filter(Boolean).join(' ')
  if (!React.isValidElement<{children?: React.ReactNode; 'aria-hidden'?: boolean; 'aria-label'?: string}>(children))
    return ''
  if (children.props['aria-hidden']) return ''
  if (children.props['aria-label']?.trim()) return children.props['aria-label']
  return getTooltipReferenceText(children.props.children)
}

const Content = React.forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  {
    align = 'center',
    alignOffset,
    anchor,
    children,
    className,
    container,
    keepMounted,
    portal = true,
    positionerClassName,
    render,
    side = 'bottom',
    sideOffset = 4,
    ...rest
  },
  ref,
) {
  const tooltip = React.useContext(TooltipContext)
  const isLabel = tooltip?.type === 'label'
  const hints = tooltip?.hints ?? []
  const [popupMounted, setPopupMounted] = React.useState(false)
  const platform = usePlatform()
  const accessibleHint = `(${hints.map(hint => getAccessibleKeybindingHintString(hint, platform)).join(' or ')})`
  const referenceText = getTooltipReferenceText(children)
  const popupRef = React.useMemo(() => mergeRefs(ref, node => setPopupMounted(node !== null)), [ref])
  const renderedAria = React.isValidElement<React.AriaAttributes>(render) ? render.props : undefined
  const popupName = {
    'aria-label': renderedAria && 'aria-label' in renderedAria ? renderedAria['aria-label'] : rest['aria-label'],
    'aria-labelledby':
      renderedAria && 'aria-labelledby' in renderedAria ? renderedAria['aria-labelledby'] : rest['aria-labelledby'],
  }
  const referenceName = {
    'aria-label': popupName['aria-label']?.trim() ? popupName['aria-label'] : undefined,
    'aria-labelledby': popupName['aria-labelledby']?.trim() ? popupName['aria-labelledby'] : undefined,
  }
  const referenceDescriptionName =
    !isLabel && hints.length > 0 ? getNamedShortcutDescription(referenceName, accessibleHint) : undefined
  const resolvedRender: TooltipPopupProps['render'] =
    typeof render === 'function' && hints.length > 0
      ? (props, state) => {
          const element = render(props, state)
          const aria = React.isValidElement<React.AriaAttributes>(element) ? element.props : undefined
          return (
            <PopupNameContext.Provider
              value={{'aria-label': aria?.['aria-label'], 'aria-labelledby': aria?.['aria-labelledby']}}
            >
              {element}
            </PopupNameContext.Provider>
          )
        }
      : render
  const referenceTarget =
    tooltip && !tooltip.disabled && !popupMounted ? (
      <VisuallyHidden>
        {hints.length > 0 && isLabel ? (
          <>
            <span
              {...referenceName}
              id={tooltip.id}
              role={
                referenceName['aria-label'] !== undefined || referenceName['aria-labelledby'] !== undefined
                  ? 'group'
                  : undefined
              }
            >
              {referenceText}
            </span>
            <span className="primer:sr-only" id={`${tooltip.id}-keybinding-hint`}>
              {accessibleHint}
            </span>
          </>
        ) : (
          <span
            id={tooltip.id}
            {...(hints.length > 0 ? {'aria-label': referenceDescriptionName} : referenceName)}
            role={referenceDescriptionName ? 'group' : undefined}
          >
            {hints.length > 0 ? (
              <>
                <span
                  {...(referenceDescriptionName ? {} : referenceName)}
                  role={
                    !referenceDescriptionName &&
                    (referenceName['aria-label'] !== undefined || referenceName['aria-labelledby'] !== undefined)
                      ? 'group'
                      : undefined
                  }
                >
                  {referenceText}
                </span>{' '}
                <span className="primer:sr-only">{accessibleHint}</span>
              </>
            ) : (
              referenceText
            )}
          </span>
        )}
      </VisuallyHidden>
    ) : null
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
          ref={popupRef}
          id={popupMounted && hints.length === 0 ? tooltip?.id : undefined}
          aria-hidden="true"
          className={className}
          render={resolvedRender}
        >
          {hints.length > 0 ? (
            <KeybindingHintContent
              hintId={popupMounted && isLabel ? `${tooltip.id}-keybinding-hint` : undefined}
              hints={hints}
              labelId={popupMounted && isLabel ? tooltip.id : undefined}
              textId={popupMounted && !isLabel ? tooltip?.id : undefined}
            >
              {children}
            </KeybindingHintContent>
          ) : (
            children
          )}
        </Popup>
      </Positioner>
    </PopupMarkerContext.Provider>
  )
  return (
    <PopupNameContext.Provider value={popupName}>
      {referenceTarget}
      <FloatingPortal
        container={container}
        keepMounted={keepMounted ?? !tooltip?.disabled}
        part={Portal}
        portal={portal}
      >
        {content}
      </FloatingPortal>
    </PopupNameContext.Provider>
  )
})

const Positioner = React.forwardRef<HTMLDivElement, Omit<BaseTooltip.Positioner.Props, 'data-component'>>(
  function TooltipPositioner({className, ...rest}, ref) {
    return (
      <BaseTooltip.Positioner
        {...rest}
        ref={ref}
        className={mergeClassName('primer:z-popover', className)}
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
  const portalContainer = useFloatingPortalContainer(container)
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
          'primer:[--arrow-bg-color:var(--tooltip-bgColor)] primer:[--arrow-border-color:var(--tooltip-bgColor)]',
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
