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
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'

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

const StateLabelBase = styled.span`
  display: inline-flex;
  align-items: center;
  font-weight: ${get('fontWeights.bold')};
  line-height: 16px;
  color: ${get('colors.fg.onEmphasis')};
  text-align: center;
  border-radius: ${get('radii.3')};

  /* Variant */
  &[data-variant='small'] {
    padding-inline: var(--base-size-8, ${get('space.2')});
    padding-block: var(--base-size-4, ${get('space.1')});
    font-size: var(--text-body-size-small, ${get('fontSizes.0')});
  }

  &[data-variant='normal'] {
    padding-inline: 12px;
    padding-block: var(--base-size-8, ${get('space.2')});
    font-size: var(--text-body-size-medium, ${get('fontSizes.1')});
  }

  /* Status */
  &[data-status='issueClosed'] {
    background-color: var(--bgColor-done-emphasis, ${get('done.emphasis')});
  }

  &[data-status='issueClosedNotPlanned'] {
    background-color: ${get('colors.neutral.emphasis')};
  }

  &[data-status='pullClosed'] {
    background-color: ${get('colors.closed.emphasis')};
  }

  &[data-status='pullMerged'] {
    background-color: ${get('colors.done.emphasis')};
  }

  &[data-status='pullQueued'] {
    background-color: ${get('colors.attention.emphasis')};
  }

  &[data-status='issueOpened'] {
    background-color: ${get('colors.open.emphasis')};
  }

  &[data-status='pullOpened'] {
    background-color: ${get('colors.open.emphasis')};
  }

  &[data-status='draft'] {
    background-color: ${get('colors.neutral.emphasis')};
  }

  &[data-status='issueDraft'] {
    background-color: ${get('colors.neutral.emphasis')};
  }

  &[data-status='unavailable'] {
    background-color: ${get('colors.neutral.emphasis')};
  }

  /* Icon */
  & .StateLabelIcon {
    margin-inline-end: var(--base-size-4, ${get('space.1')});
  }

  &[data-variant='small'] .StateLabelIcon {
    width: 1em;
  }

  ${sx};
`

export type StateLabelProps = React.ComponentPropsWithoutRef<typeof StateLabelBase> & {
  variant?: 'small' | 'normal'
  status: keyof typeof octiconMap
} & SxProp

function StateLabel({children, status, variant = 'normal', ...rest}: StateLabelProps) {
  const Icon = octiconMap[status]
  const label = getIconLabel(status)
  return (
    <StateLabelBase {...rest} data-status={status} data-variant={variant}>
      <Icon aria-label={label ?? undefined} className="StateLabelIcon" />
      {children}
    </StateLabelBase>
  )
}

function getIconLabel(status: keyof typeof octiconMap): string | null {
  switch (status) {
    case 'issueOpened':
    case 'issueClosed':
    case 'issueDraft':
    case 'issueClosedNotPlanned':
      return 'Issue'
    case 'pullOpened':
    case 'pullClosed':
    case 'pullMerged':
    case 'pullQueued':
    case 'draft':
      return 'Pull request'
    case 'unavailable':
      return null
  }
}

export default StateLabel
