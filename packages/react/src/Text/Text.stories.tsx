import React from 'react'
import type {StoryFn, Meta} from '@storybook/react'
import Text from './Text'

export default {
  title: 'Components/Text',
  component: Text,
} as Meta<typeof Text>

export const Default = () => <Text>Default Text</Text>

export const Playground: StoryFn<typeof Text> = args => <Text {...args}>{args.text}</Text>

Playground.args = {
  text: 'Playground',
  as: 'span',
  size: 'medium',
  weight: 'normal',
}

Playground.argTypes = {
  text: {
    type: 'string',
  },
  as: {
    type: 'string',
  },
  sx: {
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
  forwardedAs: {
    controls: false,
    table: {
      disable: true,
    },
  },
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  weight: {
    control: {
      type: 'radio',
    },
    options: ['light', 'normal', 'medium', 'semibold'],
  },
}
