import {RadioGroup as BaseRadioGroup} from '@base-ui/react/radio-group'
import React from 'react'
import {cn} from '../../internal/cn'

export interface RadioGroupProps<Value = string>
  extends Omit<BaseRadioGroup.Props<Value>, 'className' | 'data-component'> {
  className?: BaseRadioGroup.Props<Value>['className']
}

/** Groups Radio primitives and implements roving keyboard focus. */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {className, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseRadioGroup.State) => cn('grid gap-2', className(state))
      : cn('grid gap-2', className)

  return <BaseRadioGroup {...rest} ref={ref} data-component="RadioGroup" className={mergedClassName} />
})

RadioGroup.displayName = 'RadioGroup'
