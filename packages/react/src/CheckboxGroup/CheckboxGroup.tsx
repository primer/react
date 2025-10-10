import type {ChangeEvent, ChangeEventHandler, FC} from 'react'
import React from 'react'
import type {CheckboxOrRadioGroupProps} from '../internal/components/CheckboxOrRadioGroup'
import CheckboxOrRadioGroup from '../internal/components/CheckboxOrRadioGroup'
import CheckboxOrRadioGroupCaption from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupCaption'
import CheckboxOrRadioGroupLabel from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupLabel'
import CheckboxOrRadioGroupValidation from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupValidation'
import {useRenderForcingRef} from '../hooks'
import FormControl from '../FormControl'
import Checkbox from '../Checkbox/Checkbox'
import {CheckboxGroupContext} from './CheckboxGroupContext'
import {getSlot} from '../utils/get-slot'
import type {FCWithSlotMarker} from '../utils/types'

export type CheckboxGroupProps = {
  /**
   * An onChange handler that gets called when any of the checkboxes change
   */
  onChange?: (selected: string[], e?: ChangeEvent<HTMLInputElement>) => void
} & CheckboxOrRadioGroupProps

const CheckboxGroup: FCWithSlotMarker<React.PropsWithChildren<CheckboxGroupProps>> = ({
  children,
  disabled,
  onChange,
  ...rest
}) => {
  const formControlComponentChildren = React.Children.toArray(children)
    .filter(
      child => React.isValidElement(child) && (child.type === FormControl || getSlot(child) === FormControl.__SLOT__),
    )
    .map(formControlComponent =>
      React.isValidElement(formControlComponent) ? formControlComponent.props.children : [],
    )
    .flat()

  const checkedCheckboxes = React.Children.toArray(formControlComponentChildren)
    .filter(child => React.isValidElement(child) && (child.type === Checkbox || getSlot(child) === Checkbox.__SLOT__))
    .map(
      checkbox =>
        React.isValidElement(checkbox) &&
        (checkbox.props.checked || checkbox.props.defaultChecked) &&
        checkbox.props.value,
    )
    .filter(Boolean)
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useRenderForcingRef<string[]>(checkedCheckboxes)

  const updateSelectedCheckboxes: ChangeEventHandler<HTMLInputElement> = e => {
    const {value, checked} = e.currentTarget

    if (checked) {
      setSelectedCheckboxValues([...(selectedCheckboxValues.current || []), value])
      return
    }

    setSelectedCheckboxValues((selectedCheckboxValues.current || []).filter(selectedValue => selectedValue !== value))
  }

  return (
    <CheckboxGroupContext.Provider
      value={{
        disabled,
        onChange: e => {
          if (onChange) {
            updateSelectedCheckboxes(e)
            onChange(selectedCheckboxValues.current || [], e)
          }
        },
      }}
    >
      <CheckboxOrRadioGroup disabled={disabled} {...rest}>
        {children}
      </CheckboxOrRadioGroup>
    </CheckboxGroupContext.Provider>
  )
}

export {CheckboxGroupContext}

export default Object.assign(CheckboxGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation,
})

CheckboxGroup.__SLOT__ = Symbol('CheckboxGroup')
