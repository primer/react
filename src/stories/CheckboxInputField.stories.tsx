import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import TextInputField from '../TextInputField'
import {ComponentProps} from '../utils/types'
import CheckboxInputField from '../CheckboxInputField'
import {MarkGithubIcon} from '@primer/octicons-react'

type Args = ComponentProps<typeof TextInputField>

export default {
  title: 'Forms/CheckboxInputField',
  component: CheckboxInputField,
  argTypes: {
    disabled: {
      defaultValue: false
    }
  },
  parameters: {controls: {exclude: ['id', 'validationStatus']}},
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
  <CheckboxInputField {...args}>
    <CheckboxInputField.Label>Selectable choice</CheckboxInputField.Label>
    <CheckboxInputField.Input />
  </CheckboxInputField>
)

export const WithLeadingVisual = (args: Args) => (
  <CheckboxInputField {...args}>
    <CheckboxInputField.Label>Selectable choice</CheckboxInputField.Label>
    <CheckboxInputField.LeadingVisual>
      <MarkGithubIcon />
    </CheckboxInputField.LeadingVisual>
    <CheckboxInputField.Input />
  </CheckboxInputField>
)
WithLeadingVisual.storyName = 'With LeadingVisual'

export const WithCaption = (args: Args) => (
  <CheckboxInputField {...args}>
    <CheckboxInputField.Label>Selectable choice</CheckboxInputField.Label>
    <CheckboxInputField.Input />
    <CheckboxInputField.Caption>This is an arbitrary choice</CheckboxInputField.Caption>
  </CheckboxInputField>
)

export const WithCaptionAndLeadingVisual = (args: Args) => (
  <CheckboxInputField {...args}>
    <CheckboxInputField.Label>Selectable choice</CheckboxInputField.Label>
    <CheckboxInputField.LeadingVisual>
      <MarkGithubIcon />
    </CheckboxInputField.LeadingVisual>
    <CheckboxInputField.Input />
    <CheckboxInputField.Caption>This is an arbitrary choice</CheckboxInputField.Caption>
  </CheckboxInputField>
)
WithCaptionAndLeadingVisual.storyName = 'With Caption and LeadingVisual'
