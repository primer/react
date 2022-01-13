import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import {ComponentProps} from '../utils/types'
import Label from '../Label2/Label2'

type Args = ComponentProps<typeof Label>

export default {
  // TODO: update story nesting
  title: 'Labels/Label',
  component: Label,
  argTypes: {
    scheme: {
      defaultValue: 'default',
      control: {
        options: [
          'default',
          'primary',
          'secondary',
          'accent',
          'success',
          'attention',
          'severe',
          'danger',
          'done',
          'sponsors'
        ],
        type: 'select'
      }
    },
    size: {
      defaultValue: 'medium',
      control: {
        options: ['small', 'medium', 'large'],
        type: 'radio'
      }
    },
    filled: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  },
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
