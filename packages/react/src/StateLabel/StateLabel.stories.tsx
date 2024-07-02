import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import StateLabel from './StateLabel'

const meta = {
  title: 'Components/StateLabel',
  component: StateLabel,
} satisfies Meta<ComponentProps<typeof StateLabel>>

export default meta

export const Default = () => <StateLabel status="issueOpened">Open</StateLabel>

export const Playground: StoryFn<ComponentProps<typeof StateLabel>> = args => <StateLabel {...args}>Label</StateLabel>

Playground.args = {
  status: 'issueOpened',
}

Playground.argTypes = {
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
