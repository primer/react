import React from 'react'
import {IssueLabel} from '../IssueLabel'
import type {Meta, StoryObj} from '@storybook/react'

const meta = {
  title: 'Drafts/Components/IssueLabel',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta

export const Default = () => <IssueLabel>Issue label</IssueLabel>

export const Playground: StoryObj<typeof IssueLabel> = {
  render: args => <IssueLabel {...args}>Issue label</IssueLabel>,
  args: {},
  argTypes: {
    fillColor: {
      fillColor: undefined,
      control: {
        type: 'color',
        presetColors: ['#FF0000', '#008000', '#0000FF', '#A52A2A', '#000000', '#FFFFFF', '#FA8072', '#FFA500'],
      },
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
  },
}
