import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../../utils/types'
import {SkeletonText} from './SkeletonText'
import {Avatar, Box, Button, IconButton, Text} from '../../'
import {SkeletonAvatar} from './SkeletonAvatar'
import {VisuallyHidden} from '../../internal/components/VisuallyHidden'
import {KebabHorizontalIcon} from '@primer/octicons-react'

export default {
  title: 'Drafts/Components/Skeleton/Examples',
} as Meta<ComponentProps<typeof SkeletonText>>

const CommentCard = ({children}: {children: React.ReactNode}) => (
  <Box
    sx={{
      borderWidth: '1px',
      borderColor: 'border.default',
      borderStyle: 'solid',
      borderRadius: 2,
      fontSize: 1,
      lineHeight: 'default',
      p: 3,
    }}
  >
    {children}
  </Box>
)

const CommentCardHeading = ({children}: {children: React.ReactNode}) => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      gap: 2,
      mb: 3,
    }}
  >
    {children}
  </Box>
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
      <Box sx={{'> * + *': {marginBlockStart: '1rem'}}}>
        <Button onClick={toggleLoadingState}>{loading ? 'Stop loading' : 'Start loading'}</Button>
        {Array.from({length: 3}, (_, index) => (
          /* aria-busy is passed so the screenreader doesn't announce the skeleton state */
          <CommentCard key={index} aria-busy={loading}>
            <CommentCardHeading>
              {loading ? (
                <>
                  <SkeletonAvatar size={32} />
                  <SkeletonText maxWidth="80px" sx={{flexGrow: 1}} />
                </>
              ) : (
                <>
                  <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" size={32} />
                  <Box sx={{alignItems: 'center', display: 'flex', flexGrow: 1, gap: 1}}>
                    <Text>monalisa</Text>
                    <Text
                      sx={{
                        color: 'fg.muted',
                        flexGrow: 1,
                      }}
                    >
                      on Jan 1
                    </Text>
                    {/* buttons and interactive elements should not be represented as skeleton items or shown in any way until they're ready to accept input */}
                    <IconButton
                      icon={KebabHorizontalIcon}
                      size="small"
                      aria-label="Comment actions"
                      variant="invisible"
                    />
                  </Box>
                </>
              )}
            </CommentCardHeading>
            {loading ? (
              <SkeletonText lines={2} />
            ) : (
              <Text>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
              </Text>
            )}
          </CommentCard>
        ))}
      </Box>
    </>
  )
}
