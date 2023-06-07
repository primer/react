import React from 'react'
import {Autocomplete, Box, Select, TextInput, TextInputWithTokens, useSSRSafeId} from '../../'
import InputValidation from '../../internal/components/InputValidation'
import {ComponentProps} from '../../utils/types'
import {FormValidationStatus} from '../../utils/types/FormValidationStatus'
import InputFieldCaption from './_InputFieldCaption'
import InputFieldLabel from './_InputFieldLabel'
import InputFieldValidation from './_InputFieldValidation'
import {Slots} from './slots'
import ValidationAnimationContainer from '../../internal/components/ValidationAnimationContainer'
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

/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
const InputField = <T extends Record<string, FormValidationStatus>>({
  children,
  disabled,
  id: idProp,
  required,
  validationMap,
  validationResult,
}: Props<T>) => {
  const expectedInputComponents = [TextInput, TextInputWithTokens, Autocomplete, Select]
  const id = useSSRSafeId(idProp)
  const validationChildren: React.ReactElement<InputFieldValidationProps>[] | undefined | null = React.Children.map(
    children,
    child =>
      React.isValidElement<InputFieldValidationProps>(child) && child.type === InputFieldValidation ? child : null,
  )?.filter(Boolean)
  const captionChildren: React.ReactElement[] | undefined | null = React.Children.map(children, child =>
    React.isValidElement(child) && child.type === InputFieldCaption ? child : null,
  )?.filter(Boolean)
  const labelChild: React.ReactNode | undefined | null = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === InputFieldLabel,
  )
  const validationChildToRender = validationChildren?.find(child => child.props.validationKey === validationResult)
  const validationMessageId = validationChildToRender ? `${id}-validationMsg` : undefined
  const captionId = captionChildren?.length ? `${id}-caption` : undefined
  const InputComponent = React.Children.toArray(children).find(child =>
    expectedInputComponents.some(inputComponent => React.isValidElement(child) && child.type === inputComponent),
  )
  const inputProps = React.isValidElement(InputComponent) ? InputComponent.props : undefined

  if (!InputComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      `To correctly render this field with the correct ARIA attributes passed to the input, please pass one of the component from @primer/react as a direct child of the InputField component:
      - TextInput
      - TextInputWithTokens
      - Autocomplete`,
    )
  } else {
    if (inputProps?.id) {
      // eslint-disable-next-line no-console
      console.warn(
        `instead of passing the 'id' prop directly to the input component, it should be passed to the parent component, <InputField>`,
      )
    }
    if (inputProps?.disabled) {
      // eslint-disable-next-line no-console
      console.warn(
        `instead of passing the 'disabled' prop directly to the input component, it should be passed to the parent component, <InputField>`,
      )
    }
    if (inputProps?.required) {
      // eslint-disable-next-line no-console
      console.warn(
        `instead of passing the 'required' prop directly to the input component, it should be passed to the parent component, <InputField>`,
      )
    }
  }

  if (!labelChild) {
    // eslint-disable-next-line no-console
    console.error(
      `The input field with the id ${id} MUST have a InputField.Label child.\n\nIf you want to hide the label, pass the 'visuallyHidden' prop to the InputField.Label component.`,
    )
  }

  return (
    <Slots
      context={{
        captionId,
        disabled,
        id,
        required,
        validationMessageId,
      }}
    >
      {slots => {
        const isLabelHidden = React.isValidElement(slots.Label) && slots.Label.props.visuallyHidden

        return (
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            sx={isLabelHidden ? {'> *:not(label) + *': {marginTop: 2}} : {'> * + *': {marginTop: 2}}}
          >
            {React.Children.toArray(children).filter(
              child =>
                React.isValidElement(child) &&
                child.type !== InputFieldValidation &&
                !expectedInputComponents.some(inputComponent => child.type === inputComponent),
            )}
            {slots.Label}
            {React.isValidElement(InputComponent) &&
              React.cloneElement(
                InputComponent as React.ReactElement<{
                  id: string
                  required: boolean
                  disabled: boolean
                  ['aria-describedby']: string
                }>,
                {
                  id,
                  required,
                  disabled,
                  ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
                },
              )}
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
  Validation: InputFieldValidation,
})
