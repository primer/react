import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from './Avatar'

const meta = {
  title: 'React Tailwind/Display/Avatar/Examples',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const RepositoryOwner: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar alt="GitHub" src="https://avatars.githubusercontent.com/github" size="medium" />
      <span>github</span>
    </div>
  ),
}
