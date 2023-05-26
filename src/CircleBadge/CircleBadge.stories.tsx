import {ZapIcon} from '@primer/octicons-react'
import {ComponentStory, Meta} from '@storybook/react'
import React from 'react'
import CircleBadge from './CircleBadge'

export default {
  title: 'Components/CircleBadge',
  component: CircleBadge,
} as Meta<typeof CircleBadge>

export const Default = () => (
  <CircleBadge>
    <CircleBadge.Icon icon={ZapIcon} />
  </CircleBadge>
)

export const Playground: ComponentStory<typeof CircleBadge> = args => (
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
