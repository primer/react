import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import TextInputField from '../TextInputField'
import {ComponentProps} from '../utils/types'
import RadioInputField from '../RadioInputField'
import {MarkGithubIcon} from '@primer/octicons-react'

type Args = ComponentProps<typeof TextInputField>

export default {
  title: 'Forms/RadioInputField',
  component: RadioInputField,
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
  <RadioInputField {...args}>
    <RadioInputField.Label>Selectable choice</RadioInputField.Label>
    <RadioInputField.Input />
  </RadioInputField>
)

export const WithLeadingVisual = (args: Args) => (
  <RadioInputField {...args}>
    <RadioInputField.Label>Selectable choice</RadioInputField.Label>
    <RadioInputField.LeadingVisual>
      <MarkGithubIcon />
    </RadioInputField.LeadingVisual>
    <RadioInputField.Input />
  </RadioInputField>
)
WithLeadingVisual.storyName = 'With LeadingVisual'

export const WithCaption = (args: Args) => (
  <RadioInputField {...args}>
    <RadioInputField.Label>Selectable choice</RadioInputField.Label>
    <RadioInputField.Input />
    <RadioInputField.Caption>This is an arbitrary choice</RadioInputField.Caption>
  </RadioInputField>
)

export const WithCaptionAndLeadingVisual = (args: Args) => (
  <RadioInputField {...args}>
    <RadioInputField.Label>Selectable choice</RadioInputField.Label>
    <RadioInputField.LeadingVisual>
      <MarkGithubIcon />
    </RadioInputField.LeadingVisual>
    <RadioInputField.Input />
    <RadioInputField.Caption>This is an arbitrary choice</RadioInputField.Caption>
  </RadioInputField>
)
WithCaptionAndLeadingVisual.storyName = 'With Caption and LeadingVisual'
