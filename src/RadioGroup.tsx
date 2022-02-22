import React, {ChangeEvent, ChangeEventHandler, createContext, FC} from 'react'
import ChoiceGroup, {ChoiceGroupProps} from './ChoiceGroup'
import ChoiceGroupCaption from './ChoiceGroup/_ChoiceGroupCaption'
import ChoiceGroupLabel from './ChoiceGroup/_ChoiceGroupLabel'
import ChoiceGroupValidation from './ChoiceGroup/_ChoiceGroupValidation'
import {useRenderForcingRef} from './hooks'
import {SxProp} from './sx'

type RadioGroupProps = {
  /**
   * An onChange handler that gets called when the selection changes
   */
  onChange?: (selected: string | null, e?: ChangeEvent<HTMLInputElement>) => void
  /**
   * The name used to identify this group of radios
   */
  name: string
} & ChoiceGroupProps &
  SxProp

export const RadioGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  name: string
} | null>(null)

const RadioGroup: FC<RadioGroupProps> = ({children, disabled, onChange, name, ...rest}) => {
  const [selectedRadioValue, setSelectedRadioValue] = useRenderForcingRef<string | null>(null)

  const updateSelectedCheckboxes: ChangeEventHandler<HTMLInputElement> = e => {
    const {value, checked} = e.currentTarget

    if (checked) {
      setSelectedRadioValue(value)
      return
    }
  }

  return (
    <RadioGroupContext.Provider
      value={{
        disabled,
        name,
        onChange: e => {
          if (onChange) {
            updateSelectedCheckboxes(e)
            onChange(selectedRadioValue.current, e)
          }
        }
      }}
    >
      <ChoiceGroup disabled={disabled} {...rest}>
        {children}
      </ChoiceGroup>
    </RadioGroupContext.Provider>
  )
}

export default Object.assign(RadioGroup, {
  Caption: ChoiceGroupCaption,
  Label: ChoiceGroupLabel,
  Validation: ChoiceGroupValidation
})
