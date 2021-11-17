import React from 'react'
import {Box} from '..'
import {ComponentProps} from '../utils/types'
import {uniqueId} from '../utils/uniqueId'
import InputFieldCaption from './InputFieldCaption'
import InputFieldInput from './InputFieldInput'
import InputFieldLabel from './InputFieldLabel'
import InputFieldValidation from './InputFieldValidation'
import {Slots} from './slots'
import ToggleInputLeadingVisual from './ToggleInputLeadingVisual'
import ValidationAnimationContainer from './ValidationAnimationContainer'
export interface Props {
  // TODO: limit children to specific components
  // children: any;
  /**
   * Whether the field is ready for user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this field. Used to associate the label, validation text, and caption text
   */
  id?: string
  /**
   * Whether this field must have a value for the user to complete their task
   */
  required?: boolean
  /**
   * Styles the field to visually communicate the result of form validation
   */
  // TODO: Figure out if we're keeping the 'warning' status
  validationStatus?: 'error' | 'warning' | 'success'
}
export interface InputFieldContext extends Pick<Props, 'disabled' | 'id' | 'required' | 'validationStatus'> {
  captionId: string
  validationMessageId: string
}

const InputField: React.FC<Props> = ({children, disabled, id, required, validationStatus}) => {
  const fieldId = id || uniqueId()
  const hasValidationChild = React.Children.toArray(children).some(
    child => React.isValidElement(child) && child.type === InputFieldValidation
  )

  return (
    <Slots
      context={{
        captionId: `${fieldId}-caption`,
        disabled,
        id: fieldId,
        required,
        validationMessageId: hasValidationChild ? `${fieldId}-validationMsg` : undefined,
        validationStatus
      }}
    >
      {slots => {
        return (
          <Box display="flex" flexDirection="column" width="100%" sx={{'> * + *': {marginTop: 1}}}>
            {children}
            {slots.Label}
            {slots.Input}
            <ValidationAnimationContainer show={Boolean(slots.Validation)}>
              {slots.Validation}
            </ValidationAnimationContainer>
            {slots.Caption && <Box mt={1}>{slots.Caption}</Box>}
          </Box>
        )
      }}
    </Slots>
  )
}

export type InputFieldComponentProps = ComponentProps<typeof InputField>
export type {Props as InputFieldInputProps} from './InputFieldInput'
export default Object.assign(InputField, {
  Caption: InputFieldCaption,
  Input: InputFieldInput,
  Label: InputFieldLabel,
  LeadingVisual: ToggleInputLeadingVisual,
  Validation: InputFieldValidation
})
