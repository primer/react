import {clsx} from 'clsx'
import type {SxProp} from '../sx'
import classes from './Popover.module.css'
import type {HTMLProps} from 'react'
import React from 'react'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'

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

export type PopoverProps = {
  /** Class name for custom styling */
  className?: string
} & StyledPopoverProps &
  HTMLProps<HTMLDivElement>

const PopoverBaseComponent = toggleSxComponent('div') as React.ComponentType<
  PopoverProps & React.RefAttributes<HTMLDivElement>
>
const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {className, caret = 'top', open, relative, ...props},
  forwardRef,
) {
  return (
    <PopoverBaseComponent
      {...props}
      ref={forwardRef}
      data-open={open ? '' : undefined}
      data-relative={relative ? '' : undefined}
      data-caret={caret}
      className={clsx(className, classes.Popover)}
    />
  )
})
Popover.displayName = 'Popover'

export type PopoverContentProps = {className?: string} & StyledPopoverProps & HTMLProps<HTMLDivElement>

const PopoverContentBaseComponent = toggleSxComponent('div') as React.ComponentType<PopoverContentProps>
const PopoverContent: React.FC<React.PropsWithChildren<PopoverContentProps>> = ({className, ...props}) => {
  return <PopoverContentBaseComponent {...props} className={clsx(className, classes.PopoverContent)} />
}

PopoverContent.displayName = 'Popover.Content'

export default Object.assign(Popover, {Content: PopoverContent})
