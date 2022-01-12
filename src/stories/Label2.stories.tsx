import React from 'react'
import {Meta} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'
import {BaseStyles, ThemeProvider} from '..'
import {ComponentProps} from '../utils/types'
import Label from '../Label2/Label2'

type Args = ComponentProps<typeof Label>

export default {
  // TODO: update story nesting
  title: 'Label/Label',
  component: Label,
  argTypes: {
    appearance: {
      defaultValue: 'default'
    },
    size: {
      defaultValue: 'md'
    },
    filled: {
      defaultValue: false
    }
  },
  parameters: {controls: {exclude: ['leadingVisual']}},
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

export const label = (args: Args) => <Label {...args}>Label</Label>
export const labelWithLeadingVisual = (args: Args) => (
  <Label {...args} leadingVisual={MarkGithubIcon}>
    Label
  </Label>
)
labelWithLeadingVisual.storyName = 'Label with leadingVisual'
