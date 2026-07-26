import type {Meta, StoryObj} from '@storybook/react-vite'
import {RelativeTime} from './RelativeTime'

const meta = {
  title: 'React Tailwind/Content/RelativeTime/Features',
  component: RelativeTime,
  parameters: {layout: 'fullscreen'},
  args: {
    date: new Date('2020-01-01T00:00:00Z'),
    second: '',
    minute: '',
    hour: '',
    weekday: '',
    day: 'numeric',
    month: 'short',
    year: '',
    timeZoneName: '',
  },
} satisfies Meta<typeof RelativeTime>

export default meta
type Story = StoryObj<typeof meta>

export const MicroFormat: Story = {
  args: {format: 'micro', tense: 'past', noTitle: true},
}

export const RecentTime: Story = {
  render: () => <RelativeTime date={new Date()} noTitle />,
}

export const CountDownTimer: Story = {
  args: {date: new Date('2038-01-19T03:14:08Z'), format: 'elapsed', day: '', month: '', noTitle: true},
}
