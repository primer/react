import React from 'react'
import {Box} from '..'
import createSlots from '../utils/create-slots'
import {ComponentProps} from '../utils/types'
import InputFieldCaption from './InputFieldCaption'
import InputFieldInput from './InputFieldInput'
import InputFieldLabel from './InputFieldLabel'
import InputFieldValidation from './InputFieldValidation'

interface Props {
  // TODO: limit children to specific components
  // children: any;
  id: string
  // TODO: come up with a better way to change the layout from vertical and label first to horizontal and input first
  isToggle?: boolean
  required?: boolean
  // TODO: Figure out if we're keeping the 'warning' status
  validationStatus?: 'error' | 'warning' | 'success'
}

export interface InputFieldContext extends Pick<Props, 'id' | 'required' | 'validationStatus'> {
  validationMessageId?: string
  captionId?: string
}

const {Slots, Slot} = createSlots(['Caption', 'Validation', 'Input', 'Label'])
export {Slot}

const InputField: React.FC<Props> = ({children, id, required, validationStatus}) => {
  return (
    <Slots
      context={{
        id,
        required,
        validationStatus,
        validationMessageId: `${id}-errorMsg`,
        captionId: `${id}-caption`
      }}
    >
      {slots => {
        return (
          <>
            {children}
            <Box display="flex" flexDirection="column" sx={{'> * + *': {marginTop: 1}}}>
              {slots.Label}
              {slots.Input}
              {slots.Validation}
              {slots.Caption && <Box mt={2}>{slots.Caption}</Box>}
            </Box>
          </>
        )
      }}
    </Slots>
  )
}

export type InputFieldProps = ComponentProps<typeof InputField>
export type {Props as InputFieldInputProps} from './InputFieldInput'
export default Object.assign(InputField, {
  Caption: InputFieldCaption,
  Input: InputFieldInput,
  Label: InputFieldLabel,
  Validation: InputFieldValidation
})
