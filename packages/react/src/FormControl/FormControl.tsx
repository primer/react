import {clsx} from 'clsx'
import React, {useContext} from 'react'
import Autocomplete from '../Autocomplete'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import Select from '../Select/Select'
import {SelectPanel} from '../SelectPanel'
import TextInput from '../TextInput'
import TextInputWithTokens from '../TextInputWithTokens'
import Textarea from '../Textarea'
import Box from '../Box'
import {CheckboxOrRadioGroupContext} from '../internal/components/CheckboxOrRadioGroup'
import ValidationAnimationContainer from '../internal/components/ValidationAnimationContainer'
import {useSlots} from '../hooks/useSlots'
import type {SxProp} from '../sx'
import {useId} from '../hooks/useId'
import {FormControlCaption} from './FormControlCaption'
import FormControlLabel from './FormControlLabel'
import FormControlLeadingVisual from './FormControlLeadingVisual'
import FormControlValidation from './_FormControlValidation'
import {FormControlContextProvider} from './_FormControlContext'
import {warning} from '../utils/warning'
import styled from 'styled-components'
import sx from '../sx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {cssModulesFlag} from './feature-flags'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './FormControl.module.css'

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
  /**
   * The direction the content flows.
   * Vertical layout is used by default, and horizontal layout is used for checkbox and radio inputs.
   */
  layout?: 'horizontal' | 'vertical'
  className?: string
} & SxProp

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({children, disabled: disabledProp, layout = 'vertical', id: idProp, required, sx, className}, ref) => {
    const enabled = useFeatureFlag(cssModulesFlag)
    const [slots, childrenWithoutSlots] = useSlots(children, {
      caption: FormControlCaption,
      label: FormControlLabel,
      leadingVisual: FormControlLeadingVisual,
      validation: FormControlValidation,
    })
    const expectedInputComponents = [
      Autocomplete,
      Checkbox,
      Radio,
      Select,
      TextInput,
      TextInputWithTokens,
      Textarea,
      SelectPanel,
    ]
    const choiceGroupContext = useContext(CheckboxOrRadioGroupContext)
    const disabled = choiceGroupContext.disabled || disabledProp
    const id = useId(idProp)
    const validationMessageId = slots.validation ? `${id}-validationMessage` : undefined
    const captionId = slots.caption ? `${id}-caption` : undefined
    const validationStatus = slots.validation?.props.variant
    const InputComponent = childrenWithoutSlots.find(child =>
      expectedInputComponents.some(inputComponent => React.isValidElement(child) && child.type === inputComponent),
    )
    const inputProps = React.isValidElement(InputComponent) && InputComponent.props
    const isChoiceInput =
      React.isValidElement(InputComponent) && (InputComponent.type === Checkbox || InputComponent.type === Radio)
    const isRadioInput = React.isValidElement(InputComponent) && InputComponent.type === Radio

    if (InputComponent) {
      warning(
        inputProps?.id,
        `instead of passing the 'id' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
      )
      warning(
        inputProps?.disabled,
        `instead of passing the 'disabled' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
      )
      warning(
        inputProps?.required,
        `instead of passing the 'required' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
      )
    }

    if (!slots.label) {
      // eslint-disable-next-line no-console
      console.error(
        `The input field with the id ${id} MUST have a FormControl.Label child.\n\nIf you want to hide the label, pass the 'visuallyHidden' prop to the FormControl.Label component.`,
      )
    }

    if (isChoiceInput) {
      warning(
        !!slots.validation,
        'Validation messages are not rendered for an individual checkbox or radio. The validation message should be shown for all options.',
      )

      warning(
        isRadioInput && childrenWithoutSlots.find(child => React.isValidElement(child) && child.props?.required),
        'An individual radio cannot be a required field.',
      )
    } else {
      warning(
        !!slots.leadingVisual,
        'A leading visual is only rendered for a checkbox or radio form control. If you want to render a leading visual inside of your input, check if your input supports a leading visual.',
      )
    }

    const isLabelHidden = slots.label?.props.visuallyHidden

    return (
      <FormControlContextProvider
        value={{
          captionId,
          disabled,
          id,
          required,
          validationMessageId,
        }}
      >
        {isChoiceInput || layout === 'horizontal' ? (
          <StyledHorizontalLayout
            ref={ref}
            data-has-leading-visual={slots.leadingVisual ? '' : undefined}
            sx={sx}
            className={clsx(className, {
              [classes.ControlHorizontalLayout]: enabled,
            })}
          >
            <StyledChoiceInputs className={classes.ControlChoiceInputs}>
              {React.isValidElement(InputComponent)
                ? React.cloneElement(
                    InputComponent as React.ReactElement<{
                      id: string
                      disabled: boolean
                      required: boolean
                      ['aria-describedby']: string
                    }>,
                    {
                      id,
                      disabled,
                      // allow checkboxes to be required
                      required: required && !isRadioInput,
                      ['aria-describedby']: captionId as string,
                    },
                  )
                : null}
              {childrenWithoutSlots.filter(
                child =>
                  React.isValidElement(child) &&
                  ![Checkbox, Radio].some(inputComponent => child.type === inputComponent),
              )}
            </StyledChoiceInputs>
            {slots.leadingVisual ? (
              <StyledLeadingVisual
                className={clsx({
                  [classes.LeadingVisual]: enabled,
                })}
                data-disabled={disabled ? '' : undefined}
                data-has-caption={slots.caption ? '' : undefined}
              >
                {slots.leadingVisual}
              </StyledLeadingVisual>
            ) : null}
            <StyledLabelContainer className={classes.LabelContainer}>
              {slots.label}
              {slots.caption}
            </StyledLabelContainer>
          </StyledHorizontalLayout>
        ) : (
          <Box
            ref={ref}
            data-has-label={!isLabelHidden ? '' : undefined}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            sx={
              enabled
                ? sx
                : {...(isLabelHidden ? {'> *:not(label) + *': {marginTop: 1}} : {'> * + *': {marginTop: 1}}), ...sx}
            }
            className={clsx(className, {
              [classes.ControlVerticalLayout]: enabled,
            })}
          >
            {slots.label}
            {React.isValidElement(InputComponent) &&
              React.cloneElement(
                InputComponent,
                Object.assign(
                  {
                    id,
                    required,
                    disabled,
                    validationStatus,
                    ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
                  },
                  InputComponent.props,
                ),
              )}
            {childrenWithoutSlots.filter(
              child =>
                React.isValidElement(child) &&
                !expectedInputComponents.some(inputComponent => child.type === inputComponent),
            )}
            {slots.validation ? (
              <ValidationAnimationContainer show>{slots.validation}</ValidationAnimationContainer>
            ) : null}
            {slots.caption}
          </Box>
        )}
      </FormControlContextProvider>
    )
  },
)

const StyledHorizontalLayout = toggleStyledComponent(
  cssModulesFlag,
  'div',
  styled.div`
    display: flex;

    &:where([data-has-leading-visual]) {
      align-items: center;
    }

    ${sx}
  `,
)

const StyledChoiceInputs = toggleStyledComponent(
  cssModulesFlag,
  'div',
  styled.div`
    > input {
      margin-left: 0;
      margin-right: 0;
    }
  `,
)

const StyledLabelContainer = toggleStyledComponent(
  cssModulesFlag,
  'div',
  styled.div`
    > * {
      padding-left: var(--stack-gap-condensed);
    }

    > label {
      font-weight: var(--base-text-weight-normal);
    }
  `,
)

const StyledLeadingVisual = toggleStyledComponent(
  cssModulesFlag,
  'div',
  styled.div`
    color: var(--fgColor-default);
    margin-left: var(--base-size-8);

    &:where([data-disabled]) {
      color: var(--fgColor-muted);
    }

    > * {
      fill: currentColor;
      min-width: var(--text-body-size-large);
      min-height: var(--text-body-size-large);
    }

    > *:where([data-has-caption]) {
      min-width: var(--base-size-24);
      min-height: var(--base-size-24);
    }
  `,
)

export default Object.assign(FormControl, {
  Caption: FormControlCaption,
  Label: FormControlLabel,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation,
})
