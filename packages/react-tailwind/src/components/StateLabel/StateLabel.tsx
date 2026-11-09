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
  'primer:inline-flex primer:items-center primer:gap-1 primer:rounded-full primer:text-center primer:font-semibold primer:leading-4 primer:text-on-emphasis',
  {
    variants: {
      status: {
        issueOpened: 'primer:bg-open-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
        pullOpened: 'primer:bg-open-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
        issueClosed: 'primer:bg-done-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
        issueClosedNotPlanned:
          'primer:bg-neutral-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-neutral-emphasis)]',
        pullClosed: 'primer:bg-closed-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-closed-emphasis)]',
        pullMerged: 'primer:bg-done-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
        draft: 'primer:bg-draft-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-draft-emphasis)]',
        issueDraft: 'primer:bg-draft-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-draft-emphasis)]',
        pullQueued:
          'primer:bg-attention-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-attention-emphasis)]',
        unavailable: 'primer:bg-neutral-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-neutral-emphasis)]',
        alertOpened: 'primer:bg-open-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
        alertFixed: 'primer:bg-done-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
        alertDismissed: 'primer:bg-draft-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-draft-emphasis)]',
        alertClosed: 'primer:bg-closed-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-closed-emphasis)]',
        archived: 'primer:bg-neutral-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-neutral-emphasis)]',
        open: 'primer:bg-open-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-open-emphasis)]',
        closed: 'primer:bg-done-emphasis primer:shadow-[inset_0_0_0_1px_var(--borderColor-done-emphasis)]',
      },
      size: {
        small: 'primer:px-2 primer:py-1 primer:text-xs primer:leading-4',
        medium: 'primer:px-3 primer:py-2 primer:text-sm primer:leading-4',
      },
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
          <Icon aria-label={iconLabels[status]} className={size === 'small' ? 'primer:w-3' : undefined} size={16} />
        ) : (
          <Icon aria-hidden="true" className={size === 'small' ? 'primer:w-3' : undefined} size={16} />
        ))}
      {children}
    </span>
  )
})

StateLabel.displayName = 'StateLabel'
