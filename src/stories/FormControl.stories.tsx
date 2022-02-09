import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Checkbox, Radio, Select, TextInput, TextInputWithTokens, ThemeProvider} from '..'
import FormControl from '../FormControl'
import {ComponentProps} from '../utils/types'
import Autocomplete from '../Autocomplete'
import {MarkGithubIcon} from '@primer/octicons-react'

type Args = ComponentProps<typeof FormControl>

export default {
  title: 'Forms/FormControl',
  component: FormControl,
  argTypes: {
    required: {
      defaultValue: false
    },
    disabled: {
      defaultValue: false
    }
  },
  parameters: {controls: {exclude: ['id']}},
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

export const TextInputFormControl = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Name</FormControl.Label>
    <TextInput />
  </FormControl>
)

export const WithAVisuallyHiddenLabel = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label visuallyHidden>Name</FormControl.Label>
    <TextInput />
  </FormControl>
)

export const WithCaption = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Name</FormControl.Label>
    <TextInput />
    <FormControl.Caption>Hint: your first name</FormControl.Caption>
  </FormControl>
)
export const WithValidation = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Name</FormControl.Label>
    <TextInput />
    <FormControl.Validation variant="error">Your first name cannot contain spaces</FormControl.Validation>
  </FormControl>
)
WithValidation.parameters = {controls: {exclude: ['id']}}

export const WithValidationAndCaption = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Name</FormControl.Label>
    <TextInput />
    <FormControl.Validation variant="error">Your first name cannot contain spaces</FormControl.Validation>
    <FormControl.Caption>Hint: your first name</FormControl.Caption>
  </FormControl>
)
WithValidationAndCaption.parameters = {controls: {exclude: ['id']}}

export const UsingAutocompleteInput = (args: Args) => {
  return (
    <FormControl {...args}>
      <FormControl.Label>Tags</FormControl.Label>
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
    </FormControl>
  )
}

export const UsingTextInputWithTokens = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Tags</FormControl.Label>
    <TextInputWithTokens
      tokens={[
        {text: 'css', id: 0},
        {text: 'css-in-js', id: 1},
        {text: 'styled-system', id: 2}
      ]}
    />
  </FormControl>
)

export const UsingSelectInput = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Preferred Primer component interface</FormControl.Label>
    <Select>
      <Select.Option value="figma">Figma</Select.Option>
      <Select.Option value="css">Primer CSS</Select.Option>
      <Select.Option value="prc">Primer React components</Select.Option>
      <Select.Option value="pvc">Primer ViewComponents</Select.Option>
    </Select>
  </FormControl>
)

UsingTextInputWithTokens.storyName = 'Using TextInputWithTokens Input'

export const UsingCheckboxInput = (args: Args) => (
  <FormControl {...args}>
    <Checkbox />
    <FormControl.Label>Selectable choice</FormControl.Label>
  </FormControl>
)

export const UsingRadioInput = (args: Args) => (
  <FormControl {...args}>
    <Radio name="radioInput" value="choice" />
    <FormControl.Label>Selectable choice</FormControl.Label>
  </FormControl>
)

export const WithLeadingVisual = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Selectable choice</FormControl.Label>
    <FormControl.LeadingVisual>
      <MarkGithubIcon />
    </FormControl.LeadingVisual>
    <Checkbox />
  </FormControl>
)
WithLeadingVisual.storyName = 'With LeadingVisual'

export const WithCaptionAndLeadingVisual = (args: Args) => (
  <FormControl {...args}>
    <FormControl.Label>Selectable choice</FormControl.Label>
    <FormControl.LeadingVisual>
      <MarkGithubIcon />
    </FormControl.LeadingVisual>
    <Checkbox />
    <FormControl.Caption>This is an arbitrary choice</FormControl.Caption>
  </FormControl>
)
WithCaptionAndLeadingVisual.storyName = 'With Caption and LeadingVisual'
