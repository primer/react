import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Label from './Label'

export default {
  title: 'Components/Label',
  component: Label,
} as Meta<ComponentProps<typeof Label>>

export const Playground: StoryFn<ComponentProps<typeof Label>> = args => <Label {...args}>Label</Label>

Playground.args = {
  variant: 'default',
  size: 'small',
}
Playground.argTypes = {
  variant: {
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
      'sponsors',
    ],
    control: {type: 'inline-radio'},
  },
  size: {
    options: ['small', 'large'],
    control: {type: 'inline-radio'},
  },
  ref: {
    control: false,
    table: {
      disable: true,
    },
  },
  sx: {
    control: false,
    table: {
      disable: true,
    },
  },
}

export const Default = () => <Label>Default</Label>
