import React from 'react'
import {Story, Meta} from '@storybook/react'
import {Button} from '.'

export default {
  title: 'Drafts/Components/Button',
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    variant: {
      control: {
        type: 'radio',
        options: ['default', 'primary', 'danger', 'invisible', 'outline'],
      },
    },
    alignContent: {
      control: {
        type: 'radio',
        options: ['center', 'start'],
      },
    },
    block: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    block: false,
    size: 'medium',
    disabled: false,
    variant: 'default',
    alignContent: 'center',
  },
} as Meta<typeof Button>

export const Playground: Story<typeof Button> = args => <Button {...args}>Default</Button>

export const Default = () => <Button>Default</Button>
