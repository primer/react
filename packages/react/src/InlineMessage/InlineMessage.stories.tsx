import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {InlineMessage} from '../InlineMessage'

const meta = {
  title: 'Drafts/Components/InlineMessage',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta

export const Default = () => {
  return <InlineMessage>An example inline message</InlineMessage>
}

export const Playground: StoryObj<typeof InlineMessage> = {
  render(args) {
    return <InlineMessage {...args}>An example inline message</InlineMessage>
  },
  argTypes: {
    variant: {
      controls: {
        type: 'radio',
      },
      options: ['info', 'warning', 'critical', 'success', 'unvailable'],
    },
  },
}
