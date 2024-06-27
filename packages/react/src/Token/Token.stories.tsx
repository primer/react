import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import Token from './Token'

export default {
  title: 'Components/Token',
  component: Token,
} as Meta<typeof Token>

export const Default = () => <Token text="token" />

export const Playground: StoryFn<typeof Token> = args => {
  return <Token {...args} />
}
Playground.args = {
  text: 'Token',
  size: 'medium',
}
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large', 'xlarge'],
  },
}
