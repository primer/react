import React from 'react'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'
import styled from 'styled-components'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'
import classNames from 'classnames'

interface PopoverProps extends SxProp, React.PropsWithChildren {
  popover: 'auto'
  id: string
  'aria-label': string
}

const TooltipBase = styled('span')
  .withConfig({
    shouldForwardProp: (prop, defaultValidatorFn) => ['popover'].includes(prop) || defaultValidatorFn(prop),
  })
  .attrs<PopoverProps>(props => ({
    popover: props.popover,
    id: props.id,
  }))<PopoverProps>`
  /* Without the triple ampersands, the specificity of these styles are overridden by the base popover styles.
   * https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
   */
  &&& {
    border: none;
    overflow: hidden;
    margin: 0;
    position: fixed;
    background: transparent;
    top: 0;
    left: 0;
    display: none;
    opacity: 0;
    padding: 0;
    --width: 0;
    --height: 0;
    --anchor-width: 0;

    @keyframes tooltip-appear {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    animation-name: tooltip-appear;
    animation-duration: 0.1s;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in;
    animation-delay: 0.4s;

    &.tooltipped-no-delay {
      animation-delay: 0s;
    }

    &.\\:open {
      display: block;
    }

    &:open {
      display: block;
    }

    &::before {
      position: relative;
      padding: 0.5em 0.75em;
      border-radius: ${get('radii.1')};
      font: normal normal 11px/1.5 ${get('fonts.normal')};
      background: ${get('colors.neutral.emphasisPlus')};
      color: ${get('colors.fg.onEmphasis')};
      content: attr(aria-label);
      word-wrap: break-word;
      text-align: center;
      display: block;
    }

    &::after {
      position: absolute;
      content: '';
      right: 50%;
      margin-right: -6px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
    }

    &.tooltipped-n,
    &.tooltipped-ne,
    &.tooltipped-nw {
      padding-bottom: 10px;

      &::after {
        top: calc(var(--height) - 12px);
        border-top-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &.tooltipped-nw {
      &::after {
        right: 0.5em;
      }
    }

    &.tooltipped-ne {
      &::after {
        left: 0.5em;
      }
    }

    &.tooltipped-sw {
      padding-top: 10px;
      &::after {
        right: 0.5em;
        top: 0;
        border-bottom-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &.tooltipped-se {
      padding-top: 10px;
      &::after {
        left: 0.5em;
        top: 0;
        border-bottom-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &.tooltipped-s {
      padding-top: 10px;

      &::after {
        top: 0;
        border-bottom-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &.tooltipped-e {
      padding-left: 10px;

      &:after {
        top: calc(var(--height) / 2 - 5px);
        right: calc(var(--width) - 5px);
        border-right-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &.tooltipped-w {
      padding-right: 10px;
      &::after {
        top: calc(var(--height) / 2 - 5px);
        right: 4px;
        border-left-color: ${get('colors.neutral.emphasisPlus')};
      }
    }

    &.tooltipped-multiline {
      &::before {
        width: max-content;
        max-width: 250px;
        word-wrap: break-word;
        white-space: pre-line;
        border-collapse: separate;
      }
    }
    ${sx}
  }
`

type TooltipProps = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  noDelay?: boolean
  wrap?: boolean
} & ComponentProps<typeof TooltipBase>

const Tooltip = ({direction = 'n', children, className, noDelay, wrap, popover = 'auto', ...rest}: TooltipProps) => {
  if (!isSupported()) {
    apply()
  }

  const classes = classNames(
    className,
    `tooltipped-${direction}`,
    noDelay && 'tooltipped-no-delay',
    wrap && 'tooltipped-multiline',
  )

  const popoverRef = React.useRef<HTMLElement>(null)

  const [showTooltip, setShowTooltip] = React.useState(false)

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    const anchored = popoverRef.current
    if (anchored !== null && !showTooltip) {
      anchored.showPopover()
      anchored.style.setProperty('--width', `${anchored.clientWidth}px`)
      anchored.style.setProperty('--height', `${anchored.clientHeight}px`)

      const anchor = event.currentTarget as HTMLElement
      const {top, left, width, height} = anchor.getBoundingClientRect()
      anchored.style.setProperty('--anchor-width', `${width}px`)
      let [_top, _left] = [0, 0]

      if (direction === 'n' || direction === 'ne' || direction === 'nw') {
        _top = top - anchored.clientHeight
        _left = left - anchored.clientWidth / 2 + width / 2
      }

      if (direction === 's' || direction === 'sw' || direction === 'se') {
        _top = top + anchored.clientHeight / 2
        _left = left - anchored.clientWidth / 2 + width / 2
      }

      if (direction === 'e' || direction === 'w') {
        _top = top - (anchored.clientHeight - height) / 2
      }

      if (direction === 'nw' || direction === 'sw') {
        _left = left + width - anchored.clientWidth
      }

      if (direction === 'w') {
        _left = left - anchored.clientWidth
      }

      if (direction === 'se' || direction === 'ne') {
        _left = left
      }

      if (direction === 'e') {
        _left = left + width
      }

      anchored.style.setProperty('top', `${_top}px`)
      anchored.style.setProperty('left', `${_left}px`)
      setShowTooltip(true)
    }
  }

  const handlePointerLeave = () => {
    const anchored = popoverRef.current
    if (anchored !== null && showTooltip) {
      anchored.hidePopover()
      setShowTooltip(false)
    }
  }

  return (
    <>
      <span
        style={{display: 'inline-block'}}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handlePointerEnter}
        onBlur={handlePointerLeave}
      >
        {children}
      </span>
      <TooltipBase ref={popoverRef} popover={popover} className={classes} {...rest} />
    </>
  )
}

export default Tooltip
