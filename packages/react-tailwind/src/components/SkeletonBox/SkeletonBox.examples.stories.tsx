import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {SkeletonAvatar} from '../SkeletonAvatar/SkeletonAvatar'
import {SkeletonText} from '../SkeletonText/SkeletonText'
import {SkeletonBox} from './SkeletonBox'

const meta = {
  title: 'React Tailwind/Display/SkeletonBox/Examples',
  component: SkeletonBox,
} satisfies Meta<typeof SkeletonBox>

export default meta
type Story = StoryObj<typeof meta>

const CommentCard = ({loading}: {loading: boolean}) => (
  <article className="space-y-3 rounded-md border border-default p-4" aria-busy={loading}>
    <div className="flex items-center gap-2">
      {loading ? (
        <SkeletonAvatar size={32} />
      ) : (
        <span className="size-8 rounded-full bg-accent-emphasis" aria-hidden="true" />
      )}
      {loading ? <SkeletonBox width="80px" height="1rem" /> : <strong>monalisa</strong>}
    </div>
    {loading ? <SkeletonText lines={2} /> : <p className="m-0">Some content that had to be loaded.</p>}
  </article>
)

export const CommentsLoading: Story = {
  render: function CommentsLoadingStory() {
    const [loading, setLoading] = useState(true)
    return (
      <div className="max-w-lg space-y-3">
        <button type="button" onClick={() => setLoading(value => !value)}>
          {loading ? 'Stop loading' : 'Start loading'}
        </button>
        <div className="sr-only" role="status">
          {loading ? 'Comments are loading' : 'Comments are loaded'}
        </div>
        {[0, 1, 2].map(index => (
          <CommentCard key={index} loading={loading} />
        ))}
      </div>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Stop loading'}))
    await expect(canvas.getByRole('button', {name: 'Start loading'})).toBeInTheDocument()
    await expect(canvas.getAllByText('monalisa')).toHaveLength(3)
  },
}

export const CommentsLoadingWithSuspense: Story = {
  render: () => (
    <div className="max-w-lg space-y-3" aria-busy="true">
      <CommentCard loading />
      <CommentCard loading />
      <CommentCard loading />
    </div>
  ),
}

export const LoadingCardWithCustomContent: Story = {
  render: () => (
    <div className="max-w-lg space-y-3">
      <SkeletonBox height="3rem" />
      <SkeletonText lines={3} maxWidth="28rem" />
    </div>
  ),
}
