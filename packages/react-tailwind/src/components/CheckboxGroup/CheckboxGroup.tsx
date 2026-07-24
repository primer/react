import {CheckboxGroup as BaseCheckboxGroup} from '@base-ui/react/checkbox-group'
import React from 'react'
import {cn} from '../../internal/cn'

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, 'className' | 'data-component'> {
  className?: BaseCheckboxGroup.Props['className']
}

/** Groups checkbox primitives and supplies controlled or uncontrolled values. */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  {className, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseCheckboxGroup.State) => cn('grid gap-2', className(state))
      : cn('grid gap-2', className)

  return <BaseCheckboxGroup {...rest} ref={ref} data-component="CheckboxGroup" className={mergedClassName} />
})

CheckboxGroup.displayName = 'CheckboxGroup'
