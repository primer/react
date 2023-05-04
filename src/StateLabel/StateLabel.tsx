import {
  GitMergeIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  SkipIcon,
  IssueDraftIcon,
  IssueOpenedIcon,
  QuestionIcon,
  GitMergeQueueIcon,
} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import StyledOcticon from '../StyledOcticon'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const octiconMap = {
  issueOpened: IssueOpenedIcon,
  pullOpened: GitPullRequestIcon,
  issueClosed: IssueClosedIcon,
  issueClosedNotPlanned: SkipIcon,
  pullClosed: GitPullRequestIcon,
  pullMerged: GitMergeIcon,
  draft: GitPullRequestIcon,
  issueDraft: IssueDraftIcon,
  pullQueued: GitMergeQueueIcon,
}

const colorVariants = variant({
  prop: 'status',
  variants: {
    issueClosed: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis',
    },
    issueClosedNotPlanned: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
    },
    pullClosed: {
      backgroundColor: 'closed.emphasis',
      color: 'fg.onEmphasis',
    },
    pullMerged: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis',
    },
    pullQueued: {
      backgroundColor: 'attention.emphasis',
      color: 'fg.onEmphasis',
    },
    issueOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis',
    },
    pullOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis',
    },
    draft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
    },
    issueDraft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
    },
  },
})

const sizeVariants = variant({
  prop: 'variant',
  variants: {
    small: {
      paddingX: 2,
      paddingY: 1,
      fontSize: 0,
    },
    normal: {
      paddingX: '12px',
      paddingY: 2,
      fontSize: 1,
    },
  },
})

type StyledStateLabelBaseProps = {
  variant?: 'small' | 'normal'
  status: keyof typeof octiconMap
} & SxProp

const StateLabelBase = styled.span<StyledStateLabelBaseProps>`
  display: inline-flex;
  align-items: center;
  font-weight: ${get('fontWeights.bold')};
  line-height: 16px;
  color: ${get('colors.canvas.default')};
  text-align: center;
  border-radius: ${get('radii.3')};
  ${colorVariants};
  ${sizeVariants};
  ${sx};
`

export type StateLabelProps = ComponentProps<typeof StateLabelBase>

function StateLabel({children, status, variant: variantProp = 'normal', ...rest}: StateLabelProps) {
  const octiconProps = variantProp === 'small' ? {width: '1em'} : {}
  return (
    <StateLabelBase {...rest} variant={variantProp} status={status}>
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      {status && <StyledOcticon {...octiconProps} icon={octiconMap[status] || QuestionIcon} sx={{mr: 1}} />}
      {children}
    </StateLabelBase>
  )
}

export default StateLabel
