import React, {useContext} from 'react'
import {ComponentProps} from '../utils/types'
import {uniqueId} from '../utils/uniqueId'
import ToggleInputLeadingVisual from '../_InputField/ToggleInputLeadingVisual'
import ChoiceFieldCaption from './ChoiceFieldCaption'
import ChoiceFieldInput from './ChoiceFieldInput'
import ChoiceFieldLabel from './ChoiceFieldLabel'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

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
  const choiceFieldsetListContext = useContext(ChoiceFieldsetListContext)
  if (choiceFieldsetListContext === null) {
    throw new Error('ChoiceFieldsetListContext returned null')
  }
  const {fieldComponent: FieldComponent} = choiceFieldsetListContext

  const fieldId = id || uniqueId()

  return (
    <FieldComponent id={fieldId} disabled={disabled}>
      {children}
    </FieldComponent>
  )
}

export type ChoiceFieldComponentProps = ComponentProps<typeof ChoiceField>
export type {ChoiceFieldInputProps} from './ChoiceFieldInput'
export default Object.assign(ChoiceField, {
  Caption: ChoiceFieldCaption,
  Input: ChoiceFieldInput,
  Label: ChoiceFieldLabel,
  LeadingVisual: ToggleInputLeadingVisual
})
