import React from 'react'
import {Box} from '..'
import createSlots from '../utils/create-slots'
import {ComponentProps} from '../utils/types'
import InputFieldCaption from './InputFieldCaption'
import InputFieldInput from './InputFieldInput'
import InputFieldLabel from './InputFieldLabel'
import InputFieldValidation from './InputFieldValidation'
export interface Props {
  // TODO: limit children to specific components
  // children: any;
  id: string
  required?: boolean
  // TODO: Figure out if we're keeping the 'warning' status
  validationStatus?: 'error' | 'warning' | 'success'
}

export interface InputFieldContext extends Pick<Props, 'id' | 'required' | 'validationStatus'> {
  captionId: string
  validationMessageId: string
}

export const {Slots, Slot} = createSlots(['Caption', 'Validation', 'Input', 'Label'])

const InputField: React.FC<Props> = ({children, id, required, validationStatus}) => {
  const hasValidationChild = React.Children.toArray(children).some(
    child => React.isValidElement(child) && child.type === InputFieldValidation
  )

  return (
    <Slots
      context={{
        captionId: `${id}-caption`,
        id,
        required,
        validationMessageId: hasValidationChild ? `${id}-errorMsg` : undefined,
        validationStatus
      }}
    >
      {slots => {
        return (
          <Box display="flex" flexDirection="column" sx={{'> * + *': {marginTop: 1}}}>
            {children}
            {slots.Label}
            {slots.Input}
            {slots.Validation}
            {slots.Caption && <Box mt={2}>{slots.Caption}</Box>}
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
  Validation: InputFieldValidation
})
