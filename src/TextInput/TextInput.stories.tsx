import React, {useState} from 'react'
import {Meta} from '@storybook/react'
import {Box, FormControl} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {
  FormControlArgs,
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputExcludedControlKeys,
} from '../utils/story-helpers'

export default {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
} as Meta

export const Playground = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" maxWidth={200}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
Playground.args = {
  ...formControlArgs,
  type: 'text',
  onChange: () => {},
}
Playground.argTypes = {
  type: {
    control: {
      type: 'text',
    },
  },
  ...getTextInputArgTypes(),
  ...formControlArgTypes,
}

export const Default = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
    </FormControl>
  </Box>
)
