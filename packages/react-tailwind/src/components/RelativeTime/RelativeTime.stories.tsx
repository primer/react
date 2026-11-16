import type {Meta, StoryObj} from '@storybook/react-vite'
import {RelativeTime} from './RelativeTime'
const meta = {
  title: 'React Tailwind/Content/RelativeTime',
  component: RelativeTime,
  args: {date: new Date('2020-01-01T00:00:00Z'), noTitle: true},
  parameters: {layout: 'fullscreen'},
  argTypes: {
    date: {control: 'date'},
    format: {control: 'select', options: ['relative', 'datetime', 'duration']},
    formatStyle: {control: 'select', options: ['long', 'short', 'narrow']},
    hourCycle: {control: 'select', options: ['h11', 'h12', 'h23', 'h24']},
  },
} satisfies Meta<typeof RelativeTime>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {
  args: {
    second: '',
    minute: '',
    hour: '',
    weekday: '',
    day: 'numeric',
    month: 'short',
    year: '',
    timeZoneName: '',
  },
}
