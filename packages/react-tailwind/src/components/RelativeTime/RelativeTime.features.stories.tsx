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

export const InheritedFormatting: Story = {
  args: {
    date: new Date('2024-06-02T11:00:00Z'),
    format: 'datetime',
    hour: 'numeric',
    minute: '2-digit',
    year: 'numeric',
    noTitle: true,
  },
  render: args => (
    <div lang="fr" {...{'time-zone': 'Asia/Tokyo', 'hour-cycle': 'h23'}}>
      <RelativeTime {...args} />
    </div>
  ),
}

export const PreferredAbsoluteMidnight: Story = {
  args: {
    datetime: '2024-06-02T17:00:00.000Z',
    lang: 'en-US',
    timeZone: 'Asia/Kathmandu',
    hourCycle: 'h23',
    prefersAbsoluteTime: true,
    noTitle: true,
  },
}

export const PreferredAbsoluteYear: Story = {
  args: {
    datetime: '2025-03-02T09:05:00.000Z',
    lang: 'en-US',
    timeZone: 'UTC',
    hourCycle: 'h23',
    prefersAbsoluteTime: true,
    noTitle: true,
  },
}

export const PreferredAbsoluteDaylightSaving: Story = {
  args: {
    datetime: '2009-11-01T02:30:00.000Z',
    lang: 'en-US',
    timeZone: 'America/Goose_Bay',
    prefersAbsoluteTime: true,
    noTitle: true,
  },
}

export const PreferredAbsoluteYearRollback: Story = {
  args: {
    datetime: '1943-12-31T12:00:00.000Z',
    lang: 'en-US',
    timeZone: 'America/Phoenix',
    prefersAbsoluteTime: true,
    noTitle: true,
  },
}
