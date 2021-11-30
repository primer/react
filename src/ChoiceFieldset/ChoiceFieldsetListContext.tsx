import {ChangeEventHandler, createContext} from 'react'
import {CheckboxInputField, RadioInputField} from '..'
import {ComponentProps} from '../utils/types'
import InputField from '../_InputField'
import ToggleInputField, {ToggleInputFieldProps} from '../_InputField/ToggleInputField'

const ChoiceFieldsetListContext = createContext<{
  disabled?: boolean
  initialSelectedChoices?: string[]
  name?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  fieldComponent: React.FC<ToggleInputFieldProps> & {
    Input:
      | React.FC<ComponentProps<typeof RadioInputField.Input>>
      | React.FC<ComponentProps<typeof CheckboxInputField.Input>>
    Caption: React.FC<ComponentProps<typeof InputField.Caption>>
    Label: React.FC<ComponentProps<typeof InputField.Label>>
    LeadingVisual: React.FC<ComponentProps<typeof ToggleInputField.LeadingVisual>>
  }
} | null>(null)

CheckboxInputField.Input

export default ChoiceFieldsetListContext
