import React, {Children, useEffect, useRef, useState} from 'react'
import Box from '../../Box'
import sx, {SxProp} from '../../sx'
import {useId} from '../../hooks/useId'
import {invariant} from '../../utils/invariant'
import {warning} from '../../utils/warning'
import styled from 'styled-components'
import {get} from '../../constants'
import {ComponentProps} from '../../utils/types'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorSide, AnchorAlignment} from '@primer/behaviors'

declare global {
  interface PopoverToggleTargetElementInvoker {
    popoverTargetElement: HTMLElement | null
    popoverTargetAction: 'toggle' | 'show' | 'hide'
  }
  interface ToggleEvent extends Event {
    oldState: string
    newState: string
  }
  interface HTMLElement {
    popover: 'auto' | 'manual' | null
    showPopover(): void
    hidePopover(): void
    togglePopover(): void
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLButtonElement extends PopoverToggleTargetElementInvoker {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLInputElement extends PopoverToggleTargetElementInvoker {}

  interface Window {
    ToggleEvent: ToggleEvent
  }
}

const StyledTooltip = styled.div`
  // tooltip element itself
  position: relative;
  z-index: 1000000;
  padding: 0.5em 0.75em;
  font: normal normal 11px/1.5 ${get('fonts.normal')};
  -webkit-font-smoothing: subpixel-antialiased;
  color: ${get('colors.fg.onEmphasis')};
  text-align: center;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: break-word;
  white-space: normal;
  background: ${get('colors.neutral.emphasisPlus')};
  border-radius: ${get('radii.2')};
  border: 0;
  width: max-content;
  opacity: 0;
  max-width: 250px;
  inset: auto;
  /* for scrollbar */
  overflow: hidden;
  @media (forced-colors: active) {
    outline: 1px solid transparent;
  }

  /* tooltip element should be rendered visually hidden when it is not opened.  */
  &:not(:popover-open) {
    /* Visually hidden styles */
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  // the caret
  /* &::before {
    position: absolute;
    z-index: 1000001;
    color: ${get('colors.neutral.emphasisPlus')};
    content: '';
    border: 6px solid transparent;
    opacity: 0;
  } */

  // This is needed to keep the tooltip open when the user leaves the trigger element to hover tooltip
  &::after {
    position: absolute;
    display: block;
    right: 0;
    left: 0;
    height: 12px;
    content: '';
  }

  // delay animation for tooltip
  @keyframes tooltip-appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* South, East, Southeast, Southwest before */

  &:popover-open[data-direction='n']::before,
  &[data-direction='ne']::before,
  &[data-direction='nw']::before {
    top: 82%;
    border-top-color: ${get('colors.neutral.emphasisPlus')};
  }
  &[data-direction='s']::before,
  &[data-direction='se']::before,
  &[data-direction='sw']::before {
    bottom: 100%;
    border-bottom-color: ${get('colors.neutral.emphasisPlus')};
  }
  &[data-direction='n']:before,
  &[data-direction='s']:before {
    right: 50%;
    margin-right: -6px;
  }
  &[data-direction='ne']::before,
  &[data-direction='se']::before {
    left: 0;
    margin-left: 6px;
  }
  &[data-direction='sw']::before,
  &[data-direction='nw']::before {
    right: 0;
    margin-right: 6px;
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
  /* West before and after */
  &[data-direction='w']::before {
    top: 50%;
    bottom: 50%;
    left: 100%;
    margin-top: -6px;
    border-left-color: ${get('colors.neutral.emphasisPlus')};
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
  &[data-direction='e']::before {
    top: 50%;
    bottom: 50%;
    right: 100%;
    margin-top: -6px;
    border-right-color: ${get('colors.neutral.emphasisPlus')};
  }

  /* Animation styles */

  &:popover-open,
  &:popover-open::before {
    animation-name: tooltip-appear;
    animation-duration: 0.1s;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in;
    animation-delay: 0.4s;
  }

  /* Position of the tooltip element when it is opened. */

  &:popover-open {
    &[data-no-delay='true'],
    &[data-no-delay='true']::before {
      animation-delay: 0s;
    }
  }

  ${sx};
`

type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export type TooltipProps = React.PropsWithChildren<
  {
    direction?: TooltipDirection
    text?: string
    noDelay?: boolean
    type?: 'label' | 'description'
  } & SxProp &
    ComponentProps<typeof StyledTooltip>
>

export type TriggerPropsType = {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  'aria-label'?: string
  onBlur?: React.FocusEventHandler
  onFocus?: React.FocusEventHandler
  onMouseEnter?: React.MouseEventHandler
  ref?: React.RefObject<HTMLElement>
}

// map tooltip direction to anchoredPosition props
const directionToPosition: Record<TooltipDirection, {side: AnchorSide; align: AnchorAlignment}> = {
  nw: {side: 'outside-top', align: 'start'},
  n: {side: 'outside-top', align: 'center'},
  ne: {side: 'outside-top', align: 'end'},
  e: {side: 'outside-right', align: 'center'},
  se: {side: 'outside-bottom', align: 'end'},
  s: {side: 'outside-bottom', align: 'center'},
  sw: {side: 'outside-bottom', align: 'start'},
  w: {side: 'outside-left', align: 'center'},
}

// The list is from GitHub's custom-axe-rules https://github.com/github/github/blob/master/app/assets/modules/github/axe-custom-rules.ts#L3
const interactiveElements = ['a[href]', 'button', 'summary', 'select', 'input:not([type=hidden])', 'textarea']

const isInteractive = (element: HTMLElement) => {
  return (
    interactiveElements.some(selector => element.matches(selector)) ||
    (element.hasAttribute('role') && element.getAttribute('role') === 'button')
  )
}
export const Tooltip = ({
  direction = 'n',
  // tooltip text
  text,
  type = 'description',
  noDelay,
  children,
  ...rest
}: TooltipProps) => {
  const id = useId()
  const triggerRef = useRef<HTMLElement>(null)
  const tooltipElRef = useRef<HTMLDivElement>(null)
  const child = Children.only(children)
  const [open, setOpen] = useState(false)

  // we need this check for every render
  if (__DEV__) {
    // We don't want these warnings to show up on tests because it fails the tests (at dotcom) due to not extecting a warning.
    // TODO: We can remove the test check when we update these warnings to invariants.
    // Practically, this is not a conditional hook, it is just making sure this hook runs only on DEV not PROD.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (triggerRef.current) {
        // Has trigger element or any of its children interactive elements?
        const isTriggerInteractive = isInteractive(triggerRef.current)
        const triggerChildren = triggerRef.current.childNodes
        const hasInteractiveChild = Array.from(triggerChildren).some(child => {
          return child instanceof HTMLElement && isInteractive(child)
        })
        invariant(
          isTriggerInteractive || hasInteractiveChild,
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
      }
    })
  }

  // Opting in using useOnEscapePress hook instead of onKeydown event to be able to close the tooltip when the mouse is hovering on the trigger element
  // useOnEscapePress(
  //   (e: KeyboardEvent) => {
  //     if (open) {
  //       e.stopPropagation()
  //       setOpen(false)
  //     }
  //   },
  //   [open],
  // )

  const openTooltip = () => {
    if (tooltipElRef.current && triggerRef.current && !tooltipElRef.current.matches(':popover-open')) {
      //
      tooltipElRef.current.showPopover()
      setOpen(true)
    }
  }

  // const position = {top, left}

  useEffect(() => {
    if (!tooltipElRef.current || !triggerRef.current) return
    const tooltip = tooltipElRef.current
    const trigger = triggerRef.current
    tooltip.setAttribute('popover', 'auto')
    // if (!open) return
    const settings = {
      side: directionToPosition[direction].side,
      align: directionToPosition[direction].align,
      // alignmentOffset: 10,
      // anchorOffset: -2,
    }

    const positionSet = () => {
      const {top, left} = getAnchoredPosition(tooltip, trigger, settings)

      tooltip.style.top = `${top}px`
      tooltip.style.left = `${left}px`
      tooltip.setAttribute('data-setting', JSON.stringify(settings))
    }

    tooltip.addEventListener('toggle', positionSet)

    return () => {
      tooltip.removeEventListener('toggle', positionSet)
    }
  }, [tooltipElRef, triggerRef, direction])

  return (
    <Box
      sx={{display: 'inline-block'}}
      onMouseLeave={() => {
        if (tooltipElRef.current?.matches(':popover-open')) tooltipElRef.current.hidePopover()
      }}
    >
      {React.isValidElement(child) &&
        React.cloneElement(child as React.ReactElement<TriggerPropsType>, {
          ref: triggerRef,
          // If it is a type description, we use tooltip to describe the trigger
          'aria-describedby': type === 'description' ? id : undefined,
          // If it is a label type, we use tooltip to label the trigger
          'aria-labelledby': type === 'label' ? id : undefined,
          onBlur: (event: React.FocusEvent) => {
            if (tooltipElRef.current?.matches(':popover-open')) tooltipElRef.current.hidePopover()
            child.props.onBlur?.(event)
          },
          onFocus: (event: React.FocusEvent) => {
            openTooltip()
            // if (!tooltipElRef.current?.matches(':popover-open')) tooltipElRef.current?.showPopover()
            child.props.onFocus?.(event)
          },
          onMouseEnter: (event: React.MouseEvent) => {
            openTooltip()
            child.props.onMouseEnter?.(event)
          },
        })}
      <StyledTooltip
        ref={tooltipElRef}
        data-direction={direction}
        data-state={open ? 'open' : undefined}
        data-no-delay={noDelay}
        {...rest}
        // Only need tooltip role if the tooltip is a description for supplementary information
        role={type === 'description' ? 'tooltip' : undefined}
        // stop AT from announcing the tooltip twice when it is a label type because it will be announced with "aria-labelledby"
        aria-hidden={type === 'label' ? true : undefined}
        id={id}
      >
        {text}
      </StyledTooltip>
    </Box>
  )
}
