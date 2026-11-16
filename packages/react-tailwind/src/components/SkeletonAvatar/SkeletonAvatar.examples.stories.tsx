import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonAvatar} from './SkeletonAvatar'

const meta = {
  title: 'React Tailwind/Display/SkeletonAvatar/Examples',
  component: SkeletonAvatar,
} satisfies Meta<typeof SkeletonAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const ProfileLoading: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SkeletonAvatar size="large" />
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-neutral-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-neutral-muted" />
      </div>
    </div>
  ),
}

export const AvatarGrid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[24, 32, 40, 48].map(size => (
        <SkeletonAvatar key={size} size={size} />
      ))}
    </div>
  ),
}
