import React from '@storybook/react'
import type {Meta, StoryObj} from '@storybook/react'
import BaseStyles from '../../BaseStyles'
import ThemeProvider from '../../ThemeProvider'
import {ToastUI} from './ToastUI'

const meta: Meta<typeof ToastUI> = {
  title: 'Components/Toast/UI',
  decorators: [
    Story => (
      <ThemeProvider>
        <BaseStyles>{Story()}</BaseStyles>
      </ThemeProvider>
    ),
  ],
  component: ToastUI,
  argTypes: {
    children: {
      name: 'body',
    },
  },
}
export default meta

export const Default = () => <ToastUI>Message</ToastUI>

export const Playground: StoryObj<typeof ToastUI> = {
  render: args => <ToastUI {...args} />,
  args: {
    children: 'Message',
    role: 'status',
    dismissible: false,
    dismissLabel: 'Dismiss this message',
    variant: 'default',
  },
}
