import React from 'react'
import type {StoryFn, Meta} from '@storybook/react'
import Heading from './Heading'

export default {
  title: 'Components/Heading',
  component: Heading,
} as Meta<typeof Heading>
export const Default: StoryFn<typeof Heading> = () => <Heading>Default H2 Heading</Heading>

export const Playground: StoryFn<typeof Heading> = args => <Heading {...args}>Heading</Heading>

Playground.args = {
  as: 'h2',
}

Playground.argTypes = {
  as: {
    control: {
      type: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
}
