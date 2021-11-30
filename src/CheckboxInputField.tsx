import React, {HTMLProps, Ref} from 'react'
import {Checkbox} from '.'
import InputField, {InputFieldContext} from './_InputField/InputField'
import {Slot} from './_InputField/slots'
import ToggleInputField, {ToggleInputFieldProps} from './_InputField/ToggleInputField'
import ToggleInputLeadingVisual from './_InputField/ToggleInputLeadingVisual'

const Input: React.FC<HTMLProps<HTMLInputElement> & {ref?: Ref<HTMLInputElement>}> = ({
  id: idProp,
  required: requiredProp,
  disabled: disabledProp,
  ...rest
}) => {
  if (idProp) {
    // eslint-disable-next-line no-console
    console.warn(
      "instead of passing the 'id' prop directly to <TextInputField.Input>, it should be passed to the parent component, <TextInputField>"
    )
  }
  if (disabledProp) {
    // eslint-disable-next-line no-console
    console.warn(
      "instead of passing the 'disabled' prop directly to <TextInputField.Input>, it should be passed to the parent component, <TextInputField>"
    )
  }
  if (requiredProp) {
    // eslint-disable-next-line no-console
    console.warn(
      "instead of passing the 'required' prop directly to <TextInputField.Input>, it should be passed to the parent component, <TextInputField>"
    )
  }
  return (
    <Slot name="Input">
      {({disabled, id, required, captionId}: InputFieldContext) => (
        <Checkbox aria-describedby={captionId} id={id} required={required} disabled={disabled} {...rest} />
      )}
    </Slot>
  )
}

const CheckboxInputField: React.FC<ToggleInputFieldProps> = props => <ToggleInputField {...props} />

export default Object.assign(CheckboxInputField, {
  Input,
  Caption: InputField.Caption,
  Label: InputField.Label,
  LeadingVisual: ToggleInputLeadingVisual
})
