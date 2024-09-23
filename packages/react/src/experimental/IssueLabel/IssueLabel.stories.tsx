import React from 'react'
import {IssueLabel} from '../IssueLabel'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Experimental/Components/IssueLabel',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta

export const Default = () => <IssueLabel text="Issue label" />

export const Playground: StoryObj<typeof IssueLabel> = {
  render: args => <IssueLabel {...args} />,
  args: {
    text: 'Issue label',
  },
  argTypes: {
    fillColor: {
      hex: undefined,
      control: {type: 'color', presetColors: ['red', 'green', 'blue', 'brown', 'black', 'white', 'salmon', 'orange']},
    },
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
    text: {
      control: 'text',
    },
  },
}
