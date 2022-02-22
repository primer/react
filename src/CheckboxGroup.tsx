import React, {ChangeEvent, ChangeEventHandler, createContext, FC} from 'react'
import CheckboxOrRadioGroup, {CheckboxOrRadioGroupProps} from './_CheckboxOrRadioGroup'
import CheckboxOrRadioGroupCaption from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupCaption'
import CheckboxOrRadioGroupLabel from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel'
import CheckboxOrRadioGroupValidation from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation'
import {useRenderForcingRef} from './hooks'
import {SxProp} from './sx'

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

const CheckboxGroup: FC<CheckboxGroupProps> = ({children, disabled, onChange, ...rest}) => {
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useRenderForcingRef<string[]>([])

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
