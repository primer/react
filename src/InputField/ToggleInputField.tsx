import React from 'react'
import {Box} from '..'
import {ComponentProps} from '../utils/types'
import {Slots} from './InputField'
import InputFieldCaption from './InputFieldCaption'
import InputFieldInput from './InputFieldInput'
import InputFieldLabel from './InputFieldLabel'
import InputFieldValidation from './InputFieldValidation'
export interface Props {
  // TODO: limit children to specific components
  // children: any;
  id: string
  name?: string
  // TODO: Figure out if we're keeping the 'warning' status
  validationStatus?: 'error' | 'warning' | 'success'
}

const InputField: React.FC<Props> = ({children, id, validationStatus}) => {
  return (
    <Slots
      context={{
        captionId: `${id}-caption`,
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
