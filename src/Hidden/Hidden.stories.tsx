import React from 'react'
import {StoryObj, Meta, StoryFn} from '@storybook/react'

import Hidden from '.'

export default {
  title: 'Drafts/Components/Hidden',
  parameters: {
    controls: {
      expanded: true,
    },
  },
  args: {
    on: ['regular'],
  },
  argTypes: {
    on: {
      type: {
        name: 'enum',
        value: ['narrow', 'regular', 'wide'],
      },
      control: {type: 'multi-select'},
      description: 'The viewport type to hide the content on.',
    },
  },
} as Meta<typeof Hidden>

export const Playground: StoryObj<typeof Hidden> = {
  render: args => <Hidden {...args}>The content is hidden on {Array(args.on).join(',')}</Hidden>,
}
