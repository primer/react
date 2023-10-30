import React from 'react'
import {Meta} from '@storybook/react'
import {
  BaseStyles,
  Checkbox,
  FormControl,
  TextInputWithTokens,
  ThemeProvider,
  theme,
  useFormControlForwardedProps,
} from '..'

export default {
  title: 'Components/FormControl',
  decorators: [
    Story => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
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
  },
} as Meta

interface ArgTypes {
  disabled: boolean
  required: boolean
  label: string
  caption: string
}
const mockTokens = [
  {text: 'zero', id: 0},
  {text: 'one', id: 1},
  {text: 'two', id: 2},
  {text: 'three', id: 3},
  {text: 'four', id: 4},
  {text: 'five', id: 5},
  {text: 'six', id: 6},
  {text: 'seven', id: 7},
  {text: 'twenty', id: 20},
  {text: 'twentyone', id: 21},
]

export const Playground = ({
  label = 'Input',
  caption = 'This is the caption',
  required = false,
  disabled = false,
}: ArgTypes) => (
  <FormControl disabled={disabled} required={required}>
    <FormControl.Label>{label}</FormControl.Label>
    {caption && <FormControl.Caption>{caption}</FormControl.Caption>}
    <Checkbox />

    <FormControl.Validation variant="error">Some error</FormControl.Validation>
    <TextInputWithTokens
      tokens={[
        {text: 'zero', id: 0},
        {text: 'one', id: 1},
        {text: 'two', id: 2},
      ]}
      onTokenRemove={() => true}
    />
  </FormControl>
)

export const Default = ({
  label = 'Input',
  caption = 'This is the caption',
  required = false,
  disabled = false,
}: ArgTypes) => (
  <FormControl disabled={disabled} required={required}>
    <FormControl.Label>{label}</FormControl.Label>
    {caption && <FormControl.Caption>{caption}</FormControl.Caption>}
    <Checkbox />

    <FormControl.Validation variant="error">Some error</FormControl.Validation>
    <TextInputWithTokens
      tokens={[
        {text: 'zero', id: 0},
        {text: 'one', id: 1},
        {text: 'two', id: 2},
      ]}
      onTokenRemove={() => true}
    />
  </FormControl>
)

// options: ['text', 'number', 'password', 'email', 'search', 'tel', 'url'],
