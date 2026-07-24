import {
  AlertIcon,
  ArchiveIcon,
  GitMergeIcon,
  GitMergeQueueIcon,
  GitPullRequestClosedIcon,
  GitPullRequestDraftIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueDraftIcon,
  IssueOpenedIcon,
  SkipIcon,
} from '@primer/octicons-react'
import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const icons = {
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
  archived: ArchiveIcon,
  open: null,
  closed: null,
}

const stateLabelVariants = cva('inline-flex items-center gap-1 rounded-full font-medium', {
  variants: {
    status: {
      issueOpened: 'bg-open-muted text-open',
      pullOpened: 'bg-open-muted text-open',
      issueClosed: 'bg-done-muted text-done',
      issueClosedNotPlanned: 'bg-neutral-muted text-muted',
      pullClosed: 'bg-closed-muted text-closed',
      pullMerged: 'bg-done-muted text-done',
      draft: 'bg-neutral-muted text-muted',
      issueDraft: 'bg-neutral-muted text-muted',
      pullQueued: 'bg-accent-muted text-accent',
      unavailable: 'bg-attention-muted text-attention',
      archived: 'bg-neutral-muted text-muted',
      open: 'bg-open-muted text-open',
      closed: 'bg-closed-muted text-closed',
    },
    size: {small: 'min-h-5 px-2 text-xs', medium: 'min-h-6 px-2 text-sm'},
  },
  defaultVariants: {size: 'medium'},
})

export interface StateLabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stateLabelVariants> {
  status: keyof typeof icons
}

export const StateLabel = React.forwardRef<HTMLSpanElement, StateLabelProps>(function StateLabel(
  {children, className, size, status, ...rest},
  ref,
) {
  const Icon = icons[status]
  return (
    <span
      {...rest}
      ref={ref}
      data-component="StateLabel"
      data-status={status}
      className={cn(stateLabelVariants({size, status}), className)}
    >
      {Icon && <Icon aria-hidden="true" size={size === 'small' ? 12 : 16} />}
      {children}
    </span>
  )
})

StateLabel.displayName = 'StateLabel'
