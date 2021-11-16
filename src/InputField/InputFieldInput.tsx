import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {InputFieldContext, Slot} from './InputField'
import {TextInput} from '..'

export interface Props {
  // TODO: pass a generic to `React.ReactElement` to limit to children that accept certain props (e.g.: `validationStatus`)
  children?: React.ReactElement
}

const InputFieldInput = React.forwardRef(({as: Component = TextInput, ...rest}, ref) => {
  return (
    <Slot name="Input">
      {({disabled, id, required, validationStatus, validationMessageId, captionId}: InputFieldContext) => (
        <Component
          ref={ref}
          aria-describedby={[validationMessageId, captionId].filter(Boolean).join(' ')}
          id={id}
          required={required}
          validationStatus={validationStatus}
          disabled={disabled}
          {...rest}
        />
      )}
    </Slot>
  )
  // TODO: support more than just `<input />`
  // e.g.: `<select />`, `<textarea />`
}) as PolymorphicForwardRefComponent<'input', Props>

export default InputFieldInput
