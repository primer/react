import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Button} from '../Button'
import {Link} from '../Link'
import {Stack} from '../Stack'
import {Tooltip} from '../Tooltip'
import {RelativeTime} from './RelativeTime'

const meta = {
  title: 'React Tailwind/Content/RelativeTime/Examples',
  component: RelativeTime,
} satisfies Meta<typeof RelativeTime>

export default meta
type Story = StoryObj<typeof meta>

const date = new Date('2020-01-01T00:00:00Z')

export const DynamicRelativeTime: Story = {
  render: function DynamicRelativeTimeStory() {
    const [time, setTime] = useState(false)
    return (
      <Stack>
        <div>
          <Button onClick={() => setTime(value => !value)} aria-describedby="relative-time">
            Show {time ? 'short' : 'exact'} date
          </Button>
        </div>
        <div>
          <RelativeTime
            id="relative-time"
            date={date}
            minute={time ? '2-digit' : undefined}
            hour={time ? 'numeric' : undefined}
            day={time ? '2-digit' : 'numeric'}
            month={time ? 'short' : 'numeric'}
            year="numeric"
            timeZoneName={time ? 'short' : undefined}
            prefix=""
            noTitle
          />
        </div>
      </Stack>
    )
  },
}

export const LongDate: Story = {
  render: () => (
    <RelativeTime
      date={date}
      minute="2-digit"
      hour="numeric"
      day="2-digit"
      month="short"
      year="numeric"
      timeZoneName="short"
      prefix=""
      noTitle
    />
  ),
}

export const LinkWithTooltip: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <Link href="https://www.github.com">
            <RelativeTime date={date} noTitle />
          </Link>
        }
      />
      <Tooltip.Content>{date.toString()}</Tooltip.Content>
    </Tooltip>
  ),
}
