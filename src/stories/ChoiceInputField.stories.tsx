import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Checkbox, Radio, ThemeProvider} from '..'
import {ComponentProps} from '../utils/types'
import ChoiceInputField from '../ChoiceInputField'
import {MarkGithubIcon} from '@primer/octicons-react'

type Args = ComponentProps<typeof ChoiceInputField>

export default {
  title: 'Forms/ChoiceInputField',
  component: ChoiceInputField,
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

export const CheckboxInputField = (args: Args) => (
  <ChoiceInputField {...args}>
    <Checkbox />
    <ChoiceInputField.Label>Selectable choice</ChoiceInputField.Label>
  </ChoiceInputField>
)

export const RadioInputField = (args: Args) => (
  <ChoiceInputField {...args}>
    <Radio name="radioInput" value="choice" />
    <ChoiceInputField.Label>Selectable choice</ChoiceInputField.Label>
  </ChoiceInputField>
)

export const WithAVisuallyHiddenLabel = (args: Args) => (
  <ChoiceInputField {...args}>
    <ChoiceInputField.Label visuallyHidden>Selectable choice</ChoiceInputField.Label>
    <Checkbox />
  </ChoiceInputField>
)

export const WithLeadingVisual = (args: Args) => (
  <ChoiceInputField {...args}>
    <ChoiceInputField.Label>Selectable choice</ChoiceInputField.Label>
    <ChoiceInputField.LeadingVisual>
      <MarkGithubIcon />
    </ChoiceInputField.LeadingVisual>
    <Checkbox />
  </ChoiceInputField>
)
WithLeadingVisual.storyName = 'With LeadingVisual'

export const WithCaption = (args: Args) => (
  <ChoiceInputField {...args} id="testid">
    <ChoiceInputField.Label>Selectable choice</ChoiceInputField.Label>
    <Checkbox />
    <ChoiceInputField.Caption>This is an arbitrary choice</ChoiceInputField.Caption>
  </ChoiceInputField>
)

export const WithCaptionAndLeadingVisual = (args: Args) => (
  <ChoiceInputField {...args}>
    <ChoiceInputField.Label>Selectable choice</ChoiceInputField.Label>
    <ChoiceInputField.LeadingVisual>
      <MarkGithubIcon />
    </ChoiceInputField.LeadingVisual>
    <Checkbox />
    <ChoiceInputField.Caption>This is an arbitrary choice</ChoiceInputField.Caption>
  </ChoiceInputField>
)
WithCaptionAndLeadingVisual.storyName = 'With Caption and LeadingVisual'
