import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import Flash from './Flash'

export default {
  title: 'Components/Flash',
  component: Flash,
} as ComponentMeta<typeof Flash>

export const Default = () => <Flash>Default</Flash>

export const Playground: ComponentStory<typeof Flash> = args => <Flash {...args}>Default</Flash>

Playground.args = {
  variant: 'default',
}

Playground.argTypes = {
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
  ref: {
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
  theme: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
