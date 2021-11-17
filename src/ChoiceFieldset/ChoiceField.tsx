import React from 'react'
import ToggleInputField from '../InputField/ToggleInputField'
import {ComponentProps} from '../utils/types'
import {uniqueId} from '../utils/uniqueId'
import ChoiceFieldCaption from './ChoiceFieldCaption'
import ChoiceFieldInput from './ChoiceFieldInput'
import ChoiceFieldLabel from './ChoiceFieldLabel'

export interface ChoiceFieldProps {
  /**
   * Whether the field is ready for user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this field. Used to associate the label, validation text, and caption text
   */
  id?: string
}

const ChoiceField: React.FC<ChoiceFieldProps> = ({children, id, disabled}) => {
  const fieldId = id || uniqueId()

  return (
    <ToggleInputField id={fieldId} disabled={disabled}>
      {children}
    </ToggleInputField>
  )
}

export type ChoiceFieldComponentProps = ComponentProps<typeof ChoiceField>
export type {ChoiceFieldInputProps} from './ChoiceFieldInput'
export default Object.assign(ChoiceField, {
  Caption: ChoiceFieldCaption,
  Input: ChoiceFieldInput,
  Label: ChoiceFieldLabel
})
