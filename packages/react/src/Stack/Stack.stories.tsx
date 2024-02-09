import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {Stack} from './Stack'

type Story = StoryObj<typeof Stack>

const meta: Meta<typeof Stack> = {
  title: 'Drafts/Components/Stack',
  component: Stack,
}

export default meta

export const Default: Story = {
  render: () => (
    <Stack>
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
    </Stack>
  ),
}

export const Playground: Story = {
  argTypes: {
    gap: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['condensed', 'normal', 'spacious'],
      },
    },
    orientation: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical'],
      },
    },
    padding: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['condensed', 'normal', 'spacious'],
      },
    },
  },
  render: args => (
    <Stack {...args}>
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
    </Stack>
  ),
}
