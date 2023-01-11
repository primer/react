import React from 'react'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'
import styled from 'styled-components'
import {get} from './constants'
import sx, {SxProp} from './sx'

interface PopoverProps extends SxProp, React.PropsWithChildren {
  popover: 'auto'
  id: string
}

const TooltipContent = styled('div')
  .withConfig({
    shouldForwardProp: (prop, defaultValidatorFn) => ['popover'].includes(prop) || defaultValidatorFn(prop),
  })
  .attrs<PopoverProps>(props => ({
    popover: props.popover,
    id: props.id,
  }))<PopoverProps>`
  /* Without the triple ampersands, the specificity of these styles are overridden by the base popover styles. */
  &&& {
    position: relative;
    background: ${get('colors.neutral.emphasisPlus')};
    color: ${get('colors.fg.onEmphasis')};
    padding: 0.5em 0.75em;
    margin: 0;
    opacity: 0;
    border-radius: ${get('radii.1')};
    font-size: 11px;

    @keyframes tooltip-appear {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    &.\\:open,
    &:focus,
    &:focus-within {
      &,
      &::before,
      &::after {
        display: block;
        animation-name: tooltip-appear;
        animation-duration: 0.1s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in;
        animation-delay: 0.4s;
      }
    }

    &::before {
      position: absolute;
      width: 0px;
      height: 0px;
      color: ${get('colors.neutral.emphasisPlus')};
      pointer-events: none;
      content: '';
      border: 6px solid transparent;
      opacity: 0;
    }

    &.tooltip-n,
    &.tooltip-ne,
    &.tooltip-nw {
      top: -3rem;

      &::before {
        top: -7px;
        right: 50%;
        bottom: 0;
        margin-right: -6px;
        border-top-color: ${get('colors.neutral.emphasisPlus')}
      }
    }

    &.tooltip-s,
    &.tooltip-se,
    &.tooltip-sw {
      top: 0;
    }

    &.tooltip-e,
    &.tooltip-se,
    &.tooltip-ne {
      left: 2rem;
    }
  }

  ${sx}
`

type TooltipProps = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  'aria-label'?: string
}

const TooltipPopover = ({text, direction = 'n', 'aria-label': ariaLabel}: TooltipProps) => {
  if (!isSupported()) {
    apply()
  }

  const popover = React.useRef(null)

  const handlePointerEnter = () => {
    const content = popover.current
    if (content && !content.classList.contains(':open')) {
      content.showPopover()
    }
  }

  const handlePointerLeave = () => {
    const content = popover.current
    if (content && content.classList.contains(':open')) {
      content.hidePopover()
    }
  }
  return (
    <div aria-label={ariaLabel}>
      <button onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
        Toggle popover
      </button>
      <TooltipContent ref={popover} popover="auto" id="my-first-popover" className={`tooltip-${direction}`}>
        {text}
      </TooltipContent>
    </div>
  )
}

export default TooltipPopover
