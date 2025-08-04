import {IssueLabel} from '../IssueLabel'
import type {Meta, StoryObj} from '@storybook/react-vite'

const meta = {
  title: 'Experimental/Components/IssueLabel',
  component: IssueLabel,
} satisfies Meta<typeof IssueLabel>

export default meta

export const Default = () => <IssueLabel>Issue label</IssueLabel>

export const Playground: StoryObj<typeof IssueLabel> = {
  render: args => <IssueLabel {...args} />,
  args: {
    children: 'Issue label',
  },
  argTypes: {
    fillColor: {
      hex: undefined,
      control: {
        type: 'color',
        presetColors: ['black', 'blue', 'brown', 'green', 'orange', 'red', 'salmon', 'white'],
      },
    },
    variant: {
      control: {
        type: 'select',
      },
      options: [
        'auburn',
        'blue',
        'brown',
        'coral',
        'cyan',
        'gray',
        'green',
        'indigo',
        'lemon',
        'lime',
        'olive',
        'orange',
        'pine',
        'pink',
        'plum',
        'purple',
        'red',
        'teal',
        'yellow',
      ],
    },
    as: {
      control: 'inline-radio',
      options: ['button', 'a'],
      if: {
        arg: 'href',
        exists: false,
      },
    },
  },
}
