import {clsx} from 'clsx'
import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Popover.module.css'
import type {HTMLProps} from 'react'
import React from 'react'

type CaretPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right'
  | 'left-bottom'
  | 'left-top'
  | 'right-bottom'
  | 'right-top'

type StyledPopoverProps = {
  /**
   * @deprecated `caret` is deprecated and will be removed in v38.
   */
  caret?: CaretPosition
  relative?: boolean
  open?: boolean
} & SxProp

const CSS_MODULES_FLAG = 'primer_react_css_modules_ga'

const StyledPopover = styled.div.attrs<StyledPopoverProps>(({className, caret = 'top'}) => {
  return {
    className: clsx(className, `caret-pos--${caret}`),
  }
})<StyledPopoverProps>`
  position: ${props => (props.relative ? 'relative' : 'absolute')};
  z-index: 100;
  display: ${props => (props.open ? 'block' : 'none')};
  ${sx};
`

const BaseComponent = toggleStyledComponent(CSS_MODULES_FLAG, 'div', StyledPopover)

export type PopoverProps = {
  /** Class name for custom styling */
  className?: string
} & StyledPopoverProps &
  HTMLProps<HTMLDivElement>

const Popover = React.forwardRef<HTMLElement, PopoverProps>(function Popover(
  {className, caret = 'top', open, relative, ...props},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)
  if (enabled) {
    return (
      <BaseComponent
        {...props}
        ref={forwardRef}
        data-open={open ? '' : undefined}
        data-relative={relative ? '' : undefined}
        data-caret={caret}
        className={clsx(className, classes.Popover)}
      />
    )
  }

  return <BaseComponent {...props} className={className} caret={caret} open={open} relative={relative} />
})
Popover.displayName = 'Popover'

const StyledPopoverContent = toggleStyledComponent(
  CSS_MODULES_FLAG,
  'div',
  styled.div<SxProp>`
    border: 1px solid ${get('colors.border.default')};
    border-radius: ${get('radii.2')};
    position: relative;
    width: 232px;
    margin-right: auto;
    margin-left: auto;
    padding: ${get('space.4')};
    background-color: ${get('colors.canvas.overlay')};

    // Carets
    &::before,
    &::after {
      position: absolute;
      left: 50%;
      display: inline-block;
      content: '';
    }

    &::before {
      top: -${get('space.3')};
      margin-left: -9px;
      border: ${get('space.2')} solid transparent; // TODO: solid?
      border-bottom-color: ${get('colors.border.default')};
    }

    &::after {
      top: -14px;
      margin-left: -${get('space.2')};
      border: 7px solid transparent; // todo: solid
      border-bottom-color: ${get('colors.canvas.overlay')};
    }

    // Bottom-oriented carets
    ${StyledPopover}.caret-pos--bottom & ,
    ${StyledPopover}.caret-pos--bottom-right & ,
    ${StyledPopover}.caret-pos--bottom-left & {
      &::before,
      &::after {
        top: auto;
        border-bottom-color: transparent;
      }

      &::before {
        bottom: -${get('space.3')};
        border-top-color: ${get('colors.border.default')};
      }

      &::after {
        bottom: -14px;
        // stylelint-disable-next-line primer/borders
        border-top-color: ${get('colors.canvas.overlay')};
      }
    }

    // Top & Bottom: Right-oriented carets
    ${StyledPopover}.caret-pos--top-right & ,
    ${StyledPopover}.caret-pos--bottom-right & {
      right: -9px;
      margin-right: 0;

      &::before,
      &::after {
        left: auto;
        margin-left: 0;
      }

      &::before {
        right: 20px;
      }

      &::after {
        right: 21px;
      }
    }

    // Top & Bottom: Left-oriented carets
    ${StyledPopover}.caret-pos--top-left & ,
    ${StyledPopover}.caret-pos--bottom-left & {
      left: -9px;
      margin-left: 0;

      &::before,
      &::after {
        left: ${get('space.4')};
        margin-left: 0;
      }

      &::after {
        left: calc(${get('space.4')} + 1px);
      }
    }

    // Right- & Left-oriented carets
    ${StyledPopover}.caret-pos--right & ,
    ${StyledPopover}.caret-pos--right-top & ,
    ${StyledPopover}.caret-pos--right-bottom & ,
    ${StyledPopover}.caret-pos--left & ,
    ${StyledPopover}.caret-pos--left-top & ,
    ${StyledPopover}.caret-pos--left-bottom & {
      &::before,
      &::after {
        top: 50%;
        left: auto;
        margin-left: 0;
        border-bottom-color: transparent;
      }

      &::before {
        // stylelint-disable-next-line primer/spacing
        margin-top: calc((${get('space.2')} + 1px) * -1);
      }

      &::after {
        margin-top: -${get('space.2')};
      }
    }

    // Right-oriented carets
    ${StyledPopover}.caret-pos--right & ,
    ${StyledPopover}.caret-pos--right-top & ,
    ${StyledPopover}.caret-pos--right-bottom & {
      &::before {
        right: -${get('space.3')};
        border-left-color: ${get('colors.border.default')};
      }

      &::after {
        right: -14px;
        // stylelint-disable-next-line primer/borders
        border-left-color: ${get('colors.canvas.overlay')};
      }
    }

    // Left-oriented carets
    ${StyledPopover}.caret-pos--left & ,
    ${StyledPopover}.caret-pos--left-top & ,
    ${StyledPopover}.caret-pos--left-bottom & {
      &::before {
        left: -${get('space.3')};
        border-right-color: ${get('colors.border.default')};
      }

      &::after {
        left: -14px;
        // stylelint-disable-next-line primer/borders
        border-right-color: ${get('colors.canvas.overlay')};
      }
    }

    // Right & Left: Top-oriented carets
    ${StyledPopover}.caret-pos--right-top & ,
    ${StyledPopover}.caret-pos--left-top & {
      &::before,
      &::after {
        top: ${get('space.4')};
      }
    }

    // Right & Left: Bottom-oriented carets
    ${StyledPopover}.caret-pos--right-bottom & ,
    ${StyledPopover}.caret-pos--left-bottom & {
      &::before,
      &::after {
        top: auto;
      }

      &::before {
        bottom: ${get('space.3')};
      }

      &::after {
        bottom: calc(${get('space.3')} + 1px);
      }
    }

    ${sx};
  `,
)

export type PopoverContentProps = {className?: string} & StyledPopoverProps & HTMLProps<HTMLDivElement>

const PopoverContent: React.FC<React.PropsWithChildren<PopoverContentProps>> = ({className, ...props}) => {
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)
  if (enabled) {
    return <StyledPopoverContent {...props} className={clsx(className, classes.PopoverContent)} />
  }

  return <StyledPopoverContent {...props} className={className} />
}

PopoverContent.displayName = 'Popover.Content'

export default Object.assign(Popover, {Content: PopoverContent})
