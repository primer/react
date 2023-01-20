import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'

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
} as ComponentMeta<typeof Hidden>

export const Playground: ComponentStory<typeof Hidden> = args => (
  <Hidden {...args}>The content is hidden on {Array(args.on).join(',')}</Hidden>
)
