import type {Meta, StoryObj} from '@storybook/react-vite'
import {IssueLabel} from './IssueLabel'
const meta = {
  title: 'React Tailwind/Content/IssueLabel',
  component: IssueLabel,
  args: {children: 'Issue label'},
  argTypes: {
    fillColor: {
      control: {
        type: 'color',
        presetColors: ['black', 'blue', 'brown', 'green', 'orange', 'red', 'salmon', 'white'],
      },
    },
    variant: {
      control: 'select',
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
    as: {control: 'inline-radio', options: ['button', 'a']},
  },
} satisfies Meta<typeof IssueLabel>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {}
