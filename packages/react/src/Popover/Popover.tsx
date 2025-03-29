import {clsx} from 'clsx'
import type {SxProp} from '../sx'
import classes from './Popover.module.css'
import type {HTMLProps} from 'react'
import React from 'react'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'
import {defaultSxProp} from '../utils/defaultSxProp'

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

const Popover = React.forwardRef<HTMLElement, PopoverProps>(function Popover(
  {className, caret = 'top', open, relative, sx: sxProp = defaultSxProp, ...props},
  forwardRef,
) {
  const BaseComponent = toggleSxComponent(sxProp, 'div')
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
})
Popover.displayName = 'Popover'

export type PopoverContentProps = {className?: string} & StyledPopoverProps & HTMLProps<HTMLDivElement>

const PopoverContent: React.FC<React.PropsWithChildren<PopoverContentProps>> = ({
  className,
  sx: sxProp = defaultSxProp,
  ...props
}) => {
  const BaseComponent = toggleSxComponent(sxProp, 'div')
  return <BaseComponent {...props} className={clsx(className, classes.PopoverContent)} />
}

PopoverContent.displayName = 'Popover.Content'

export default Object.assign(Popover, {Content: PopoverContent})
