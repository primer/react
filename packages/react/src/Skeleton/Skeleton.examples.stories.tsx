import React, {Suspense} from 'react'
import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {SkeletonText} from '../SkeletonText'
import {Avatar, Button, IconButton, Text} from '../'
import {SkeletonAvatar} from '../SkeletonAvatar'
import {VisuallyHidden} from '../VisuallyHidden'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import classes from './Skeleton.examples.stories.module.css'

export default {
  title: 'Components/Skeleton/Examples',
} as Meta<ComponentProps<typeof SkeletonText>>

const COMMENT_LIST_LENGTH = 3

const mockData = {
  username: 'monalisa',
  date: 'on Jan 1',
  comment:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
  avatarSrc: 'https://avatars.githubusercontent.com/u/7143434?v=4',
}

const CommentCard = ({children}: {children: React.ReactNode}) => <div className={classes.CommentCard}>{children}</div>

const CommentCardHeading = ({children}: {children: React.ReactNode}) => (
  <div className={classes.CommentCardHeading}>{children}</div>
)

export const CommentsLoading = () => {
  const [loading, setLoading] = React.useState(true)
  const [loadingFinished, setLoadingFinished] = React.useState(false)

  const toggleLoadingState = () => {
    setLoading(!loading)
    setLoadingFinished(loading)
  }

  return (
    <>
      {/** read by screen readers in place of the comments in a skeleton loading state */}
      {loading ? <VisuallyHidden>Comments are loading</VisuallyHidden> : null}
      {/** when loading is completed, it should be announced by the screen-reader */}
      <VisuallyHidden aria-live="polite">{loadingFinished ? 'Comments are loaded' : null}</VisuallyHidden>
      <div className={classes.CommentsSpacing}>
        <Button onClick={toggleLoadingState}>{loading ? 'Stop loading' : 'Start loading'}</Button>
        {Array.from({length: COMMENT_LIST_LENGTH}, (_, index) => (
          /* aria-busy is passed so the screenreader doesn't announce the skeleton state */
          <CommentCard key={index} aria-busy={loading}>
            <CommentCardHeading>
              {loading ? (
                <>
                  <SkeletonAvatar size={32} />
                  <SkeletonText maxWidth="80px" className={classes.CommentCardHeadingText} />
                </>
              ) : (
                <>
                  <Avatar src={mockData.avatarSrc} size={32} />
                  <div className={classes.CommentCardUserMeta}>
                    <Text>{mockData.username}</Text>
                    <Text className={classes.CommentCardDate}>{mockData.date}</Text>
                    {/* buttons and interactive elements should not be represented as skeleton items or shown in any way until they're ready to accept input */}
                    <IconButton
                      icon={KebabHorizontalIcon}
                      size="small"
                      aria-label="Comment actions"
                      variant="invisible"
                    />
                  </div>
                </>
              )}
            </CommentCardHeading>
            {loading ? <SkeletonText lines={2} /> : <Text>{mockData.comment}</Text>}
          </CommentCard>
        ))}
      </div>
    </>
  )
}

export const CommentsLoadingWithSuspense = () => {
  const dataPromise = React.useMemo(() => getData({key: 'comments-loading-with-suspense', delay: 3000}), [])
  const [loadingStatus, setLoadingStatus] = React.useState<string>('pending')

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await dataPromise
        setLoadingStatus('fulfilled')
      } catch (_error) {
        // Handle error if needed
      }
    }

    fetchData()
  }, [dataPromise])

  return (
    <>
      {/** read by screen readers in place of the comments in a skeleton loading state */}
      {loadingStatus === 'pending' ? <VisuallyHidden>Comments are loading</VisuallyHidden> : null}
      {/** when loading is completed, it should be announced by the screen-reader */}
      <VisuallyHidden aria-live="polite">{loadingStatus === 'fulfilled' ? 'Comments are loaded' : null}</VisuallyHidden>

      {/* aria-busy is passed so the screenreader doesn't announce the skeleton state */}
      <div className={classes.CommentsSpacing} aria-busy={loadingStatus === 'pending'}>
        {Array.from({length: COMMENT_LIST_LENGTH}, (_, index) => (
          <CommentCard key={index}>
            <Suspense
              fallback={
                <>
                  <CommentCardHeading>
                    <SkeletonAvatar size={32} />
                    <SkeletonText maxWidth="80px" className={classes.CommentCardHeadingText} />
                  </CommentCardHeading>
                  <SkeletonText lines={2} />
                </>
              }
            >
              <SuspendedCommentCardContent promise={dataPromise} />
            </Suspense>
          </CommentCard>
        ))}
      </div>
    </>
  )
}

const SuspendedCommentCardContent = ({promise}: {promise: Promise<typeof mockData>}) => {
  const fetchedData = use(promise)

  return (
    <>
      <CommentCardHeading>
        <Avatar src={fetchedData.avatarSrc} size={32} />
        <div className={classes.CommentCardUserMeta}>
          <Text>{fetchedData.username}</Text>
          <Text className={classes.CommentCardDate}>{fetchedData.date}</Text>
          {/* buttons and interactive elements should not be represented as skeleton items or shown in any way until they're ready to accept input */}
          <IconButton icon={KebabHorizontalIcon} size="small" aria-label="Comment actions" variant="invisible" />
        </div>
      </CommentCardHeading>
      <Text>{fetchedData.comment}</Text>
    </>
  )
}

// ----- Suspense implementation details ----
const cache = new Map()
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getData = ({key = '0', delay = 1000}: {key: string; delay?: number}) => {
  if (!cache.has(key)) cache.set(key, fetchData(delay))
  return cache.get(key)
}
// return a promise!
const fetchData = async (delay: number) => {
  await sleep(delay)
  return mockData
}

/* lifted from the examples at https://react.dev/reference/react/Suspense */
// @ts-ignore copied from untyped example
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value
  } else if (promise.status === 'rejected') {
    throw promise.reason
  } else if (promise.status === 'pending') {
    throw promise
  } else {
    promise.status = 'pending'

    // eslint-disable-next-line github/no-then
    promise.then(
      (result: Record<string, unknown>) => {
        promise.status = 'fulfilled'
        promise.value = result
      },
      (error: Error) => {
        promise.status = 'rejected'
        promise.reason = error
      },
    )
    throw promise
  }
}
