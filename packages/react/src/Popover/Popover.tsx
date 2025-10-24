import {clsx} from 'clsx'
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
  caret?: CaretPosition
  relative?: boolean
  open?: boolean
}

export type PopoverProps = {
  /** Class name for custom styling */
  className?: string
} & StyledPopoverProps &
  HTMLProps<HTMLDivElement>

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {className, caret = 'top', open, relative, ...props},
  forwardRef,
) {
  return (
    <div
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

export type PopoverContentProps = {
  className?: string
  width?: 'xsmall' | 'small' | 'large' | 'medium' | 'auto' | 'xlarge'
  height?: 'small' | 'large' | 'medium' | 'auto' | 'xlarge' | 'fit-content'
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible'
} & HTMLProps<HTMLDivElement>

const PopoverContent: React.FC<React.PropsWithChildren<PopoverContentProps>> = ({
  className,
  width = 'small',
  height = 'fit-content',
  ...props
}) => {
  return <div {...props} data-width={width} data-height={height} className={clsx(className, classes.PopoverContent)} />
}

PopoverContent.displayName = 'Popover.Content'

export default Object.assign(Popover, {Content: PopoverContent})
