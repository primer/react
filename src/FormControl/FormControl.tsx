import React, {useContext} from 'react'
import {Autocomplete, Box, Checkbox, Radio, Select, Textarea, TextInput, TextInputWithTokens, useSSRSafeId} from '..'
import FormControlCaption from './_FormControlCaption'
import FormControlLabel from './_FormControlLabel'
import FormControlValidation from './_FormControlValidation'
import {Slots} from './slots'
import ValidationAnimationContainer from '../_ValidationAnimationContainer'
import {get} from '../constants'
import FormControlLeadingVisual from './_FormControlLeadingVisual'
import {SxProp} from '../sx'
import CheckboxOrRadioGroupContext from '../_CheckboxOrRadioGroup/_CheckboxOrRadioGroupContext'

export type FormControlProps = {
  children?: React.ReactNode
  /**
   * Whether the control allows user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this control. Used to associate the label, validation text, and caption text
   */
  id?: string
  /**
   * If true, the user must specify a value for the input before the owning form can be submitted
   */
  required?: boolean
} & SxProp

export interface FormControlContext extends Pick<FormControlProps, 'disabled' | 'id' | 'required'> {
  captionId: string
  validationMessageId: string
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({children, disabled: disabledProp, id: idProp, required, sx}, ref) => {
    const expectedInputComponents = [Autocomplete, Checkbox, Radio, Select, TextInput, TextInputWithTokens, Textarea]
    const choiceGroupContext = useContext(CheckboxOrRadioGroupContext)
    const disabled = choiceGroupContext?.disabled || disabledProp
    const id = useSSRSafeId(idProp)
    const validationChild = React.Children.toArray(children).find(child =>
      React.isValidElement(child) && child.type === FormControlValidation ? child : null
    )
    const captionChild = React.Children.toArray(children).find(child =>
      React.isValidElement(child) && child.type === FormControlCaption ? child : null
    )
    const labelChild = React.Children.toArray(children).find(
      child => React.isValidElement(child) && child.type === FormControlLabel
    )
    const validationMessageId = validationChild && `${id}-validationMessage`
    const captionId = captionChild && `${id}-caption`
    const validationStatus = React.isValidElement(validationChild) && validationChild.props.variant
    const InputComponent = React.Children.toArray(children).find(child =>
      expectedInputComponents.some(inputComponent => React.isValidElement(child) && child.type === inputComponent)
    )
    const inputProps = React.isValidElement(InputComponent) && InputComponent.props
    const isChoiceInput =
      React.isValidElement(InputComponent) && (InputComponent.type === Checkbox || InputComponent.type === Radio)

    if (!InputComponent) {
      // eslint-disable-next-line no-console
      console.warn(
        `To correctly render this field with the correct ARIA attributes passed to the input, please pass one of the component from @primer/react as a direct child of the FormControl component: ${expectedInputComponents.reduce(
          (acc, componentName) => {
            acc += `\n- ${componentName.displayName}`

            return acc
          },
          ''
        )}`,
        'If you are using a custom input component, please be sure to follow WCAG guidelines to make your form control accessible.'
      )
    } else {
      if (inputProps?.id) {
        // eslint-disable-next-line no-console
        console.warn(
          `instead of passing the 'id' prop directly to the input component, it should be passed to the parent component, <FormControl>`
        )
      }
      if (inputProps?.disabled) {
        // eslint-disable-next-line no-console
        console.warn(
          `instead of passing the 'disabled' prop directly to the input component, it should be passed to the parent component, <FormControl>`
        )
      }
      if (inputProps?.required) {
        // eslint-disable-next-line no-console
        console.warn(
          `instead of passing the 'required' prop directly to the input component, it should be passed to the parent component, <FormControl>`
        )
      }
    }

    if (!labelChild) {
      // eslint-disable-next-line no-console
      console.error(
        `The input field with the id ${id} MUST have a FormControl.Label child.\n\nIf you want to hide the label, pass the 'visuallyHidden' prop to the FormControl.Label component.`
      )
    }

    if (isChoiceInput) {
      if (validationChild) {
        // eslint-disable-next-line no-console
        console.warn(
          'Validation messages are not rendered for an individual checkbox or radio. The validation message should be shown for all options.'
        )
      }

      if (React.Children.toArray(children).find(child => React.isValidElement(child) && child.props?.required)) {
        // eslint-disable-next-line no-console
        console.warn('An individual checkbox or radio cannot be a required field.')
      }
    } else {
      if (
        React.Children.toArray(children).find(
          child => React.isValidElement(child) && child.type === FormControlLeadingVisual
        )
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          'A leading visual is only rendered for a checkbox or radio form control. If you want to render a leading visual inside of your input, check if your input supports a leading visual.'
        )
      }
    }

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

          return isChoiceInput ? (
            <Box ref={ref} display="flex" alignItems={slots.LeadingVisual ? 'center' : undefined} sx={sx}>
              <Box sx={{'> input': {marginLeft: 0, marginRight: 0}}}>
                {React.isValidElement(InputComponent) &&
                  React.cloneElement(InputComponent, {
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
          ) : (
            <Box
              ref={ref}
              display="flex"
              flexDirection="column"
              width="100%"
              sx={{...(isLabelHidden ? {'> *:not(label) + *': {marginTop: 2}} : {'> * + *': {marginTop: 2}}), ...sx}}
            >
              {React.Children.toArray(children).filter(
                child =>
                  React.isValidElement(child) &&
                  !expectedInputComponents.some(inputComponent => child.type === inputComponent)
              )}
              {slots.Label}
              {React.isValidElement(InputComponent) &&
                React.cloneElement(InputComponent, {
                  id,
                  required,
                  disabled,
                  validationStatus,
                  ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' ')
                })}
              {validationChild && <ValidationAnimationContainer show>{slots.Validation}</ValidationAnimationContainer>}
              {slots.Caption}
            </Box>
          )
        }}
      </Slots>
    )
  }
)

export default Object.assign(FormControl, {
  Caption: FormControlCaption,
  Label: FormControlLabel,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation
})
