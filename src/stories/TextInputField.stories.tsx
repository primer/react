import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import TextInputField from '../TextInputField'
import {ComponentProps} from '../utils/types'

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

export const Default = (args: Args) => (
  <TextInputField {...args}>
    <TextInputField.Label>Name</TextInputField.Label>
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
