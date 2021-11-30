import React, {HTMLProps} from 'react'
import {ComponentProps} from './utils/types'
import InputField, {InputFieldContext} from './_InputField/InputField'
import {Slot} from './_InputField/slots'
import ToggleInputField from './_InputField/ToggleInputField'
import ToggleInputLeadingVisual from './_InputField/ToggleInputLeadingVisual'

// TODO: use Primer's checkbox input once it's available
// https://github.com/github/primer/issues/489
const RadioInput: React.FC<HTMLProps<HTMLInputElement>> = props => {
  return <input type="radio" {...props} />
}

// pulling out `id`, `disabled`, and `required` because those should come from the parent TextInputField component
const Input: React.FC<HTMLProps<HTMLInputElement>> = ({
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
        <RadioInput aria-describedby={captionId} id={id} required={required} disabled={disabled} {...rest} />
      )}
    </Slot>
  )
}

const RadioInputField: React.FC<ComponentProps<typeof ToggleInputField>> = props => <ToggleInputField {...props} />

export default Object.assign(RadioInputField, {
  Input,
  Caption: InputField.Caption,
  Label: InputField.Label,
  LeadingVisual: ToggleInputLeadingVisual
})
