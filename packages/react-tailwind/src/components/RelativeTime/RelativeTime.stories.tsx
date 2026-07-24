import type {Meta, StoryObj} from '@storybook/react-vite'
import {RelativeTime} from './RelativeTime'
const meta = {
  title: 'React Tailwind/Content/RelativeTime',
  component: RelativeTime,
  args: {datetime: '2024-01-02T00:00:00.000Z'},
} satisfies Meta<typeof RelativeTime>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
