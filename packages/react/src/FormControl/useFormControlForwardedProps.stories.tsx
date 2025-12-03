import type {Meta} from '@storybook/react-vite'
import {FormControl, useFormControlForwardedProps} from '..'

export default {
  title: 'Hooks/useFormControlForwardedProps',
  argTypes: {
    disabled: {
      type: 'boolean',
    },
    required: {
      type: 'boolean',
    },
    label: {
      type: 'string',
    },
    caption: {
      type: 'string',
    },
    type: {
      control: {
        type: 'select',
        description: "Type of the input, showing how the `type` prop can be forwarded to the input's props",
      },
      options: ['text', 'number', 'password', 'email', 'search', 'tel', 'url'],
    },
  },
} as Meta

interface ArgTypes {
  disabled: boolean
  required: boolean
  label: string
  caption: string
  type: string
}

/** A custom input that is not a Primer `TextInput` but still supports autowiring with `FormControl`. */
const CustomInput = (externalProps: {type: string}) => {
  const props = useFormControlForwardedProps(externalProps)
  return <input {...props} />
}

export const AutowiredCustomInput = ({
  label = 'Custom input',
  caption = 'This is not a Primer input, but it still has `aria-describedby` and similar attributes applied automatically',
  required = false,
  disabled = false,
  type = 'text',
}: ArgTypes) => (
  <FormControl disabled={disabled} required={required}>
    <FormControl.Label>{label}</FormControl.Label>
    <CustomInput type={type} />
    {caption && <FormControl.Caption>{caption}</FormControl.Caption>}
  </FormControl>
)
