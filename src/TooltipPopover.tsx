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
    padding-bottom: 10px;
    border: none;
    overflow: hidden;
    margin: 0;
    position: fixed;
    background: transparent;
    top: 0;
    left: 0;
    display: none;

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
      margin-bottom: 7px;
    }

    &::after {
      position: absolute;
      content: '';
      right: 50%;
      margin-right: -6px;
      top: 75%;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-top-color: black;
    }

    ${sx}
  }
`

type TooltipProps = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  noDelay?: boolean
  align?: 'left' | 'right'
  wrap?: boolean
} & ComponentProps<typeof TooltipBase>

const TooltipPopover = ({
  direction = 'n',
  children,
  className,
  noDelay,
  align,
  wrap,
  popover = 'auto',
  ...rest
}: TooltipProps) => {
  if (!isSupported()) {
    apply()
  }

  const classes = classNames(
    className,
    `tooltipped-${direction}`,
    align && `tooltipped-align-${align}-2`,
    noDelay && 'tooltipped-no-delay',
    wrap && 'tooltipped-multiline',
  )

  const popoverRef = React.useRef<HTMLElement>(null)

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    const anchored = popoverRef.current
    if (anchored !== null) {
      anchored.showPopover()
      const anchor = event.currentTarget as HTMLElement
      const {top, left, width} = anchor.getBoundingClientRect()
      anchored.style.setProperty('top', `${top - anchored.clientHeight}px`)
      anchored.style.setProperty('left', `${left - anchored.clientWidth / 2 + width / 2}px`)
    }
  }

  const handlePointerLeave = () => {
    popoverRef.current !== null && popoverRef.current.hidePopover()
  }

  return (
    <>
      <span style={{display: 'inline-block'}} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
        {children}
      </span>
      <TooltipBase ref={popoverRef} popover={popover} className={classes} {...rest} />
    </>
  )
}

export default TooltipPopover
