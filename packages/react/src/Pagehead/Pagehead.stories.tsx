import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import Pagehead from './Pagehead'

export default {
  title: 'Components/Pagehead',
  component: Pagehead,
} as Meta<typeof Pagehead>

export const Default = () => <Pagehead>Pagehead</Pagehead>

export const Playground: StoryFn<typeof Pagehead> = args => <Pagehead {...args}>Pagehead</Pagehead>

Playground.args = {
  as: 'div',
}

Playground.argTypes = {
  as: {
    control: {
      type: 'select',
      options: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
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
  theme: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
