import React, {ChangeEvent, ChangeEventHandler, createContext, FC} from 'react'
import ChoiceGroup, {ChoiceGroupProps} from './ChoiceGroup'
import ChoiceGroupCaption from './ChoiceGroup/_ChoiceGroupCaption'
import ChoiceGroupLabel from './ChoiceGroup/_ChoiceGroupLabel'
import ChoiceGroupValidation from './ChoiceGroup/_ChoiceGroupValidation'
import {useRenderForcingRef} from './hooks'
import {SxProp} from './sx'

type CheckboxGroupProps = {
  /**
   * An onChange handler that gets called when any of the checkboxes change
   */
  onChange?: (selected: string[], e?: ChangeEvent<HTMLInputElement>) => void
} & ChoiceGroupProps &
  SxProp

// TODO: hoist this up for use in checkboxes _and_ radios
export const CheckboxChoiceGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}>({})

const CheckboxGroup: FC<CheckboxGroupProps> = ({children, disabled, onChange, ...rest}) => {
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useRenderForcingRef<string[] | null>([])

  const updateSelectedCheckboxes: ChangeEventHandler<HTMLInputElement> = e => {
    const {value, checked} = e.currentTarget

    if (checked) {
      setSelectedCheckboxValues([...(selectedCheckboxValues.current ? selectedCheckboxValues.current : []), value])
      return
    }

    setSelectedCheckboxValues(
      (selectedCheckboxValues.current ? selectedCheckboxValues.current : []).filter(
        selectedValue => selectedValue !== value
      )
    )
  }

  return (
    <CheckboxChoiceGroupContext.Provider
      value={{
        disabled,
        onChange: e => {
          if (onChange) {
            updateSelectedCheckboxes(e)
            onChange(selectedCheckboxValues.current ? selectedCheckboxValues.current : [], e)
          }
        }
      }}
    >
      <ChoiceGroup {...rest}>{children}</ChoiceGroup>
    </CheckboxChoiceGroupContext.Provider>
  )
}

export default Object.assign(CheckboxGroup, {
  Caption: ChoiceGroupCaption,
  Label: ChoiceGroupLabel,
  Validation: ChoiceGroupValidation
})
