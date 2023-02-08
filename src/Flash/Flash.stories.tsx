import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Flash from './Flash'

export default {
  title: 'Components/Flash',
  component: Flash,
} as Meta<ComponentProps<typeof Flash>>

export const Default = () => <Flash>Default</Flash>

export const Playground: Story<ComponentProps<typeof Flash>> = args => <Flash {...args}>Default</Flash>

Playground.args = {
  variant: 'default',
}

Playground.argTypes = {
  ref: {
    controls: false,
    table: {
      disable: true,
    },
  },
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
  theme: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
