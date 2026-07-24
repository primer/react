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

const stateLabelVariants = cva('inline-flex items-center gap-1 rounded-full font-semibold leading-4 text-on-emphasis', {
  variants: {
    status: {
      issueOpened: 'bg-open-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
      pullOpened: 'bg-open-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
      issueClosed: 'bg-done-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
      issueClosedNotPlanned: 'bg-neutral-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-neutral-emphasis)]',
      pullClosed: 'bg-closed-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-closed-emphasis)]',
      pullMerged: 'bg-done-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
      draft: 'bg-draft-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-draft-emphasis)]',
      issueDraft: 'bg-draft-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-draft-emphasis)]',
      pullQueued: 'bg-attention-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-attention-emphasis)]',
      unavailable: 'bg-neutral-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-neutral-emphasis)]',
      archived: 'bg-neutral-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-neutral-emphasis)]',
      open: 'bg-open-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
      closed: 'bg-done-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
    },
    size: {small: 'px-2 py-1 text-xs leading-4', medium: 'px-3 py-2 text-sm leading-4'},
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
