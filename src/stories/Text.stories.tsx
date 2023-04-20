import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Text from '../Text'

export default {
  title: 'Components/Text',
  component: Text,
} as ComponentMeta<typeof Text>
export const Default: ComponentStory<typeof Text> = () => <Text>Default Text</Text>

export const Playground: ComponentStory<typeof Text> = args => <Text {...args}>Playground</Text>

Playground.args = {
  as: 'p',
}

Playground.argTypes = {
  as: {
    type: 'string',
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
  forwardedAs: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
