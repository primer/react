import React from 'react'
import {Label} from '../Label'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Drafts/Components/Label',
  component: Label,
} satisfies Meta<typeof Label>

export default meta

export const Default = () => <Label>Issue label</Label>

export const Playground: StoryObj<typeof Label> = {
  render: args => <Label {...args}>Issue label</Label>,
  args: {},
  argTypes: {
    size: {
      control: 'select',
      option: ['small', 'large'],
    },
    variant: {
      control: 'select',
      options: [
        'pink',
        'plum',
        'purple',
        'indigo',
        'blue',
        'cyan',
        'teal',
        'pine',
        'green',
        'lime',
        'olive',
        'lemon',
        'yellow',
        'orange',
        'red',
        'coral',
        'gray',
        'brown',
        'auburn',
      ],
    },
  },
}
