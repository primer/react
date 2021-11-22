import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {TextInput, TextInputProps, TextInputWithTokens, TextInputWithTokensProps} from '.'
import InputField, {InputFieldContext} from './_InputField/InputField'
import {Slot} from './_InputField/slots'

const Input = React.forwardRef(({as: Component = TextInput, ...rest}, ref) => (
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
)) as PolymorphicForwardRefComponent<
  typeof TextInput | typeof TextInputWithTokens,
  TextInputProps | TextInputWithTokensProps
>

export default Object.assign(InputField, {
  Input,
  Caption: InputField.Caption,
  Label: InputField.Label,
  Validation: InputField.Validation
})
