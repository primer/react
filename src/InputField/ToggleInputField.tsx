import React from 'react'
import {Box} from '..'
import {ComponentProps} from '../utils/types'
import {Slots} from './InputField'
import InputFieldCaption from './InputFieldCaption'
import InputFieldInput from './InputFieldInput'
import InputFieldLabel from './InputFieldLabel'
import InputFieldValidation from './InputFieldValidation'

//TODO: DRY out - some of this is repeated in the `InputField` Props interface
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
  id: string
  /**
   * The identifier used to associate this input with other inputs. For example: associating multiple radio inputs
   */
  name?: string
  /**
   * Styles the field to visually communicate the result of form validation
   */
  validationStatus?: 'error' | 'warning' | 'success'
}

const InputField: React.FC<Props> = ({children, disabled, id, validationStatus}) => {
  return (
    <Slots
      context={{
        captionId: `${id}-caption`,
        disabled,
        id,
        validationStatus
      }}
    >
      {slots => {
        return (
          // TODO: see if I can just make `children` a child of the `Box`
          <>
            {children}
            <Box display="flex">
              <div>{slots.Input}</div>
              {/* TODO: fix typescript */}
              {!slots.Label?.valueOf().props.visuallyHidden || slots.Caption ? (
                <Box ml={1}>
                  {slots.Label}
                  {slots.Caption}
                </Box>
              ) : (
                <>
                  {slots.Label}
                  {slots.Caption}
                </>
              )}
            </Box>
          </>
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
