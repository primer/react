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
  ShieldCheckIcon,
  ShieldIcon,
  ShieldSlashIcon,
  ShieldXIcon,
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
  alertOpened: ShieldIcon,
  alertFixed: ShieldCheckIcon,
  alertDismissed: ShieldSlashIcon,
  alertClosed: ShieldXIcon,
  archived: ArchiveIcon,
  open: null,
  closed: null,
}

const iconLabels: Record<keyof typeof icons, string> = {
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
  alertOpened: 'Alert',
  alertFixed: 'Alert',
  alertDismissed: 'Alert',
  alertClosed: 'Alert',
  archived: 'Archived',
  open: '',
  closed: '',
}

const stateLabelVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-center font-semibold leading-4 text-on-emphasis',
  {
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
        alertOpened: 'bg-open-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
        alertFixed: 'bg-done-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
        alertDismissed: 'bg-draft-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-draft-emphasis)]',
        alertClosed: 'bg-closed-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-closed-emphasis)]',
        archived: 'bg-neutral-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-neutral-emphasis)]',
        open: 'bg-open-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
        closed: 'bg-done-emphasis shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
      },
      size: {small: 'px-2 py-1 text-xs leading-4', medium: 'px-3 py-2 text-sm leading-4'},
    },
    defaultVariants: {size: 'medium'},
  },
)

export interface StateLabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stateLabelVariants> {
  /** State being reported, which sets the label's colour, icon, and default text. */
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
      {Icon &&
        (iconLabels[status] ? (
          <Icon aria-label={iconLabels[status]} className={size === 'small' ? 'w-3' : undefined} size={16} />
        ) : (
          <Icon aria-hidden="true" className={size === 'small' ? 'w-3' : undefined} size={16} />
        ))}
      {children}
    </span>
  )
})

StateLabel.displayName = 'StateLabel'
