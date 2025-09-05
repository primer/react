import type {Meta, StoryFn} from '@storybook/react-vite'
import CircleBadge from './CircleBadge'
import {ZapIcon} from '@primer/octicons-react'

const meta: Meta<typeof CircleBadge> = {
  title: 'Deprecated/Components/CircleBadge',
  component: CircleBadge,
}
export default meta

export const Default = () => (
  <CircleBadge>
    <CircleBadge.Icon icon={ZapIcon} aria-label="User badge" />
  </CircleBadge>
)

export const Playground: StoryFn<typeof CircleBadge> = ({'CircleBadge.Icon aria-label': iconAriaLabel, args}) => (
  <CircleBadge {...args}>
    <CircleBadge.Icon icon={ZapIcon} aria-label={iconAriaLabel} />
  </CircleBadge>
)

Playground.args = {
  variant: 'medium',
  size: null,
  inline: false,
  as: 'div',
  'CircleBadge.Icon aria-label': undefined,
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
  'CircleBadge.Icon aria-label': {
    type: 'string',
  },
}
