import React from 'react'
import {Box} from '..'
import InputValidation from '../InputValidation'
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
   * A map of validation statuses and their associated validation keys. When one of the validation keys is passed to the `validationResult` prop,
   * the associated validation message will be rendered in the correct style
   */
  validationMap?: Record<string, 'error' | 'warning' | 'success'>
  /**
   * The key of the validation message to show
   */
  // TODO: figure out how to type this as a string union of `validationMap` values
  // something like `keyof Props['validationMap']`
  validationResult?: string
}

type InputFieldValidationProps = ComponentProps<typeof InputFieldValidation>
export interface InputFieldContext extends Pick<Props, 'disabled' | 'id' | 'required'> {
  captionId: string
  validationMessageId: string
}

const InputField: React.FC<Props> = ({children, disabled, id: idProp, required, validationMap, validationResult}) => {
  const id = idProp || uniqueId()
  const validationChildren: React.ReactElement<InputFieldValidationProps>[] | undefined | null = React.Children.map(
    children,
    child =>
      React.isValidElement<InputFieldValidationProps>(child) && child.type === InputFieldValidation ? child : null
  )?.filter(Boolean)
  const validationChildToRender = validationChildren?.find(child => child.props.validationKey === validationResult)
  const validationMessageId = validationChildToRender ? `${id}-validationMsg` : undefined

  return (
    <Slots
      context={{
        captionId: `${id}-caption`,
        disabled,
        id,
        required,
        validationMessageId
      }}
    >
      {slots => (
        <Box display="flex" flexDirection="column" width="100%" sx={{'> * + *': {marginTop: 1}}}>
          {React.Children.toArray(children).filter(
            child => React.isValidElement<InputFieldValidationProps>(child) && child.type !== InputFieldValidation
          )}
          {slots.Label}
          {slots.Input}
          {validationChildToRender && validationMap && validationResult && validationMessageId && (
            <ValidationAnimationContainer show>
              <InputValidation validationStatus={validationMap[validationResult]} id={validationMessageId}>
                {validationChildToRender}
              </InputValidation>
            </ValidationAnimationContainer>
          )}
          {slots.Caption}
        </Box>
      )}
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
