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
import classes from './FormControl.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import {getSlotName} from '../utils/get-slot-name'

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
  style?: React.CSSProperties
} & SxProp

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({children, disabled: disabledProp, layout = 'vertical', id: idProp, required, sx, className, style}, ref) => {
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
    const expectedInputSlots = [
      'Autocomplete',
      'Checkbox',
      'Radio',
      'Select',
      'TextInput',
      'TextInputWithTokens',
      'Textarea',
      'SelectPanel',
    ]
    const choiceGroupContext = useContext(CheckboxOrRadioGroupContext)
    const disabled = choiceGroupContext.disabled || disabledProp
    const id = useId(idProp)
    const validationMessageId = slots.validation ? `${id}-validationMessage` : undefined
    const captionId = slots.caption ? `${id}-caption` : undefined
    const validationStatus = slots.validation?.props.variant
    const InputComponent = childrenWithoutSlots.find(
      child =>
        expectedInputComponents.some(inputComponent => React.isValidElement(child) && child.type === inputComponent) ||
        expectedInputSlots.includes(getSlotName(child)),
    )
    const inputProps = React.isValidElement(InputComponent) && InputComponent.props
    const isChoiceInput =
      React.isValidElement(InputComponent) &&
      (InputComponent.type === Checkbox ||
        InputComponent.type === Radio ||
        getSlotName(InputComponent) === 'Checkbox' ||
        getSlotName(InputComponent) === 'Radio')
    const isRadioInput =
      React.isValidElement(InputComponent) && (InputComponent.type === Radio || getSlotName(InputComponent) === 'Radio')

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
    const InputChildren = (
      <>
        <div className={classes.ControlChoiceInputs}>
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
              ![Checkbox, Radio].some(inputComponent => child.type === inputComponent) &&
              !['Checkbox', 'Radio'].includes(getSlotName(child)),
          )}
        </div>
        {slots.leadingVisual ? (
          <div
            className={classes.LeadingVisual}
            data-disabled={disabled ? '' : undefined}
            data-has-caption={slots.caption ? '' : undefined}
          >
            {slots.leadingVisual}
          </div>
        ) : null}
        <div className={classes.LabelContainer}>
          {slots.label}
          {slots.caption}
        </div>
      </>
    )

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
          <BoxWithFallback
            ref={ref}
            data-has-leading-visual={slots.leadingVisual ? '' : undefined}
            sx={sx}
            className={clsx(className, classes.ControlHorizontalLayout)}
            style={style}
          >
            {InputChildren}
          </BoxWithFallback>
        ) : (
          <BoxWithFallback
            ref={ref}
            data-has-label={!isLabelHidden ? '' : undefined}
            sx={sx}
            className={clsx(className, classes.ControlVerticalLayout)}
            style={style}
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
                !expectedInputComponents.some(inputComponent => child.type === inputComponent) &&
                !expectedInputSlots.includes(getSlotName(child)),
            )}
            {slots.validation ? (
              <ValidationAnimationContainer show>{slots.validation}</ValidationAnimationContainer>
            ) : null}
            {slots.caption}
          </BoxWithFallback>
        )}
      </FormControlContextProvider>
    )
  },
)

// @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
FormControl.__SLOT__ = Symbol('FormControl')

export default Object.assign(FormControl, {
  Caption: FormControlCaption,
  Label: FormControlLabel,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation,
})
