import {
  GitMergeIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitPullRequestDraftIcon,
  IssueClosedIcon,
  SkipIcon,
  IssueDraftIcon,
  IssueOpenedIcon,
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

const statusVariants = {
  issueClosed: {
    icon: IssueClosedIcon,
    iconLabel: 'Issue',
    backgroundColor: 'colors.done.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  issueClosedNotPlanned: {
    icon: SkipIcon,
    iconLabel: 'Issue',
    backgroundColor: 'colors.neutral.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  pullClosed: {
    icon: GitPullRequestClosedIcon,
    iconLabel: 'Pull request',
    backgroundColor: 'colors.closed.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  pullMerged: {
    icon: GitMergeIcon,
    iconLabel: 'Pull request',
    backgroundColor: 'colors.done.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  pullQueued: {
    icon: GitMergeQueueIcon,
    iconLabel: 'Pull request',
    backgroundColor: 'colors.attention.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  issueOpened: {
    icon: IssueOpenedIcon,
    iconLabel: 'Issue',
    backgroundColor: 'colors.open.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  pullOpened: {
    icon: GitPullRequestIcon,
    iconLabel: 'Pull request',
    backgroundColor: 'colors.open.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  draft: {
    icon: GitPullRequestDraftIcon,
    iconLabel: 'Pull request',
    backgroundColor: 'colors.neutral.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  issueDraft: {
    icon: IssueDraftIcon,
    iconLabel: 'Issue',
    backgroundColor: 'colors.neutral.emphasis',
    color: 'colors.fg.onEmphasis',
  },
  unavailable: {
    icon: AlertIcon,
    iconLabel: '',
    backgroundColor: 'colors.neutral.emphasis',
    color: 'colors.fg.onEmphasis',
  },
}

type StyledStateLabelBaseProps = {
  variant?: 'small' | 'normal'
  status: keyof typeof statusVariants
} & SxProp

const StateLabelBase = styled.span<StyledStateLabelBaseProps>`
  display: inline-flex;
  align-items: center;
  font-weight: ${get('fontWeights.bold')};
  line-height: 16px;
  text-align: center;
  border-radius: ${get('radii.3')};
  color: ${props => get(statusVariants[props.status].color)};
  background-color: ${props => get(statusVariants[props.status].backgroundColor)};
  ${sizeVariants};
  ${sx};
`

export type StateLabelProps = ComponentProps<typeof StateLabelBase>

function StateLabel({children, status, variant: variantProp = 'normal', ...rest}: StateLabelProps) {
  const octiconProps = variantProp === 'small' ? {width: '1em'} : {}
  return (
    <StateLabelBase {...rest} variant={variantProp} status={status}>
      <Octicon
        {...octiconProps}
        icon={statusVariants[status].icon}
        aria-label={statusVariants[status].iconLabel}
        sx={{mr: 1}}
      />
      {children}
    </StateLabelBase>
  )
}

export default StateLabel
