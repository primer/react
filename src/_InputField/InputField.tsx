import React from 'react'
import {Box, useSSRSafeId} from '..'
import InputValidation from '../_InputValidation'
import {ComponentProps} from '../utils/types'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
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

const InputField = <T extends Record<string, FormValidationStatus>>({
  children,
  disabled,
  id: idProp,
  required,
  validationMap,
  validationResult
}: Props<T>) => {
  const id = useSSRSafeId(idProp)
  const validationChildren: React.ReactElement<InputFieldValidationProps>[] | undefined | null = React.Children.map(
    children,
    child =>
      React.isValidElement<InputFieldValidationProps>(child) && child.type === InputFieldValidation ? child : null
  )?.filter(Boolean)
  const captionChildren: React.ReactElement[] | undefined | null = React.Children.map(children, child =>
    React.isValidElement(child) && child.type === InputFieldCaption ? child : null
  )?.filter(Boolean)
  const validationChildToRender = validationChildren?.find(child => child.props.validationKey === validationResult)
  const validationMessageId = validationChildToRender ? `${id}-validationMsg` : undefined
  const captionId = captionChildren?.length ? `${id}-caption` : undefined

  return (
    <Slots
      context={{
        captionId,
        disabled,
        id,
        required,
        validationMessageId
      }}
    >
      {slots => {
        const isLabelHidden = React.isValidElement(slots.Label) && slots.Label.props.visuallyHidden
        if (slots.Input && !slots.Label) {
          // eslint-disable-next-line no-console
          console.error(
            `The input field with the id ${id} MUST have a Label child (e.g.: <TextInputField.Label>).\n\nIf you want to hide the label, pass the 'visuallyHidden' prop to the Label component.`
          )
        }

        return (
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            sx={isLabelHidden ? {'> *:not(label) + *': {marginTop: 2}} : {'> * + *': {marginTop: 2}}}
          >
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
        )
      }}
    </Slots>
  )
}

export type InputFieldComponentProps = ComponentProps<typeof InputField>
export default Object.assign(InputField, {
  Caption: InputFieldCaption,
  Label: InputFieldLabel,
  Validation: InputFieldValidation
})
