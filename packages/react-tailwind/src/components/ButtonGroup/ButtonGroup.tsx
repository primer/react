import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const groupVariants = cva('inline-flex', {
  variants: {
    orientation: {horizontal: 'flex-row', vertical: 'flex-col'},
  },
  defaultVariants: {orientation: 'horizontal'},
})

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof groupVariants> {}

export const ButtonGroup = React.forwardRef<HTMLElement, ButtonGroupProps>(function ButtonGroup(
  {children, className, orientation, role = 'group', ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      role={role}
      data-component="ButtonGroup"
      data-orientation={orientation}
      className={cn(groupVariants({orientation}), className)}
    >
      {children}
    </div>
  )
})

ButtonGroup.displayName = 'ButtonGroup'
