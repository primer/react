import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import Octicon from './Octicon'
import {HeartFillIcon} from '@primer/octicons-react'

const meta: Meta<typeof Octicon> = {
  title: 'Deprecated/Components/Octicon',
  component: Octicon,
}
export default meta

export const Default = () => <Octicon icon={HeartFillIcon} aria-label="Like" size={32} />

export const Playground: StoryFn<typeof Octicon> = ({'aria-label': ariaLabel, ...args}) => (
  <Octicon icon={HeartFillIcon} aria-label={ariaLabel ? ariaLabel : undefined} {...args} />
)

Playground.args = {
  'aria-label': 'Heart',
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
    control: {type: 'select'},
    options: ['middle', 'text-bottom', 'text-top', 'top', 'unset'],
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
