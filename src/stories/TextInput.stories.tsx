import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider, FormControl} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {CheckIcon, XCircleFillIcon} from '@primer/octicons-react'
import {
  FormControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputExcludedControlKeys
} from '../utils/story-helpers'

export default {
  title: 'Forms/Form Controls/Text Input',
  component: TextInput,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box paddingTop={5}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
  argTypes: {
    type: {
      defaultValue: 'text',
      control: {
        type: 'text'
      }
    },
    ...getTextInputArgTypes(),
    ...formControlArgTypes
  }
} as Meta

export const Default = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}

export const WithLeadingVisual = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput leadingVisual={CheckIcon} value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput leadingVisual="$" value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}

export const WithTrailingIcon = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput trailingVisual={CheckIcon} value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput trailingVisual="minutes" value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}

export const WithTrailingAction = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput
          trailingAction={
            <TextInput.Action
              onClick={() => {
                setValue('')
              }}
              icon={XCircleFillIcon}
              aria-label="Clear input"
              sx={{color: 'fg.subtle'}}
            />
          }
          value={value}
          onChange={handleChange}
          {...args}
        />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
