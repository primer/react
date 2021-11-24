import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {TextInput, TextInputProps} from '.'
import InputField, {InputFieldContext} from './_InputField/InputField'
import {Slot} from './_InputField/slots'

const Input = React.forwardRef(
  ({as: Component = TextInput, id: idProp, required: requiredProp, disabled: disabledProp, ...rest}, ref) => {
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
        {({disabled, id, required, validationMessageId, captionId}: InputFieldContext) => (
          <Component
            ref={ref}
            aria-describedby={[validationMessageId, captionId].filter(Boolean).join(' ')}
            id={id}
            required={required}
            disabled={disabled}
            {...rest}
          />
        )}
      </Slot>
    )
  }
) as PolymorphicForwardRefComponent<typeof TextInput, TextInputProps>

export default Object.assign(InputField, {
  Input,
  Caption: InputField.Caption,
  Label: InputField.Label,
  Validation: InputField.Validation
})
