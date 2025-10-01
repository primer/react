import {clsx} from 'clsx'
import React, {useMemo} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import type {ComponentProps} from '../utils/types'
import {useId} from '../hooks'

/* Tooltip v1 */

const TooltipBase = styled.span`
  position: relative;
  display: inline-block;

  &::after {
    position: absolute;
    z-index: 1000000;
    display: none;
    padding: 0.5em 0.75em;
    font: normal normal 11px/1.5 ${get('fonts.normal')};
    -webkit-font-smoothing: subpixel-antialiased;
    color: var(--tooltip-fgColor, ${get('colors.fg.onEmphasis')});
    text-align: center;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: break-word;
    white-space: pre;
    pointer-events: none;
    content: attr(aria-label);
    background: var(--tooltip-bgColor, ${get('colors.neutral.emphasisPlus')});
    border-radius: ${get('radii.2')};
    opacity: 0;
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

  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    &::after {
      display: inline-block;
      text-decoration: none;
      animation-name: tooltip-appear;
      animation-duration: 0.1s;
      animation-fill-mode: forwards;
      animation-timing-function: ease-in;
      animation-delay: 0s;
    }
  }

  &.tooltipped-no-delay:hover,
  &.tooltipped-no-delay:active,
  &.tooltipped-no-delay:focus,
  &.tooltipped-no-delay:focus-within {
    &::after {
      animation-delay: 0s;
    }
  }

  &.tooltipped-multiline:hover,
  &.tooltipped-multiline:active,
  &.tooltipped-multiline:focus,
  &.tooltipped-multiline:focus-within {
    &::after {
      display: table-cell;
    }
  }

  // Tooltipped south
  &.tooltipped-s,
  &.tooltipped-se,
  &.tooltipped-sw {
    &::after {
      top: 100%;
      right: 50%;
      margin-top: 6px;
    }
  }

  &.tooltipped-se {
    &::after {
      right: auto;
      left: 50%;
      margin-left: -${get('space.3')};
    }
  }

  &.tooltipped-sw::after {
    margin-right: -${get('space.3')};
  }

  // Tooltips above the object
  &.tooltipped-n,
  &.tooltipped-ne,
  &.tooltipped-nw {
    &::after {
      right: 50%;
      bottom: 100%;
      margin-bottom: 6px;
    }
  }

  &.tooltipped-ne {
    &::after {
      right: auto;
      left: 50%;
      margin-left: -${get('space.3')};
    }
  }

  &.tooltipped-nw::after {
    margin-right: -${get('space.3')};
  }

  // Move the tooltip body to the center of the object.
  &.tooltipped-s::after,
  &.tooltipped-n::after {
    transform: translateX(50%);
  }

  // Tooltipped to the left
  &.tooltipped-w {
    &::after {
      right: 100%;
      bottom: 50%;
      margin-right: 6px;
      transform: translateY(50%);
    }
  }

  // tooltipped to the right
  &.tooltipped-e {
    &::after {
      bottom: 50%;
      left: 100%;
      margin-left: 6px;
      transform: translateY(50%);
    }
  }

  &.tooltipped-multiline {
    &::after {
      width: max-content;
      max-width: 250px;
      word-wrap: break-word;
      white-space: pre-line;
      border-collapse: separate;
    }

    &.tooltipped-s::after,
    &.tooltipped-n::after {
      right: auto;
      left: 50%;
      transform: translateX(-50%);
    }

    &.tooltipped-w::after,
    &.tooltipped-e::after {
      right: 100%;
    }
  }

  &.tooltipped-align-right-2::after {
    right: 0;
    margin-right: 0;
  }

  &.tooltipped-align-left-2::after {
    left: 0;
    margin-left: 0;
  }
`

/**
 * @deprecated
 */
export type TooltipProps = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  noDelay?: boolean
  align?: 'left' | 'right'
  wrap?: boolean
} & ComponentProps<typeof TooltipBase>

export const TooltipContext = React.createContext<{tooltipId?: string}>({})

/**
 * @deprecated
 */
function Tooltip({direction = 'n', children, className, text, noDelay, align, wrap, id, ...rest}: TooltipProps) {
  const tooltipId = useId(id)
  const classes = clsx(
    className,
    `tooltipped-${direction}`,
    align && `tooltipped-align-${align}-2`,
    noDelay && 'tooltipped-no-delay',
    wrap && 'tooltipped-multiline',
  )

  const value = useMemo(() => ({tooltipId}), [tooltipId])
  return (
    // This provider is used to check if an icon button is wrapped with tooltip or not.
    <TooltipContext.Provider value={value}>
      <TooltipBase role="tooltip" aria-label={text} id={tooltipId} {...rest} className={classes}>
        {children}
      </TooltipBase>
    </TooltipContext.Provider>
  )
}

Tooltip.alignments = ['left', 'right']

Tooltip.directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

Tooltip.displayName = 'Tooltip'

export default Tooltip
