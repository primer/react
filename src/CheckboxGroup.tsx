import React, {ChangeEvent, ChangeEventHandler, createContext, FC} from 'react'
import CheckboxOrRadioGroup, {CheckboxOrRadioGroupProps} from './_CheckboxOrRadioGroup'
import CheckboxOrRadioGroupCaption from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupCaption'
import CheckboxOrRadioGroupLabel from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel'
import CheckboxOrRadioGroupValidation from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation'
import {useRenderForcingRef} from './hooks'
import {SxProp} from './sx'
import {Checkbox, FormControl} from '.'

type CheckboxGroupProps = {
  /**
   * An onChange handler that gets called when any of the checkboxes change
   */
  onChange?: (selected: string[], e?: ChangeEvent<HTMLInputElement>) => void
} & CheckboxOrRadioGroupProps &
  SxProp

export const CheckboxGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}>({})

const CheckboxGroup: FC<React.PropsWithChildren<CheckboxGroupProps>> = ({children, disabled, onChange, ...rest}) => {
  const formControlComponentChildren = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.type === FormControl)
    .map(formControlComponent =>
      React.isValidElement(formControlComponent) ? formControlComponent.props.children : []
    )
    .flat()

  const checkedCheckboxes = React.Children.toArray(formControlComponentChildren)
    .filter(child => React.isValidElement(child) && child.type === Checkbox)
    .map(
      checkbox =>
        React.isValidElement(checkbox) &&
        (checkbox.props.checked || checkbox.props.defaultChecked) &&
        checkbox.props.value
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
        }
      }}
    >
      <CheckboxOrRadioGroup disabled={disabled} {...rest}>
        {children}
      </CheckboxOrRadioGroup>
    </CheckboxGroupContext.Provider>
  )
}

export default Object.assign(CheckboxGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
})
