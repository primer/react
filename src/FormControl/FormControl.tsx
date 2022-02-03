import React from 'react'
import {Autocomplete, Box, Checkbox, Radio, Select, Textarea, TextInput, TextInputWithTokens, useSSRSafeId} from '..'
import InputValidation from '../_InputValidation'
import {ComponentProps} from '../utils/types'
import FormControlCaption from './_FormControlCaption'
import FormControlLabel from './_FormControlLabel'
import FormControlValidation from './_FormControlValidation'
import {Slots} from './slots'
import ValidationAnimationContainer from '../_ValidationAnimationContainer'
import {get} from '../constants'
import FormControlLeadingVisual from './_FormControlLeadingVisual'

export interface Props {
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
   * Changes the layout of the form control
   */
  variant?: 'stack' | 'choice' // TODO: come up with a better name for 'stack'
}

type FormControlValidationProps = ComponentProps<typeof FormControlValidation>
export interface FormControlContext extends Pick<Props, 'disabled' | 'id' | 'required'> {
  captionId: string
  validationMessageId: string
}

const FormControl = ({children, disabled, id: idProp, required, variant = 'stack'}: Props) => {
  const expectedInputComponents = [Autocomplete, Checkbox, Radio, Select, TextInput, TextInputWithTokens, Textarea]
  const id = useSSRSafeId(idProp)
  const validationChild = React.Children.toArray(children).find(child =>
    React.isValidElement<FormControlValidationProps>(child) && child.type === FormControlValidation ? child : null
  )
  const captionChildren: React.ReactElement[] | undefined | null = React.Children.map(children, child =>
    React.isValidElement(child) && child.type === FormControlCaption ? child : null
  )?.filter(Boolean)
  const labelChild: React.ReactNode | undefined | null = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === FormControlLabel
  )
  const validationMessageId = validationChild ? `${id}-validationMsg` : ''
  const validationStatus = React.isValidElement(validationChild) ? validationChild.props.appearance : undefined
  const captionId = captionChildren?.length ? `${id}-caption` : undefined
  const InputComponent = React.Children.toArray(children).find(child =>
    expectedInputComponents.some(inputComponent => React.isValidElement(child) && child.type === inputComponent)
  )
  const inputProps = React.isValidElement(InputComponent) ? InputComponent.props : undefined

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

  if (variant === 'choice') {
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
    // TODO: reconsider if we even need this check. The UI will just look like something is wrong
    if (React.isValidElement(InputComponent) && (InputComponent.type === Checkbox || InputComponent.type === Radio)) {
      // eslint-disable-next-line no-console
      console.warn('The Checkbox or Radio components are only intended to be used with the "choice" variant')
    }

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

        return variant === 'choice' ? (
          <Box display="flex" alignItems={slots.LeadingVisual ? 'center' : undefined}>
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
            display="flex"
            flexDirection="column"
            width="100%"
            sx={isLabelHidden ? {'> *:not(label) + *': {marginTop: 2}} : {'> * + *': {marginTop: 2}}}
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
            {validationChild && (
              <ValidationAnimationContainer show>
                <InputValidation validationStatus={validationStatus} id={validationMessageId}>
                  {slots.Validation}
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

FormControl.defaultProps = {
  variant: 'stack'
}

export type FormControlComponentProps = ComponentProps<typeof FormControl>
export default Object.assign(FormControl, {
  Caption: FormControlCaption,
  Label: FormControlLabel,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation
})
