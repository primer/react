import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import Token from './Token'

export default {
  title: 'Components/Token',
  component: Token,
  args: {
    text: 'Token',
    size: 'medium',
  },
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large', 'xlarge'],
    },
  },
} as ComponentMeta<typeof Token>

export const Default = () => <Token text="token" />

export const Playground: ComponentStory<typeof Token> = args => {
  return <Token {...args} />
}
