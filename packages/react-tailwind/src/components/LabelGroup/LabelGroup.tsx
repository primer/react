import React from 'react'
import {cn} from '../../internal/cn'

export interface LabelGroupProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
}

export const LabelGroup = React.forwardRef<HTMLElement, LabelGroupProps>(function LabelGroup(
  {as: Component = 'div', className, ...rest},
  ref,
) {
  return <Component {...rest} ref={ref} data-component="LabelGroup" className={cn('flex flex-wrap gap-1', className)} />
})

LabelGroup.displayName = 'LabelGroup'
