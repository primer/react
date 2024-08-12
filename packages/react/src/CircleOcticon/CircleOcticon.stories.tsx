import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import CircleOcticon from './CircleOcticon'
import {CheckIcon} from '@primer/octicons-react'

export default {
  title: 'Components/CircleOcticon',
  component: CircleOcticon,
} as Meta<typeof CircleOcticon>

export const Default = () => (
  <CircleOcticon icon={CheckIcon} size={32} sx={{backgroundColor: 'success.emphasis', color: 'fg.onEmphasis'}} />
)

export const Playground: StoryFn<typeof CircleOcticon> = args => <CircleOcticon {...args} />

Playground.args = {
  icon: CheckIcon,
  size: 32,
  sx: {backgroundColor: 'success.emphasis', color: 'fg.onEmphasis'},
}

Playground.argTypes = {
  icon: {
    controls: false,
    table: {
      disable: true,
    },
  },
  size: {
    controls: {
      type: 'number',
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
  ref: {
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
