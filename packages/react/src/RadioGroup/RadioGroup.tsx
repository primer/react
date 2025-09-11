import type {ChangeEvent, ChangeEventHandler, FC} from 'react'
import type React from 'react'
import {createContext} from 'react'
import type {CheckboxOrRadioGroupProps} from '../internal/components/CheckboxOrRadioGroup'
import CheckboxOrRadioGroup from '../internal/components/CheckboxOrRadioGroup'
import CheckboxOrRadioGroupCaption from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupCaption'
import CheckboxOrRadioGroupLabel from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupLabel'
import CheckboxOrRadioGroupValidation from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupValidation'
import {useRenderForcingRef} from '../hooks'
import type {SxProp} from '../sx'

type RadioGroupProps = {
  /**
   * An onChange handler that gets called when the selection changes
   */
  onChange?: (selected: string | null, e?: ChangeEvent<HTMLInputElement>) => void
  /**
   * The name used to identify this group of radios
   */
  name: string
} & CheckboxOrRadioGroupProps &
  SxProp

export const RadioGroupContext = createContext<{
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  name: string
} | null>(null)

const RadioGroup: FC<React.PropsWithChildren<RadioGroupProps>> = ({children, disabled, onChange, name, ...rest}) => {
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
        },
      }}
    >
      <CheckboxOrRadioGroup disabled={disabled} {...rest}>
        {children}
      </CheckboxOrRadioGroup>
    </RadioGroupContext.Provider>
  )
}

export default Object.assign(RadioGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation,
})
