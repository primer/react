import {clsx} from 'clsx'
import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Popover.module.css'

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

const CSS_MODULES_FLAG = 'primer_react_css_modules_team'

const StyledPopover = toggleStyledComponent(
  CSS_MODULES_FLAG,
  'div',
  styled.div.attrs<StyledPopoverProps>(({className, caret = 'top'}) => {
    return {
      className: clsx(className, `caret-pos--${caret}`),
    }
  })<StyledPopoverProps>`
    position: ${props => (props.relative ? 'relative' : 'absolute')};
    z-index: 100;
    display: ${props => (props.open ? 'block' : 'none')};
    ${sx};
  `,
)

export type PopoverProps = {
  /** Class name for custom styling */
  className?: string
} & StyledPopoverProps

const Popover: React.FC<React.PropsWithChildren<PopoverProps>> = ({
  className,
  caret = 'top',
  open,
  relative,
  ...props
}) => {
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)
  if (enabled) {
    return (
      <StyledPopover
        data-open={open ? '' : undefined}
        data-relative={relative ? '' : undefined}
        className={clsx(className, classes.Popover, `caret-pos--${caret}`)}
      />
    )
  }

  return <StyledPopover {...props} className={className} caret={caret} open={open} />
}

const PopoverContent = styled.div<SxProp>`
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
  ${Popover}.caret-pos--bottom & ,
  ${Popover}.caret-pos--bottom-right & ,
  ${Popover}.caret-pos--bottom-left & {
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
  ${Popover}.caret-pos--top-right & ,
  ${Popover}.caret-pos--bottom-right & {
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
  ${Popover}.caret-pos--top-left & ,
  ${Popover}.caret-pos--bottom-left & {
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
  ${Popover}.caret-pos--right & ,
  ${Popover}.caret-pos--right-top & ,
  ${Popover}.caret-pos--right-bottom & ,
  ${Popover}.caret-pos--left & ,
  ${Popover}.caret-pos--left-top & ,
  ${Popover}.caret-pos--left-bottom & {
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
  ${Popover}.caret-pos--right & ,
  ${Popover}.caret-pos--right-top & ,
  ${Popover}.caret-pos--right-bottom & {
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
  ${Popover}.caret-pos--left & ,
  ${Popover}.caret-pos--left-top & ,
  ${Popover}.caret-pos--left-bottom & {
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
  ${Popover}.caret-pos--right-top & ,
  ${Popover}.caret-pos--left-top & {
    &::before,
    &::after {
      top: ${get('space.4')};
    }
  }

  // Right & Left: Bottom-oriented carets
  ${Popover}.caret-pos--right-bottom & ,
  ${Popover}.caret-pos--left-bottom & {
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
`

PopoverContent.displayName = 'Popover.Content'

export type PopoverContentProps = ComponentProps<typeof PopoverContent>
export default Object.assign(Popover, {Content: PopoverContent})
