import {Checkbox as BaseCheckbox} from '@base-ui/react/checkbox'
import {CheckIcon, DashIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'

const rootClassName =
  'inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-default bg-default text-on-emphasis shadow-resting-xs outline-none transition-colors data-[checked]:border-accent-emphasis data-[checked]:bg-accent-emphasis data-[indeterminate]:border-accent-emphasis data-[indeterminate]:bg-accent-emphasis data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'

export interface CheckboxProps
  extends Omit<BaseCheckbox.Root.Props, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseCheckbox.Root.Props['className']
}

/** A styled checkbox primitive. Pair with a native label or FormControl.Label. */
export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox({className, ...rest}, ref) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseCheckbox.Root.State) => cn(rootClassName, className(state))
      : cn(rootClassName, className)

  return (
    <BaseCheckbox.Root {...rest} ref={ref} data-component="Checkbox" className={mergedClassName}>
      <BaseCheckbox.Indicator className="flex data-[indeterminate]:[&>.checkbox-check]:hidden data-[indeterminate]:[&>.checkbox-dash]:block">
        <CheckIcon aria-hidden="true" size={12} className="checkbox-check" />
        <DashIcon aria-hidden="true" size={12} className="checkbox-dash hidden" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
})

Checkbox.displayName = 'Checkbox'
