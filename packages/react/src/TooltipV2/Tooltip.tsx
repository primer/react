import React, {Children, useEffect, useRef, useState, useMemo, type ForwardRefExoticComponent} from 'react'
import {useId, useOnEscapePress} from '../hooks'
import {useMergedRefs} from '../hooks/useMergedRefs'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {invariant} from '../utils/invariant'
import {warning} from '../utils/warning'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorSide, AnchorAlignment} from '@primer/behaviors'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'
import {clsx} from 'clsx'
import classes from './Tooltip.module.css'
import {getAccessibleKeybindingHintString, KeybindingHint, type KeybindingHintProps} from '../KeybindingHint'
import {usePlatform} from '../KeybindingHint/platform'
import VisuallyHidden from '../_VisuallyHidden'
import useSafeTimeout from '../hooks/useSafeTimeout'
import type {SlotMarker} from '../utils/types'
import {TooltipContext} from './TooltipContext'

export type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export type TooltipProps = React.PropsWithChildren<{
  direction?: TooltipDirection
  text: string
  type?: 'label' | 'description'
  keybindingHint?: KeybindingHintProps['keys'] | Array<KeybindingHintProps['keys']>
  /**
   * Delay in milliseconds before showing the tooltip
   * @default short (50ms)
   * medium (400ms)
   * long (1200ms)
   */
  delay?: 'short' | 'medium' | 'long'
  /**
   * Private API for use internally only. Prevents the tooltip from opening if `true`.
   *
   * Accessibility note: This prop should be used with caution. Only use when needing to
   * programmatically close the tooltip in response to a specific user action, such as
   * opening a menu, or content where the tooltip could overlap with interactive content.
   *
   * @default false
   */
  _privateDisableTooltip?: boolean
}> &
  React.HTMLAttributes<HTMLElement>

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
const emptyKeybindingHints: Array<KeybindingHintProps['keys']> = []

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
      keybindingHint = emptyKeybindingHints,
      delay = 'short',
      _privateDisableTooltip = false,
      ...rest
    }: TooltipProps,
    forwardedRef,
  ) => {
    const tooltipId = useId(id)
    const child = Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>
    const triggerRef = React.useRef<HTMLElement>(null)
    const mergedTriggerRef = useMergedRefs(forwardedRef, triggerRef)
    const tooltipElRef = useRef<HTMLDivElement>(null)

    const [calculatedDirection, setCalculatedDirection] = useState<TooltipDirection>(direction)

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const openTimeoutRef = React.useRef<number | null>(null)

    const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()

    const openTooltip = () => {
      const tooltip = tooltipElRef.current
      const trigger = triggerRef.current
      let isPopoverOpen = false

      try {
        if (tooltip) {
          isPopoverOpen = tooltip.matches(':popover-open')
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

      if (tooltip && trigger && tooltip.hasAttribute('popover') && !isPopoverOpen && !_privateDisableTooltip) {
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
    }
    const closeTooltip = () => {
      if (openTimeoutRef.current) {
        safeClearTimeout(openTimeoutRef.current)
        openTimeoutRef.current = null
      }
      const tooltip = tooltipElRef.current
      const trigger = triggerRef.current
      let isTooltipOpen = false

      try {
        if (tooltip) {
          isTooltipOpen = tooltip.matches(':popover-open')
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

      if (tooltip && trigger && tooltip.hasAttribute('popover') && isTooltipOpen) {
        tooltip.hidePopover()
      }
      setIsPopoverOpen(false)
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
      // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler
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

    const platform = usePlatform()
    const hasAriaLabel = 'aria-label' in rest

    useIsomorphicLayoutEffect(() => {
      const trigger = tooltipElRef.current?.previousElementSibling
      if (!(trigger instanceof HTMLElement)) {
        return
      }

      const cleanup = mergedTriggerRef(trigger)
      const previousAriaDescribedBy = trigger.getAttribute('aria-describedby')
      const previousAriaLabelledBy = trigger.getAttribute('aria-labelledby')

      if (type === 'description') {
        const existingDescribedBy = child.props['aria-describedby']
        trigger.setAttribute(
          'aria-describedby',
          existingDescribedBy ? `${existingDescribedBy} ${tooltipId}` : tooltipId,
        )
      }

      if (type === 'label') {
        trigger.setAttribute('aria-labelledby', tooltipId)
      }

      const onBlur = () => {
        closeTooltip()
      }
      const onTouchEnd = () => {
        safeSetTimeout(() => closeTooltip(), 10)
      }
      const onFocus = (event: FocusEvent) => {
        if (event.target instanceof Element && !event.target.matches(':focus-visible')) return

        openTooltip()
      }
      const onMouseOver = () => {
        const delayTime = delayTimeMap[delay] || 50
        openTimeoutRef.current = safeSetTimeout(() => {
          if (!openTimeoutRef.current) return
          openTooltip()
        }, delayTime)
      }
      const onMouseLeave = () => {
        closeTooltip()
      }
      trigger.addEventListener('blur', onBlur)
      trigger.addEventListener('touchend', onTouchEnd, {passive: true})
      trigger.addEventListener('focus', onFocus)
      trigger.addEventListener('mouseover', onMouseOver, {capture: true})
      trigger.addEventListener('mouseleave', onMouseLeave)

      return () => {
        if (previousAriaDescribedBy === null) {
          trigger.removeAttribute('aria-describedby')
        } else {
          trigger.setAttribute('aria-describedby', previousAriaDescribedBy)
        }

        if (previousAriaLabelledBy === null) {
          trigger.removeAttribute('aria-labelledby')
        } else {
          trigger.setAttribute('aria-labelledby', previousAriaLabelledBy)
        }

        trigger.removeEventListener('blur', onBlur)
        trigger.removeEventListener('touchend', onTouchEnd)
        trigger.removeEventListener('focus', onFocus)
        trigger.removeEventListener('mouseover', onMouseOver, {capture: true})
        trigger.removeEventListener('mouseleave', onMouseLeave)

        if (typeof cleanup === 'function') {
          cleanup()
        } else {
          mergedTriggerRef(null)
        }
      }
    }, [child, closeTooltip, delay, mergedTriggerRef, openTooltip, safeSetTimeout, tooltipId, type])

    // Normalize keybindingHint to an array for uniform rendering
    const keybindingHints = Array.isArray(keybindingHint) ? keybindingHint : [keybindingHint]
    const triggerElement = React.isValidElement(child) ? child : null

    return (
      <TooltipContext.Provider value={value}>
        <>
          {triggerElement}
          <span
            className={clsx(className, classes.Tooltip)}
            ref={tooltipElRef}
            data-direction={calculatedDirection}
            data-component="Tooltip"
            {...rest}
            // Only need tooltip role if the tooltip is a description for supplementary information
            role={type === 'description' ? 'tooltip' : undefined}
            // stop AT from announcing the tooltip twice: when it is a label type it will be announced with "aria-labelledby",when it is a description type it will be announced with "aria-describedby"
            aria-hidden={true}
            // mouse leave and enter on the tooltip itself is needed to keep the tooltip open when the mouse is over the tooltip
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            // If there is an aria-label prop, always assign the ID to the parent so the accessible label can be overridden
            id={hasAriaLabel || keybindingHints.length === 0 ? tooltipId : undefined}
          >
            {keybindingHints.length > 0 ? (
              <>
                <span id={hasAriaLabel ? undefined : tooltipId}>
                  {text}
                  {/* There is a bug in Chrome browsers where `aria-hidden` text inside the target of an `aria-labelledby`
                      still gets included in the accessible label. `KeybindingHint` renders the symbols as `aria-hidden` text
                      and renders full key names as `VisuallyHidden` text. Due to the browser bug this causes the label text
                      to duplicate the symbols and key names. To work around this, we exclude the hint from being part of the
                      label and instead render the plain keybinding description string. */}
                  <VisuallyHidden>
                    ({keybindingHints.map(hint => getAccessibleKeybindingHintString(hint, platform)).join(' or ')})
                  </VisuallyHidden>
                </span>
                <span
                  className={clsx(
                    classes.KeybindingHintContainer,
                    text && classes.HasTextBefore,
                    keybindingHints.length > 1 && classes.HasMultipleHints,
                  )}
                  aria-hidden
                  data-component="Tooltip.KeybindingHintContainer"
                >
                  {keybindingHints.map((hint, i) => (
                    <React.Fragment key={`${i}-${hint}`}>
                      {i > 0 && ' or '}
                      <KeybindingHint keys={hint} format="condensed" variant="onEmphasis" size="small" />
                    </React.Fragment>
                  ))}
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
