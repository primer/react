import type {Meta, StoryObj} from '@storybook/react-vite'
import {SkeletonAvatar} from '../SkeletonAvatar/SkeletonAvatar'
import {SkeletonText} from './SkeletonText'

const meta = {
  title: 'React Tailwind/Display/SkeletonText/Examples',
  component: SkeletonText,
} satisfies Meta<typeof SkeletonText>

export default meta
type Story = StoryObj<typeof meta>

export const ArticleLoading: Story = {
  render: () => (
    <article className="max-w-lg space-y-3">
      <div className="flex items-center gap-2">
        <SkeletonAvatar size={32} />
        <SkeletonText maxWidth="10rem" size="bodyMedium" />
      </div>
      <SkeletonText size="titleLarge" maxWidth="18rem" />
      <SkeletonText lines={4} />
    </article>
  ),
}

export const CustomWidthLines: Story = {
  render: () => <SkeletonText lines={3} maxWidth="24rem" className="gap-3" />,
}

export const EmptyLineCount: Story = {
  args: {lines: 0},
}
