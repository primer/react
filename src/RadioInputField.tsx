import React, {HTMLProps} from 'react'
import InputField, {InputFieldContext} from './_InputField/InputField'
import {Slot} from './_InputField/slots'
import ToggleInputField from './_InputField/ToggleInputField'
import ToggleInputLeadingVisual from './_InputField/ToggleInputLeadingVisual'

// TODO: use Primer's checkbox input once it's available
// https://github.com/github/primer/issues/489
const RadioInput: React.FC<HTMLProps<HTMLInputElement>> = props => {
  return <input type="radio" {...props} />
}

const Input: React.FC<HTMLProps<HTMLInputElement>> = props => (
  <Slot name="Input">
    {({disabled, id, required, captionId}: InputFieldContext) => (
      <RadioInput aria-describedby={captionId} id={id} required={required} disabled={disabled} {...props} />
    )}
  </Slot>
)

export default Object.assign(ToggleInputField, {
  Input,
  Caption: InputField.Caption,
  Label: InputField.Label,
  Validation: InputField.Validation,
  LeadingVisual: ToggleInputLeadingVisual
})
