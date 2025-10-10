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
import type React from 'react'
import {forwardRef} from 'react'
import {clsx} from 'clsx'
import Octicon from '../Octicon'
import classes from './StateLabel.module.css'

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
  open: null,
  closed: null,
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
  open: '',
  closed: '',
}

export type StateLabelProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'small' | 'normal'
  status: keyof typeof octiconMap
}

const StateLabel = forwardRef<HTMLSpanElement, StateLabelProps>(
  ({children, status, variant: variantProp = 'normal', className, ...rest}, ref) => {
    // Open and closed statuses, we don't want to show an icon
    const noIconStatus = status === 'open' || status === 'closed'

    return (
      <span
        {...rest}
        ref={ref}
        className={clsx(classes.StateLabel, className)}
        data-variant={variantProp}
        data-status={status}
      >
        {!noIconStatus && (
          <Octicon
            data-variant-small={variantProp === 'small' ? '' : undefined}
            icon={octiconMap[status]}
            aria-label={labelMap[status]}
            className={classes.Icon}
          />
        )}
        {children}
      </span>
    )
  },
)

StateLabel.displayName = 'StateLabel'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
StateLabel.__SLOT__ = Symbol('StateLabel')

export default StateLabel
