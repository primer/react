'use client'

import {Radio as BaseRadio} from '@base-ui/react/radio'
import React from 'react'
import {markFormControlInput} from '../../internal/formControlParts'
import {mergeClassName} from '../../internal/mergeClassName'
import {radioClassName} from '../../internal/selectionVisuals'
import {useFormControlChoiceForwardedProps} from '../FormControl/useFormControlForwardedProps'
import {RadioGroupDisabledContext} from '../RadioGroup/RadioGroupDisabledContext'

export interface RadioProps<Value = string>
  extends Omit<BaseRadio.Root.Props<Value>, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseRadio.Root.Props<Value>['className']
}

/** A styled radio primitive for use inside RadioGroup. */
export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio({className, ...rest}, ref) {
  const forwardedProps = useFormControlChoiceForwardedProps(rest)
  // Base UI keeps a roving tab stop on a fully disabled group; native disabled radios leave the tab order.
  const groupDisabled = React.useContext(RadioGroupDisabledContext)

  return (
    <BaseRadio.Root
      {...forwardedProps}
      {...(groupDisabled ? {tabIndex: -1} : null)}
      ref={ref}
      data-component="Radio"
      className={mergeClassName(radioClassName, className)}
    >
      <BaseRadio.Indicator className="primer:hidden" />
    </BaseRadio.Root>
  )
})

Radio.displayName = 'Radio'

markFormControlInput(Radio, {baseUiControlId: true, baseUiAccessibleLabel: true})
