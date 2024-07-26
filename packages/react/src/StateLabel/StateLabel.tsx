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
import type {Theme} from '../ThemeProvider'

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
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-done-emphasis, ${theme.colors.done.emphasis})`,
    },
    issueClosedNotPlanned: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, ${theme.colors.neutral.emphasis})`,
    },
    pullClosed: {
      backgroundColor: 'closed.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-closed-emphasis, ${theme.colors.closed.emphasis})`,
    },
    pullMerged: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-done-emphasis, ${theme.colors.done.emphasis})`,
    },
    pullQueued: {
      backgroundColor: 'attention.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-attention-emphasis, ${theme.colors.attention.emphasis})`,
    },
    issueOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-open-emphasis, ${theme.colors.open.emphasis})`,
    },
    pullOpened: {
      backgroundColor: 'open.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-open-emphasis, ${theme.colors.open.emphasis})`,
    },
    draft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, ${theme.colors.neutral.emphasis})`,
    },
    issueDraft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, ${theme.colors.neutral.emphasis})`,
    },
    unavailable: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis',
      boxShadow: (theme: Theme) =>
        `var(--boxShadow-thin, inset 0 0 0 1px) var(--borderColor-neutral-emphasis, ${theme.colors.neutral.emphasis})`,
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
