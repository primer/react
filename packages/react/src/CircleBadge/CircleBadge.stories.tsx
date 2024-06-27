import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import CircleBadge from './CircleBadge'
import {ZapIcon} from '@primer/octicons-react'

export default {
  title: 'Components/CircleBadge',
  component: CircleBadge,
} as Meta<typeof CircleBadge>

export const Default = () => (
  <CircleBadge>
    <CircleBadge.Icon icon={ZapIcon} />
  </CircleBadge>
)

export const Playground: StoryFn<typeof CircleBadge> = args => (
  <CircleBadge {...args}>
    <CircleBadge.Icon icon={ZapIcon} />
  </CircleBadge>
)

Playground.args = {
  variant: 'medium',
  size: null,
  inline: false,
  as: 'div',
}

Playground.argTypes = {
  variant: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  size: {
    control: {
      type: 'number',
    },
  },
  inline: {
    control: {
      type: 'boolean',
    },
  },
}
