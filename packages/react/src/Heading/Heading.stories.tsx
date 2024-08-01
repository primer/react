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
      type: 'radio',
    },
    options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['large', 'medium', 'small'],
  },
}

export const TestSx: StoryFn<typeof Heading> = () => (
  <Heading
    sx={{
      fontSize: 2,
      fontWeight: 'normal',
    }}
  >
    Heading with sx override
  </Heading>
)

export const Small: StoryFn<typeof Heading> = () => <Heading variant="small">Small heading</Heading>

export const Medium: StoryFn<typeof Heading> = () => <Heading variant="medium">Medium heading</Heading>

export const Large: StoryFn<typeof Heading> = () => <Heading variant="large">Large heading</Heading>
