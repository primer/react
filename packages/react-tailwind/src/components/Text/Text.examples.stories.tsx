import type {Meta, StoryObj} from '@storybook/react-vite'
import {Text} from './Text'

const meta = {
  title: 'React Tailwind/Display/Text/Examples',
  component: Text,
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const IssueMetadata: Story = {
  render: () => (
    <p>
      <Text weight="semibold">octocat</Text> <Text className="text-muted">opened this issue yesterday</Text>
    </p>
  ),
}
