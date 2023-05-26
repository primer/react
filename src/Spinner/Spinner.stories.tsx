import {ComponentStory, Meta} from '@storybook/react'
import React from 'react'
import Spinner from './Spinner'

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as Meta<typeof Spinner>

export const Default = () => <Spinner />

export const Playground: ComponentStory<typeof Spinner> = args => <Spinner {...args} />

Playground.args = {
  size: 'medium',
}

Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
}
