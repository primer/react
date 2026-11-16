import type {Meta, StoryObj} from '@storybook/react-vite'
import {CounterLabel} from './CounterLabel'

const meta = {
  title: 'React Tailwind/Display/CounterLabel/Examples',
  component: CounterLabel,
} satisfies Meta<typeof CounterLabel>

export default meta
type Story = StoryObj<typeof meta>

export const NotificationCount: Story = {
  render: () => (
    <button type="button">
      Notifications <CounterLabel aria-label="12 unread notifications">12</CounterLabel>
    </button>
  ),
}
