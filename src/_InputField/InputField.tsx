import React from 'react'
import {Box} from '..'
import InputValidation from '../InputValidation'
import {ComponentProps} from '../utils/types'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {uniqueId} from '../utils/uniqueId'
import InputFieldCaption from './InputFieldCaption'
import InputFieldLabel from './InputFieldLabel'
import InputFieldValidation from './InputFieldValidation'
import {Slots} from './slots'
import ValidationAnimationContainer from './ValidationAnimationContainer'
export interface Props<T = Record<string, FormValidationStatus>> {
  children?: React.ReactNode
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
  validationMap?: T
  /**
   * The key of the validation message to show
   */
  validationResult?: keyof T
}

type InputFieldValidationProps = ComponentProps<typeof InputFieldValidation>
export interface InputFieldContext
  extends Pick<Props<Record<string, FormValidationStatus>>, 'disabled' | 'id' | 'required'> {
  captionId: string
  validationMessageId: string
}

// adding `extends unknown` beacuse `<T>` is interpretted as a JSX tag
const InputField = <T extends Record<string, FormValidationStatus>>({
  children,
  disabled,
  id: idProp,
  required,
  validationMap,
  validationResult
}: Props<T>) => {
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
        <Box display="flex" flexDirection="column" width="100%" sx={{'> * + *': {marginTop: 2}}}>
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
export default Object.assign(InputField, {
  Caption: InputFieldCaption,
  Label: InputFieldLabel,
  Validation: InputFieldValidation
})
