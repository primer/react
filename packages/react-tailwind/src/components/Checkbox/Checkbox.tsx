'use client'

import {Checkbox as BaseCheckbox} from '@base-ui/react/checkbox'
import {CheckIcon, DashIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {useFormControlForwardedProps} from '../FormControl/useFormControlForwardedProps'

const rootClassName =
  'inline-flex size-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-sm border border-[var(--control-borderColor-emphasis)] bg-default text-[var(--control-checked-fgColor-rest)] shadow-resting-xs outline-none transition-colors data-[checked]:border-[var(--control-checked-bgColor-rest)] data-[checked]:bg-[var(--control-checked-bgColor-rest)] data-[indeterminate]:border-[var(--control-checked-bgColor-rest)] data-[indeterminate]:bg-[var(--control-checked-bgColor-rest)] data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--control-borderColor-disabled)] data-[disabled]:bg-[var(--control-bgColor-disabled)] data-[disabled]:opacity-100 data-[checked]:data-[disabled]:border-[var(--control-checked-borderColor-disabled)] data-[checked]:data-[disabled]:bg-[var(--control-checked-bgColor-disabled)] data-[checked]:data-[disabled]:text-[var(--control-checked-fgColor-disabled)] data-[indeterminate]:data-[disabled]:border-[var(--control-checked-borderColor-disabled)] data-[indeterminate]:data-[disabled]:bg-[var(--control-checked-bgColor-disabled)] data-[indeterminate]:data-[disabled]:text-[var(--control-checked-fgColor-disabled)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'

export interface CheckboxProps
  extends Omit<BaseCheckbox.Root.Props, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseCheckbox.Root.Props['className']
}

/** A styled checkbox primitive. Pair with a native label or FormControl.Label. */
export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox({className, ...rest}, ref) {
  const forwardedProps = useFormControlForwardedProps(rest)
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseCheckbox.Root.State) => cn(rootClassName, className(state))
      : cn(rootClassName, className)

  return (
    <BaseCheckbox.Root {...forwardedProps} ref={ref} data-component="Checkbox" className={mergedClassName}>
      <BaseCheckbox.Indicator className="flex data-[indeterminate]:[&>.checkbox-check]:hidden data-[indeterminate]:[&>.checkbox-dash]:block">
        <CheckIcon aria-hidden="true" size={12} className="checkbox-check" />
        <DashIcon aria-hidden="true" size={12} className="checkbox-dash hidden" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
})

Checkbox.displayName = 'Checkbox'
