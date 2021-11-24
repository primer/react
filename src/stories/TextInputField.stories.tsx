import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, TextInputWithTokens, ThemeProvider} from '..'
import TextInputField from '../TextInputField'
import {ComponentProps} from '../utils/types'
import Autocomplete from '../Autocomplete'

type Args = ComponentProps<typeof TextInputField>

export default {
  title: 'Forms/TextInputField',
  component: TextInputField,
  argTypes: {
    required: {
      defaultValue: false
    },
    disabled: {
      defaultValue: false
    },
    validationResult: {
      options: ['noSpaces', 'validName'],
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

export const Default = (args: Args) => (
  <TextInputField {...args}>
    <TextInputField.Label>Name</TextInputField.Label>
    <TextInputField.Input />
  </TextInputField>
)

export const WithAVisuallyHiddenLabel = (args: Args) => (
  <TextInputField {...args}>
    <TextInputField.Label visuallyHidden>Name</TextInputField.Label>
    <TextInputField.Input />
  </TextInputField>
)

export const WithCaption = (args: Args) => (
  <TextInputField {...args}>
    <TextInputField.Label>Name</TextInputField.Label>
    <TextInputField.Input />
    <TextInputField.Caption>Hint: your first name</TextInputField.Caption>
  </TextInputField>
)
export const WithValidation = (args: Args) => (
  <TextInputField {...args}>
    <TextInputField.Label>Name</TextInputField.Label>
    <TextInputField.Input />
    <TextInputField.Validation validationKey="noSpaces">
      Your first name cannot contain spaces
    </TextInputField.Validation>
    <TextInputField.Validation validationKey="validName">This name is valid</TextInputField.Validation>
  </TextInputField>
)
WithValidation.parameters = {controls: {exclude: ['id']}}

export const WithValidationAndCaption = (args: Args) => (
  <TextInputField {...args}>
    <TextInputField.Label>Name</TextInputField.Label>
    <TextInputField.Input />
    <TextInputField.Validation validationKey="noSpaces">
      Your first name cannot contain spaces
    </TextInputField.Validation>
    <TextInputField.Validation validationKey="validName">This name is valid</TextInputField.Validation>
    <TextInputField.Caption>Hint: your first name</TextInputField.Caption>
  </TextInputField>
)
WithValidationAndCaption.parameters = {controls: {exclude: ['id']}}

export const UsingAutocompleteInput = (args: Args) => {
  const items = [
    {text: 'css', id: 0},
    {text: 'css-in-js', id: 1},
    {text: 'styled-system', id: 2},
    {text: 'javascript', id: 3},
    {text: 'typescript', id: 4},
    {text: 'react', id: 5},
    {text: 'design-systems', id: 6}
  ]
  const AutocompleteInput: React.FC = () => (
    <Autocomplete>
      <Autocomplete.Input block />
      <Autocomplete.Overlay>
        <Autocomplete.Menu items={items} selectedItemIds={[]} />
      </Autocomplete.Overlay>
    </Autocomplete>
  )

  return (
    <TextInputField {...args}>
      <TextInputField.Label>Tags</TextInputField.Label>
      <TextInputField.Input as={AutocompleteInput} />
    </TextInputField>
  )
}

export const UsingTextInputWithTokens = (args: Args) => (
  <TextInputField {...args}>
    <TextInputField.Label>Tags</TextInputField.Label>
    <TextInputField.Input
      as={TextInputWithTokens}
      tokens={[
        {text: 'css', id: 0},
        {text: 'css-in-js', id: 1},
        {text: 'styled-system', id: 2}
      ]}
    />
  </TextInputField>
)

UsingTextInputWithTokens.storyName = 'Using TextInputWithTokens'
