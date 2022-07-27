import React from 'react'
import {Box, Checkbox, Radio, useSSRSafeId} from '..'
import {get} from '../constants'
import {Slots} from './InputField/slots'
import ChoiceInputLeadingVisual from './_ChoiceInputLeadingVisual'
import InputField, {Props as InputFieldProps} from './InputField/InputField'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import InputFieldCaption from './InputField/_InputFieldCaption'

export interface Props extends Pick<InputFieldProps, 'disabled' | 'id'> {
  /**
   * Styles the field to visually communicate the result of form validation
   */
  validationStatus?: FormValidationStatus
}

const getInputToRender = (inputType: 'radio' | 'checkbox', children?: React.ReactNode) => {
  const inputComponentMap = {
    radio: Radio,
    checkbox: Checkbox
  }

  return React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === inputComponentMap[inputType] ? child : null
  )
}

const ChoiceInputField: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  disabled,
  id: idProp,
  validationStatus
}) => {
  const id = useSSRSafeId(idProp)
  const captionChildren: React.ReactElement[] | undefined | null = React.Children.map(children, child =>
    React.isValidElement(child) && child.type === InputFieldCaption ? child : null
  )?.filter(Boolean)
  const captionId = captionChildren?.length ? `${id}-caption` : undefined
  const inputType = React.Children.toArray(children).some(child =>
    React.isValidElement(child) ? child.type === Checkbox : false
  )
    ? 'checkbox'
    : 'radio'
  const ChoiceInput = getInputToRender(inputType, children)
  const choiceInputProps = React.isValidElement(ChoiceInput) ? ChoiceInput.props : undefined

  if (!ChoiceInput) {
    // eslint-disable-next-line no-console
    console.warn(
      'To correctly render this field with the correct ARIA attributes passed to the input, please pass the Checkbox or Radio component from @primer/react as a direct child of the ChoiceInputField component'
    )
  } else {
    if (choiceInputProps?.id) {
      // eslint-disable-next-line no-console
      console.warn(
        `instead of passing the 'id' prop directly to the ${inputType} input, it should be passed to the parent component, <ChoiceInputField>`
      )
    }

    if (choiceInputProps?.disabled) {
      // eslint-disable-next-line no-console
      console.warn(
        `instead of passing the 'disabled' prop directly to the ${inputType} input, it should be passed to the parent component, <ChoiceInputField>`
      )
    }

    if (choiceInputProps?.required) {
      // eslint-disable-next-line no-console
      console.warn(
        `instead of passing the 'required' prop directly to the ${inputType} input, it should be passed to the parent component, <ChoiceInputField>`
      )
    }
  }

  return (
    <Slots
      context={{
        captionId,
        disabled,
        id,
        validationStatus
      }}
    >
      {slots => {
        return (
          <Box display="flex" alignItems={slots.LeadingVisual ? 'center' : undefined}>
            <Box sx={{'> input': {marginLeft: 0, marginRight: 0}}}>
              {React.isValidElement(ChoiceInput) &&
                React.cloneElement(ChoiceInput, {
                  id,
                  disabled,
                  ['aria-describedby']: captionId
                })}
              {React.Children.toArray(children).filter(
                child =>
                  React.isValidElement(child) &&
                  ![Checkbox, Radio].some(inputComponent => child.type === inputComponent)
              )}
            </Box>
            {slots.LeadingVisual && (
              <Box
                color={disabled ? 'fg.muted' : 'fg.default'}
                sx={{
                  '> *': {
                    minWidth: slots.Caption ? get('fontSizes.4') : get('fontSizes.2'),
                    minHeight: slots.Caption ? get('fontSizes.4') : get('fontSizes.2'),
                    fill: 'currentColor'
                  }
                }}
                ml={2}
              >
                {slots.LeadingVisual}
              </Box>
            )}
            {(React.isValidElement(slots.Label) && !slots.Label.props.visuallyHidden) || slots.Caption ? (
              <Box display="flex" flexDirection="column" ml={2}>
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
        )
      }}
    </Slots>
  )
}

const Label: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <InputField.Label>{children}</InputField.Label>
)

/**
 * @deprecated Use `FormControl` instead. See https://primer.style/react/FormControl for more info
 */
export default Object.assign(ChoiceInputField, {
  Label,
  Caption: InputField.Caption,
  LeadingVisual: ChoiceInputLeadingVisual
})
