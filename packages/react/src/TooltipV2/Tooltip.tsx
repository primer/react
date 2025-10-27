/* eslint-disable primer-react/spread-props-first */
import React, {Children, useEffect, useRef, useState, useMemo, type ForwardRefExoticComponent} from 'react'
import {useId, useProvidedRefOrCreate, useOnEscapePress, useIsMacOS} from '../hooks'
import {invariant} from '../utils/invariant'
import {warning} from '../utils/warning'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorSide, AnchorAlignment} from '@primer/behaviors'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'
import {clsx} from 'clsx'
import classes from './Tooltip.module.css'
import {getAccessibleKeybindingHintString, KeybindingHint, type KeybindingHintProps} from '../KeybindingHint'
import VisuallyHidden from '../_VisuallyHidden'
import useSafeTimeout from '../hooks/useSafeTimeout'
import type {SlotMarker} from '../utils/types'

export type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export type TooltipProps = React.PropsWithChildren<{
  direction?: TooltipDirection
  text: string
  type?: 'label' | 'description'
  keybindingHint?: KeybindingHintProps['keys']
  /**
   * Delay in milliseconds before showing the tooltip
   * @default short (50ms)
   * medium (400ms)
   * long (1200ms)
   */
  delay?: 'short' | 'medium' | 'long'
}> &
  React.HTMLAttributes<HTMLElement>

type TriggerPropsType = Pick<
  React.HTMLAttributes<HTMLElement>,
  | 'aria-describedby'
  | 'aria-labelledby'
  | 'onBlur'
  | 'onTouchEnd'
  | 'onFocus'
  | 'onMouseOverCapture'
  | 'onMouseLeave'
  | 'onTouchCancel'
  | 'onTouchEnd'
> & {
  ref?: React.RefObject<HTMLElement>
}

// map tooltip direction to anchoredPosition props
const directionToPosition: Record<TooltipDirection, {side: AnchorSide; align: AnchorAlignment}> = {
  nw: {side: 'outside-top', align: 'end'},
  n: {side: 'outside-top', align: 'center'},
  ne: {side: 'outside-top', align: 'start'},
  e: {side: 'outside-right', align: 'center'},
  se: {side: 'outside-bottom', align: 'start'},
  s: {side: 'outside-bottom', align: 'center'},
  sw: {side: 'outside-bottom', align: 'end'},
  w: {side: 'outside-left', align: 'center'},
}

// map anchoredPosition props to tooltip direction
const positionToDirection: Record<string, TooltipDirection> = {
  'outside-top-end': 'nw',
  'outside-top-center': 'n',
  'outside-top-start': 'ne',
  'outside-right-center': 'e',
  'outside-bottom-start': 'se',
  'outside-bottom-center': 's',
  'outside-bottom-end': 'sw',
  'outside-left-center': 'w',
}

// The list is from GitHub's custom-axe-rules https://github.com/github/github/blob/master/app/assets/modules/github/axe-custom-rules.ts#L3
const interactiveElements = [
  'a[href]',
  'button:not([disabled])',
  'summary',
  'select',
  'input:not([type=hidden])',
  'textarea',
]

// Map delay prop to actual time in ms
// For context on delay times, see https://github.com/github/primer/issues/3313#issuecomment-3336696699
const delayTimeMap = {
  short: 50,
  medium: 400,
  long: 1200,
}

const isInteractive = (element: HTMLElement) => {
  return (
    interactiveElements.some(selector => element.matches(selector)) ||
    (element.hasAttribute('role') && element.getAttribute('role') === 'button')
  )
}
export const TooltipContext = React.createContext<{tooltipId?: string}>({})

export const Tooltip: ForwardRefExoticComponent<
  React.PropsWithoutRef<TooltipProps> & React.RefAttributes<HTMLElement>
> &
  SlotMarker = React.forwardRef<HTMLElement, TooltipProps>(
  (
    {
      direction = 's',
      text,
      type = 'description',
      children,
      id,
      className,
      keybindingHint,
      delay = 'short',
      ...rest
    }: TooltipProps,
    forwardedRef,
  ) => {
    const tooltipId = useId(id)
    const child = Children.only(children)
    const triggerRef = useProvidedRefOrCreate(forwardedRef as React.RefObject<HTMLElement>)
    const tooltipElRef = useRef<HTMLDivElement>(null)

    const [calculatedDirection, setCalculatedDirection] = useState<TooltipDirection>(direction)

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const openTimeoutRef = React.useRef<number | null>(null)

    const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()

    const openTooltip = () => {
      try {
        if (
          tooltipElRef.current &&
          triggerRef.current &&
          tooltipElRef.current.hasAttribute('popover') &&
          !tooltipElRef.current.matches(':popover-open')
        ) {
          const tooltip = tooltipElRef.current
          const trigger = triggerRef.current
          tooltip.showPopover()
          setIsPopoverOpen(true)
          /*
           * TOOLTIP POSITIONING
           */
          const settings = {
            side: directionToPosition[direction].side,
            align: directionToPosition[direction].align,
          }
          const {top, left, anchorAlign, anchorSide} = getAnchoredPosition(tooltip, trigger, settings)
          // This is required to make sure the popover is positioned correctly i.e. when there is not enough space on the specified direction, we set a new direction to position the ::after
          const calculatedDirection = positionToDirection[`${anchorSide}-${anchorAlign}` as string]
          setCalculatedDirection(calculatedDirection)
          tooltip.style.top = `${top}px`
          tooltip.style.left = `${left}px`
        }
      } catch (error) {
        // older browsers don't support the :popover-open selector and will throw, even though we use a polyfill
        // see https://github.com/github/issues/issues/12468
        if (
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string' &&
          error.message.includes('not a valid selector')
        ) {
          // fail silently
        } else {
          throw error
        }
      }
    }
    const closeTooltip = () => {
      if (openTimeoutRef.current) {
        safeClearTimeout(openTimeoutRef.current)
        openTimeoutRef.current = null
      }
      try {
        if (
          tooltipElRef.current &&
          triggerRef.current &&
          tooltipElRef.current.hasAttribute('popover') &&
          tooltipElRef.current.matches(':popover-open')
        ) {
          tooltipElRef.current.hidePopover()
          setIsPopoverOpen(false)
        } else {
          setIsPopoverOpen(false)
        }
      } catch (error) {
        // older browsers don't support the :popover-open selector and will throw, even though we use a polyfill
        // see https://github.com/github/issues/issues/12468
        if (
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string' &&
          error.message.includes('not a valid selector')
        ) {
          // fail silently
        } else {
          throw error
        }
      }
    }

    // context value
    const value = useMemo(() => ({tooltipId}), [tooltipId])

    useEffect(() => {
      if (!tooltipElRef.current || !triggerRef.current) return
      /*
       * ACCESSIBILITY CHECKS
       */
      // Has trigger element or any of its children interactive elements?
      const isTriggerInteractive = isInteractive(triggerRef.current)
      const triggerChildren = triggerRef.current.childNodes
      // two levels deep
      const hasInteractiveDescendant = Array.from(triggerChildren).some(child => {
        return (
          (child instanceof HTMLElement && isInteractive(child)) ||
          Array.from(child.childNodes).some(
            grandChild => grandChild instanceof HTMLElement && isInteractive(grandChild),
          )
        )
      })
      invariant(
        isTriggerInteractive || hasInteractiveDescendant,
        'The `Tooltip` component expects a single React element that contains interactive content. Consider using a `<button>` or equivalent interactive element instead.',
      )
      // If the tooltip is used for labelling the interactive element, the trigger element or any of its children should not have aria-label
      if (type === 'label') {
        const hasAriaLabel = triggerRef.current.hasAttribute('aria-label')
        const hasAriaLabelInChildren = Array.from(triggerRef.current.childNodes).some(
          child => child instanceof HTMLElement && child.hasAttribute('aria-label'),
        )
        warning(
          hasAriaLabel || hasAriaLabelInChildren,
          'The label type `Tooltip` is going to be used here to label the trigger element. Please remove the aria-label from the trigger element.',
        )
      }

      // SSR safe polyfill apply
      if (typeof window !== 'undefined') {
        if (!isSupported()) {
          apply()
        }
      }

      const tooltip = tooltipElRef.current
      tooltip.setAttribute('popover', 'auto')
    }, [tooltipElRef, triggerRef, direction, type])

    useOnEscapePress(
      (event: KeyboardEvent) => {
        if (isPopoverOpen) {
          event.stopImmediatePropagation()
          event.preventDefault()
          closeTooltip()
        }
      },
      [isPopoverOpen],
    )

    const isMacOS = useIsMacOS()
    const hasAriaLabel = 'aria-label' in rest

    return (
      <TooltipContext.Provider value={value}>
        <>
          {React.isValidElement(child) &&
            React.cloneElement(child as React.ReactElement<TriggerPropsType>, {
              ref: triggerRef,
              // If it is a type description, we use tooltip to describe the trigger
              'aria-describedby': (() => {
                // If tooltip is not a description type, keep the original aria-describedby
                if (type !== 'description') {
                  return child.props['aria-describedby']
                }

                // If tooltip is a description type, append our tooltipId
                const existingDescribedBy = child.props['aria-describedby']
                if (existingDescribedBy) {
                  return `${existingDescribedBy} ${tooltipId}`
                }

                // If no existing aria-describedby, use our tooltipId
                return tooltipId
              })(),
              // If it is a label type, we use tooltip to label the trigger
              'aria-labelledby': type === 'label' ? tooltipId : child.props['aria-labelledby'],
              onBlur: (event: React.FocusEvent) => {
                closeTooltip()
                child.props.onBlur?.(event)
              },
              onTouchEnd: (event: React.TouchEvent) => {
                child.props.onTouchEnd?.(event)

                // Hide tooltips on tap to essentially disable them on touch devices;
                // this still allows viewing the tooltip on tap-and-hold
                safeSetTimeout(() => closeTooltip(), 10)
              },
              onFocus: (event: React.FocusEvent) => {
                // only show tooltip on :focus-visible, not on :focus
                try {
                  if (!event.target.matches(':focus-visible')) return
                } catch (_error) {
                  // jsdom (jest) does not support `:focus-visible` yet and would throw an error
                  // https://github.com/jsdom/jsdom/issues/3426
                }

                openTooltip()
                child.props.onFocus?.(event)
              },
              onMouseOverCapture: (event: React.MouseEvent) => {
                const delayTime = delayTimeMap[delay] || 50
                // We use a `capture` event to ensure this is called first before
                // events that might cancel the opening timeout (like `onTouchEnd`)
                // show tooltip after mouse has been hovering for the specified delay time
                // (prevent showing tooltip when mouse is just passing through)
                openTimeoutRef.current = safeSetTimeout(() => {
                  // if the mouse is already moved out, do not show the tooltip
                  if (!openTimeoutRef.current) return
                  openTooltip()
                  child.props.onMouseEnter?.(event)
                }, delayTime)
              },
              onMouseLeave: (event: React.MouseEvent) => {
                closeTooltip()
                child.props.onMouseLeave?.(event)
              },
            })}
          <span
            className={clsx(className, classes.Tooltip)}
            ref={tooltipElRef}
            data-direction={calculatedDirection}
            {...rest}
            // Only need tooltip role if the tooltip is a description for supplementary information
            role={type === 'description' ? 'tooltip' : undefined}
            // stop AT from announcing the tooltip twice: when it is a label type it will be announced with "aria-labelledby",when it is a description type it will be announced with "aria-describedby"
            aria-hidden={true}
            // mouse leave and enter on the tooltip itself is needed to keep the tooltip open when the mouse is over the tooltip
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            // If there is an aria-label prop, always assign the ID to the parent so the accessible label can be overridden
            id={hasAriaLabel || !keybindingHint ? tooltipId : undefined}
          >
            {keybindingHint ? (
              <>
                <span id={hasAriaLabel ? undefined : tooltipId}>
                  {text}
                  {/* There is a bug in Chrome browsers where `aria-hidden` text inside the target of an `aria-labelledby`
               still gets included in the accessible label. `KeybindingHint` renders the symbols as `aria-hidden` text
               and renders full key names as `VisuallyHidden` text. Due to the browser bug this causes the label text
               to duplicate the symbols and key names. To work around this, we exclude the hint from being part of the
               label and instead render the plain keybinding description string. */}
                  <VisuallyHidden>({getAccessibleKeybindingHintString(keybindingHint, isMacOS)})</VisuallyHidden>
                </span>
                <span className={clsx(classes.KeybindingHintContainer, text && classes.HasTextBefore)} aria-hidden>
                  <KeybindingHint keys={keybindingHint} format="condensed" variant="onEmphasis" size="small" />
                </span>
              </>
            ) : (
              text
            )}
          </span>
        </>
      </TooltipContext.Provider>
    )
  },
)

Tooltip.__SLOT__ = Symbol('Tooltip')
