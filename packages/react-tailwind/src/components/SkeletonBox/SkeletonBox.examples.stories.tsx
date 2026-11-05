import {KebabHorizontalIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Suspense, useEffect, useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Avatar} from '../Avatar/Avatar'
import {Button} from '../Button/Button'
import {IconButton} from '../IconButton/IconButton'
import {AriaStatus} from '../LiveRegion/LiveRegion'
import {SkeletonAvatar} from '../SkeletonAvatar/SkeletonAvatar'
import {SkeletonText} from '../SkeletonText/SkeletonText'
import {Text} from '../Text/Text'
import {VisuallyHidden} from '../VisuallyHidden/VisuallyHidden'
import {SkeletonBox} from './SkeletonBox'

const meta = {
  title: 'React Tailwind/Display/SkeletonBox/Examples',
  component: SkeletonBox,
} satisfies Meta<typeof SkeletonBox>

export default meta
type Story = StoryObj<typeof meta>

const COMMENT_LIST_LENGTH = 3

const mockData = {
  username: 'monalisa',
  date: 'on Jan 1',
  comment:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
  avatarSrc: 'https://avatars.githubusercontent.com/u/7143434?v=4',
}

function CommentCard({children, ...rest}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className="rounded-md border border-default p-4 leading-[var(--text-body-lineHeight-large)] [font-size:var(--text-body-size-medium)]"
    >
      {children}
    </div>
  )
}

function CommentCardHeading({children}: {children: React.ReactNode}) {
  return <div className="mb-4 flex items-center gap-2">{children}</div>
}

function SkeletonCommentCardContent() {
  return (
    <>
      <CommentCardHeading>
        <SkeletonAvatar size={32} />
        <SkeletonText maxWidth="80px" className="grow" />
      </CommentCardHeading>
      <SkeletonText lines={2} />
    </>
  )
}

function CommentCardContent({data}: {data: typeof mockData}) {
  return (
    <>
      <CommentCardHeading>
        <Avatar src={data.avatarSrc} size={32} />
        <div className="flex grow items-center gap-1">
          <Text>{data.username}</Text>
          <Text className="grow text-muted">{data.date}</Text>
          {/* Interactive elements are not represented as skeletons; they render once they can accept input. */}
          <IconButton icon={KebabHorizontalIcon} size="small" aria-label="Comment actions" variant="invisible" />
        </div>
      </CommentCardHeading>
      <Text>{data.comment}</Text>
    </>
  )
}

export const CommentsLoading: Story = {
  render: function CommentsLoadingStory() {
    const [loading, setLoading] = useState(true)
    const [loadingFinished, setLoadingFinished] = useState(false)

    const toggleLoadingState = () => {
      setLoading(!loading)
      setLoadingFinished(loading)
    }

    return (
      <>
        {loading ? <VisuallyHidden>Comments are loading</VisuallyHidden> : null}
        <VisuallyHidden>
          <AriaStatus>{loadingFinished ? 'Comments are loaded' : null}</AriaStatus>
        </VisuallyHidden>
        <div className="space-y-4">
          <Button onClick={toggleLoadingState}>{loading ? 'Stop loading' : 'Start loading'}</Button>
          {Array.from({length: COMMENT_LIST_LENGTH}, (_, index) => (
            // aria-busy keeps screen readers from announcing the skeleton state.
            <CommentCard key={index} aria-busy={loading}>
              {loading ? <SkeletonCommentCardContent /> : <CommentCardContent data={mockData} />}
            </CommentCard>
          ))}
        </div>
      </>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Stop loading'}))
    await expect(canvas.getByRole('button', {name: 'Start loading'})).toBeInTheDocument()
    await expect(canvas.getAllByText('monalisa')).toHaveLength(3)
    await userEvent.click(canvas.getByRole('button', {name: 'Start loading'}))
  },
}

type TrackedPromise<T> = Promise<T> & {status?: 'pending' | 'fulfilled' | 'rejected'; value?: T; reason?: unknown}

const cache = new Map<string, TrackedPromise<typeof mockData>>()

function getData(key: string, delay: number) {
  let promise = cache.get(key)
  if (!promise) {
    promise = new Promise<typeof mockData>(resolve => setTimeout(() => resolve(mockData), delay))
    cache.set(key, promise)
  }
  return promise
}

async function settle<T>(promise: TrackedPromise<T>) {
  try {
    promise.value = await promise
    promise.status = 'fulfilled'
  } catch (error: unknown) {
    promise.status = 'rejected'
    promise.reason = error
  }
}

// Suspense-compatible reader adapted from https://react.dev/reference/react/Suspense, so the story also runs on React 18.
function read<T>(promise: TrackedPromise<T>): T {
  if (promise.status === 'fulfilled') return promise.value as T
  if (promise.status === 'rejected') throw promise.reason
  if (promise.status !== 'pending') {
    promise.status = 'pending'
    void settle(promise)
  }
  throw promise
}

function SuspendedCommentCardContent({promise}: {promise: TrackedPromise<typeof mockData>}) {
  return <CommentCardContent data={read(promise)} />
}

export const CommentsLoadingWithSuspense: Story = {
  render: function CommentsLoadingWithSuspenseStory() {
    const [dataPromise] = useState(() => getData('comments-loading-with-suspense', 3000))
    const [loadingStatus, setLoadingStatus] = useState<'pending' | 'fulfilled'>('pending')

    useEffect(() => {
      const controller = new AbortController()
      void (async () => {
        await dataPromise
        if (!controller.signal.aborted) setLoadingStatus('fulfilled')
      })()
      return () => controller.abort()
    }, [dataPromise])

    return (
      <>
        {loadingStatus === 'pending' ? <VisuallyHidden>Comments are loading</VisuallyHidden> : null}
        <VisuallyHidden>
          <AriaStatus>{loadingStatus === 'fulfilled' ? 'Comments are loaded' : null}</AriaStatus>
        </VisuallyHidden>
        <div className="space-y-4" aria-busy={loadingStatus === 'pending'}>
          {Array.from({length: COMMENT_LIST_LENGTH}, (_, index) => (
            <CommentCard key={index}>
              <Suspense fallback={<SkeletonCommentCardContent />}>
                <SuspendedCommentCardContent promise={dataPromise} />
              </Suspense>
            </CommentCard>
          ))}
        </div>
      </>
    )
  },
}
