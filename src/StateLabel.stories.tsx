import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from './utils/types'
import StateLabel from './StateLabel'

export default {
  title: 'Components/StateLabel',
  component: StateLabel,
} as Meta<ComponentProps<typeof StateLabel>>

export const Playground: Story<ComponentProps<typeof StateLabel>> = args => <StateLabel {...args}>State</StateLabel>

Playground.args = {
  variant: 'normal',
  status: 'issueOpened',
}
Playground.argTypes = {
  ref: {
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
  sx: {
    control: false,
    table: {
      disable: true,
    },
  },
}

export const Default = () => <StateLabel status="issueOpened">Open</StateLabel>
