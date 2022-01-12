import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import {ComponentProps} from '../utils/types'
import StateLabel from '../Label2/StateLabel2'

type Args = ComponentProps<typeof StateLabel>

export default {
  // TODO: update story nesting
  title: 'Label/StateLabel',
  component: StateLabel,
  argTypes: {
    status: {
      defaultValue: 'draft'
    },
    size: {
      defaultValue: 'md'
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

export const stateLabel = (args: Args) => <StateLabel {...args}>State Label</StateLabel>
