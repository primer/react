import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider} from '..'
import {ComponentProps} from '../utils/types'
import Label from '../Label'

type Args = ComponentProps<typeof Label>

export default {
  title: 'Components/Label',
  component: Label,
  args: {
    variant: 'default',
    size: 'large'
  },
  argTypes: {
    variant: {
      control: {
        type: 'select'
      },
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
      ]
    },
    size: {
      control: {
        type: 'radio'
      },
      options: ['small', 'large']
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
