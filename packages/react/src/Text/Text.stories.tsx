import React from 'react'
import {ComponentStory, Meta} from '@storybook/react'
import Text from './Text'

export default {
  title: 'Components/Text',
  component: Text,
} as Meta<typeof Text>

export const Default = () => <Text>Default Text</Text>

export const Playground: ComponentStory<typeof Text> = args => <Text {...args}>{args.text}</Text>

Playground.args = {
  text: 'Playground',
}

Playground.argTypes = {
  text: {
    type: 'string',
  },
  sx: {
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
  ref: {
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
}
