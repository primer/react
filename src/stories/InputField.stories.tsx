import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Select, TextInput, TextInputWithTokens, ThemeProvider} from '..'
import InputField from '../InputField'
import {ComponentProps} from '../utils/types'
import Autocomplete from '../Autocomplete'

type Args = ComponentProps<typeof InputField>

export default {
  title: 'Forms/InputField',
  component: InputField,
  argTypes: {
    required: {
      defaultValue: false
    },
    disabled: {
      defaultValue: false
    },
    validationResult: {
      options: ['noSpaces', 'validResult'],
      control: {type: 'radio'},
      defaultValue: 'noSpaces'
    },
    validationMap: {
      defaultValue: {
        noSpaces: 'error',
        validName: 'success'
      }
    }
  },
  parameters: {controls: {exclude: ['id', 'validationMap', 'validationResult']}},
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const TextInputField = (args: Args) => (
  <InputField {...args}>
    <InputField.Label>Name</InputField.Label>
    <TextInput />
  </InputField>
)

export const WithAVisuallyHiddenLabel = (args: Args) => (
  <InputField {...args}>
    <InputField.Label visuallyHidden>Name</InputField.Label>
    <TextInput />
  </InputField>
)

export const WithCaption = (args: Args) => (
  <InputField {...args}>
    <InputField.Label>Name</InputField.Label>
    <TextInput />
    <InputField.Caption>Hint: your first name</InputField.Caption>
  </InputField>
)
export const WithValidation = (args: Args) => (
  <InputField {...args}>
    <InputField.Label>Name</InputField.Label>
    <TextInput />
    <InputField.Validation validationKey="noSpaces">Your first name cannot contain spaces</InputField.Validation>
    <InputField.Validation validationKey="validName">This name is valid</InputField.Validation>
  </InputField>
)
WithValidation.parameters = {controls: {exclude: ['id']}}

export const WithValidationAndCaption = (args: Args) => (
  <InputField {...args}>
    <InputField.Label>Name</InputField.Label>
    <TextInput />
    <InputField.Validation validationKey="noSpaces">Your first name cannot contain spaces</InputField.Validation>
    <InputField.Validation validationKey="validName">This name is valid</InputField.Validation>
    <InputField.Caption>Hint: your first name</InputField.Caption>
  </InputField>
)
WithValidationAndCaption.parameters = {controls: {exclude: ['id']}}

export const UsingAutocompleteInput = (args: Args) => {
  return (
    <InputField {...args}>
      <InputField.Label>Tags</InputField.Label>
      <Autocomplete>
        <Autocomplete.Input block />
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            items={[
              {text: 'css', id: 0},
              {text: 'css-in-js', id: 1},
              {text: 'styled-system', id: 2},
              {text: 'javascript', id: 3},
              {text: 'typescript', id: 4},
              {text: 'react', id: 5},
              {text: 'design-systems', id: 6}
            ]}
            selectedItemIds={[]}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </InputField>
  )
}

export const UsingTextInputWithTokens = (args: Args) => (
  <InputField {...args}>
    <InputField.Label>Tags</InputField.Label>
    <TextInputWithTokens
      tokens={[
        {text: 'css', id: 0},
        {text: 'css-in-js', id: 1},
        {text: 'styled-system', id: 2}
      ]}
    />
  </InputField>
)

export const UsingSelectInput = (args: Args) => (
  <InputField {...args}>
    <InputField.Label>Preferred Primer component interface</InputField.Label>
    <Select>
      <Select.Option value="figma">Figma</Select.Option>
      <Select.Option value="css">Primer CSS</Select.Option>
      <Select.Option value="prc">Primer React components</Select.Option>
      <Select.Option value="pvc">Primer ViewComponents</Select.Option>
    </Select>
  </InputField>
)

UsingTextInputWithTokens.storyName = 'Using TextInputWithTokens Input'
