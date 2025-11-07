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
  size?: 'small' | 'medium'
  /** @deprecated use size property with value 'small' or 'medium' instead */
  variant?: 'normal' | 'small' // kept for backwards compatibility
  status: keyof typeof octiconMap
}

const StateLabel = forwardRef<HTMLSpanElement, StateLabelProps>(
  ({children, status, size: sizeProp = 'medium', variant: variantProp, className, ...rest}, ref) => {
    // Open and closed statuses, we don't want to show an icon
    const noIconStatus = status === 'open' || status === 'closed'

    // For backwards compatibility, we map variant to size
    if (variantProp === 'small') {
      sizeProp = 'small'
    }
    if (variantProp === 'normal') {
      sizeProp = 'medium'
    }

    return (
      <span
        {...rest}
        ref={ref}
        className={clsx(classes.StateLabel, className)}
        data-size={sizeProp}
        data-status={status}
      >
        {!noIconStatus && (
          <Octicon
            data-size-small={sizeProp === 'small' ? '' : undefined}
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

export default StateLabel
