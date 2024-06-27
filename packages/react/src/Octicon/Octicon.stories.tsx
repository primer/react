import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import Octicon from './Octicon'
import {HeartFillIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Octicon',
  component: Octicon,
} as Meta<typeof Octicon>

export const Default = () => <Octicon icon={HeartFillIcon} size={32} />

export const Playground: StoryFn<typeof Octicon> = args => <Octicon icon={HeartFillIcon} {...args} />

Playground.args = {
  ariaLabel: 'Heart',
  size: 32,
}

Playground.argTypes = {
  size: {
    control: {
      type: 'number',
    },
  },
  verticalAlign: {
    type: 'string',
  },
  icon: {
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
  as: {
    controls: false,
    table: {
      disable: true,
    },
  },
  forwardedAs: {
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
