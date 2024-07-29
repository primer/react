import {
  GitMergeIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitPullRequestDraftIcon,
  IssueClosedIcon,
  SkipIcon,
  IssueDraftIcon,
  IssueOpenedIcon,
  QuestionIcon,
  GitMergeQueueIcon,
  AlertIcon,
} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import Octicon from '../Octicon'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

const octiconMap = {
  issueOpened: IssueOpenedIcon,
  pullOpened: GitPullRequestIcon,
  issueClosed: IssueClosedIcon,
  issueClosedNotPlanned: SkipIcon,
  pullClosed: GitPullRequestClosedIcon,
  pullMerged: GitMergeIcon,
  draft: GitPullRequestDraftIcon,
  issueDraft: IssueDraftIcon,
  pullQueued: GitMergeQueueIcon,
  unavailable: AlertIcon,
}

const labelMap: Record<keyof typeof octiconMap, 'Issue' | 'Issue, not planned' | 'Pull request' | ''> = {
  issueOpened: 'Issue',
  pullOpened: 'Pull request',
  issueClosed: 'Issue',
  issueClosedNotPlanned: 'Issue, not planned',
  pullClosed: 'Pull request',
  pullMerged: 'Pull request',
  draft: 'Pull request',
  issueDraft: 'Issue',
  pullQueued: 'Pull request',
  unavailable: '',
}

const colorVariants = variant({
  prop: 'status',
  variants: {
    issueClosed: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-done-emphasis, transparent)',
    },
    issueClosedNotPlanned: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, transparent)',
    },
    pullClosed: {
      backgroundColor: 'closed.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-closed-emphasis, transparent)',
    },
    pullMerged: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-done-emphasis, transparent)',
    },
    pullQueued: {
      backgroundColor: 'attention.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-attention-emphasis, transparent)',
    },
    issueOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-open-emphasis, transparent)',
    },
    pullOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-open-emphasis, transparent)',
    },
    draft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, transparent)',
    },
    issueDraft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, transparent)',
    },
    unavailable: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: 'var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, transparent)',
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
      {status && (
        <Octicon
          {...octiconProps}
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          icon={octiconMap[status] || QuestionIcon}
          aria-label={labelMap[status]}
          sx={{mr: 1}}
        />
      )}
      {children}
    </StateLabelBase>
  )
}

export default StateLabel
