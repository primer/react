import React, {Children, useEffect, useRef, useState, useMemo} from 'react'
import type {SxProp} from '../sx'
import sx from '../sx'
import {useId, useProvidedRefOrCreate, useOnEscapePress} from '../hooks'
import {invariant} from '../utils/invariant'
import {warning} from '../utils/warning'
import styled from 'styled-components'
import {get} from '../constants'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorSide, AnchorAlignment} from '@primer/behaviors'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {clsx} from 'clsx'
import classes from './Tooltip.module.css'
import {useFeatureFlag} from '../FeatureFlags'
import {KeybindingHint, type KeybindingHintProps} from '../KeybindingHint'
import VisuallyHidden from '../_VisuallyHidden'
import useSafeTimeout from '../hooks/useSafeTimeout'

const CSS_MODULE_FEATURE_FLAG = 'primer_react_css_modules_ga'

const animationStyles = `
  animation-name: tooltip-appear;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
  animation-delay: 0s;
`

const StyledTooltip = toggleStyledComponent(
  CSS_MODULE_FEATURE_FLAG,
  'span',
  styled.span`
    /* Overriding the default popover styles */
    display: none;
    &[popover] {
      position: absolute;
      padding: 0.5em 0.75em;
      width: max-content;
      margin: auto;
      clip: auto;
      white-space: normal;
      font: normal normal 11px/1.5 ${get('fonts.normal')};
      -webkit-font-smoothing: subpixel-antialiased;
      color: var(--tooltip-fgColor, ${get('colors.fg.onEmphasis')});
      text-align: center;
      word-wrap: break-word;
      background: var(--tooltip-bgColor, ${get('colors.neutral.emphasisPlus')});
      border-radius: ${get('radii.2')};
      border: 0;
      opacity: 0;
      max-width: 250px;
      inset: auto;
      /* for scrollbar */
      overflow: visible;
    }
    /* class name in chrome is :popover-open */
    &[popover]:popover-open {
      display: block;
    }
    /* class name in firefox and safari is \:popover-open */
    &[popover].\\:popover-open {
      display: block;
    }

    @media (forced-colors: active) {
      outline: 1px solid transparent;
    }

    // This is needed to keep the tooltip open when the user leaves the trigger element to hover tooltip
    &::after {
      position: absolute;
      display: block;
      right: 0;
      left: 0;
      height: var(--overlay-offset, 0.25rem);
      content: '';
    }

    /* South, East, Southeast, Southwest after */
    &[data-direction='n']::after,
    &[data-direction='ne']::after,
    &[data-direction='nw']::after {
      top: 100%;
    }
    &[data-direction='s']::after,
    &[data-direction='se']::after,
    &[data-direction='sw']::after {
      bottom: 100%;
    }

    &[data-direction='w']::after {
      position: absolute;
      display: block;
      height: 100%;
      width: 8px;
      content: '';
      bottom: 0;
      left: 100%;
    }
    /* East before and after */
    &[data-direction='e']::after {
      position: absolute;
      display: block;
      height: 100%;
      width: 8px;
      content: '';
      bottom: 0;
      right: 100%;
      margin-left: -8px;
    }

    /* Animation definition */
    @keyframes tooltip-appear {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    /* Animation styles */
    &:popover-open,
    &:popover-open::before {
      ${animationStyles}
    }

    /* Animation styles */
    &.\\:popover-open,
    &.\\:popover-open::before {
      ${animationStyles}
    }

    ${sx};
  `,
)

export type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export type TooltipProps = React.PropsWithChildren<
  {
    direction?: TooltipDirection
    text: string
    type?: 'label' | 'description'
    keybindingHint?: KeybindingHintProps['keys']
  } & SxProp
> &
  React.HTMLAttributes<HTMLElement>

type TriggerPropsType = {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  'aria-label'?: string
  onBlur?: React.FocusEventHandler
  onFocus?: React.FocusEventHandler
  onMouseEnter?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
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

const isInteractive = (element: HTMLElement) => {
  return (
    interactiveElements.some(selector => element.matches(selector)) ||
    (element.hasAttribute('role') && element.getAttribute('role') === 'button')
  )
}
export const TooltipContext = React.createContext<{tooltipId?: string}>({})

export const Tooltip = React.forwardRef(
  (
    {direction = 's', text, type = 'description', children, id, className, keybindingHint, ...rest}: TooltipProps,
    forwardedRef,
  ) => {
    const tooltipId = useId(id)
    const child = Children.only(children)
    const triggerRef = useProvidedRefOrCreate(forwardedRef as React.RefObject<HTMLElement>)
    const tooltipElRef = useRef<HTMLDivElement>(null)
    const enabled = useFeatureFlag(CSS_MODULE_FEATURE_FLAG)

    const [calculatedDirection, setCalculatedDirection] = useState<TooltipDirection>(direction)

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const timeoutRef = React.useRef<number | null>(null)

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

    return (
      <TooltipContext.Provider value={value}>
        <>
          {React.isValidElement(child) &&
            React.cloneElement(child as React.ReactElement<TriggerPropsType>, {
              ref: triggerRef,
              // If it is a type description, we use tooltip to describe the trigger
              'aria-describedby': type === 'description' ? tooltipId : child.props['aria-describedby'],
              // If it is a label type, we use tooltip to label the trigger
              'aria-labelledby': type === 'label' ? tooltipId : child.props['aria-labelledby'],
              onBlur: (event: React.FocusEvent) => {
                closeTooltip()
                child.props.onBlur?.(event)
              },
              onFocus: (event: React.FocusEvent) => {
                // only show tooltip on :focus-visible, not on :focus
                try {
                  if (!event.target.matches(':focus-visible')) return
                } catch (error) {
                  // jsdom (jest) does not support `:focus-visible` yet and would throw an error
                  // https://github.com/jsdom/jsdom/issues/3426
                }

                openTooltip()
                child.props.onFocus?.(event)
              },
              onMouseEnter: (event: React.MouseEvent) => {
                // show tooltip after mosue has been hovering for at least 50ms
                // (prevent showing tooltip when mouse is just passing through)
                timeoutRef.current = safeSetTimeout(() => {
                  openTooltip()
                  child.props.onMouseEnter?.(event)
                }, 50)
              },
              onMouseLeave: (event: React.MouseEvent) => {
                if (timeoutRef.current) {
                  safeClearTimeout(timeoutRef.current)
                  timeoutRef.current = null
                }
                closeTooltip()
                child.props.onMouseLeave?.(event)
              },
            })}
          <StyledTooltip
            className={clsx(className, {[classes.Tooltip]: enabled})}
            ref={tooltipElRef}
            data-direction={calculatedDirection}
            {...rest}
            // Only need tooltip role if the tooltip is a description for supplementary information
            role={type === 'description' ? 'tooltip' : undefined}
            // stop AT from announcing the tooltip twice: when it is a label type it will be announced with "aria-labelledby",when it is a description type it will be announced with "aria-describedby"
            aria-hidden={true}
            id={tooltipId}
            // mouse leave and enter on the tooltip itself is needed to keep the tooltip open when the mouse is over the tooltip
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
          >
            {text}
            {keybindingHint && (
              <span className={clsx(classes.KeybindingHintContainer, text && classes.HasTextBefore)}>
                <VisuallyHidden>(</VisuallyHidden>
                <KeybindingHint keys={keybindingHint} format="condensed" variant="onEmphasis" size="small" />
                <VisuallyHidden>)</VisuallyHidden>
              </span>
            )}
          </StyledTooltip>
        </>
      </TooltipContext.Provider>
    )
  },
)
