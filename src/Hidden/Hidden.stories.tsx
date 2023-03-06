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
    when: ['narrow'],
  },
  argTypes: {
    when: {
      type: {
        name: 'enum',
        value: ['narrow', 'regular', 'wide'],
      },
      control: {type: 'multi-select'},
      description: 'The viewport type where the content is hidden.',
    },
  },
} as ComponentMeta<typeof Hidden>

export const Default = () => (
  <Hidden when="narrow">The content is visible when the viewport is regular or wide but hidden when narrow</Hidden>
)

export const Playground: ComponentStory<typeof Hidden> = args => (
  <Hidden {...args}>The content is hidden when the viewport is {Array(args.when).join(',')}</Hidden>
)
