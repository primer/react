import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Label from '../Label'

export default {
  title: 'Components/Label',
  component: Label,
  args: {
    variant: 'default',
    size: 'small',
  },
  argTypes: {
    ref: {
      control: false,
      table: {
        disable: true,
      },
    },
    as: {
      control: false,
      table: {
        disable: true,
      },
    },
    theme: {
      control: false,
      table: {
        disable: true,
      },
    },
    forwardedAs: {
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
  },
} as Meta<ComponentProps<typeof Label>>

export const Playground: Story<ComponentProps<typeof Label>> = args => <Label {...args}>Label</Label>
