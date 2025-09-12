import {clsx} from 'clsx'
import type {SxProp} from '../sx'
import classes from './Popover.module.css'
import type {HTMLProps} from 'react'
import React from 'react'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

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
  as?: React.ElementType
} & StyledPopoverProps &
  HTMLProps<HTMLDivElement>

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {className, caret = 'top', open, relative, ...props},
  forwardRef,
) {
  return (
    <BoxWithFallback
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
  as?: React.ElementType
  width?: 'xsmall' | 'small' | 'large' | 'medium' | 'auto' | 'xlarge'
  height?: 'small' | 'large' | 'medium' | 'auto' | 'xlarge' | 'fit-content'
} & StyledPopoverProps &
  HTMLProps<HTMLDivElement>

const PopoverContent: React.FC<React.PropsWithChildren<PopoverContentProps>> = ({
  className,
  width = 'small',
  height = 'fit-content',
  ...props
}) => {
  return (
    <BoxWithFallback
      data-width={width}
      data-height={height}
      className={clsx(className, classes.PopoverContent)}
      {...props}
    />
  )
}

PopoverContent.displayName = 'Popover.Content'

export default Object.assign(Popover, {Content: PopoverContent})
