import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  BlockedIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleSlashIcon,
  CommentDiscussionIcon,
  CrossReferenceIcon,
  DuplicateIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueDraftIcon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  IssueTrackedByIcon,
  IssueTracksIcon,
  LinkExternalIcon,
  LockIcon,
  MilestoneIcon,
  NumberIcon,
  PencilIcon,
  PersonIcon,
  PinIcon,
  SingleSelectIcon,
  TableIcon,
  TagIcon,
  TrashIcon,
  TypographyIcon,
  UnlockIcon,
} from '@primer/octicons-react'
import {Button} from '../Button'
import {Label} from '../Label'
import {Link} from '../Link'
import {Token} from '../Token'
import {Timeline} from './Timeline'
import {BoldLink, Examples, MutedTime, UserActor, VariantSection} from './Timeline.storyHelpers'

const meta = {
  title: 'React Tailwind/Layout/Timeline/Features/Issues',
  component: Timeline,
} satisfies Meta<typeof Timeline>
export default meta

type Story = StoryObj<typeof meta>
type Icon = React.ElementType
type BadgeVariant = React.ComponentProps<typeof Timeline.Badge>['variant']
const examplesClassName = '[&_h3]:m-0 [&_h3]:mb-1 [&_h3]:leading-[18px]'

interface Reference {
  title: string
  number: string
  icon?: Icon
  iconClassName?: string
}

interface EventFixture {
  label: string
  action: React.ReactNode
  icon: Icon
  date: string
  variant?: BadgeVariant
  references?: readonly Reference[]
  actions?: React.ReactNode
  badgeClassName?: string
}

const dates = {
  one: '2022-07-26T11:46:07Z',
  two: '2022-07-25T09:12:00Z',
  three: '2022-07-24T16:40:00Z',
  four: '2022-07-23T11:05:00Z',
  five: '2022-07-22T14:20:00Z',
  six: '2022-07-21T08:30:00Z',
  seven: '2022-07-20T10:00:00Z',
  eight: '2022-07-19T13:15:00Z',
} as const

const openIssueReference: Reference = {
  title: 'Add retry logic to the uploader',
  number: '#42',
  iconClassName: 'text-open',
}
const closedIssueReference: Reference = {
  title: 'Document the retry backoff',
  number: '#43',
  icon: IssueClosedIcon,
  iconClassName: 'text-done',
}

function IssueReferenceList({references}: {references: readonly Reference[]}) {
  return (
    <ul className="mt-2 ml-1 list-none p-0">
      {references.map(({title, number, icon: ReferenceIcon = IssueOpenedIcon, iconClassName = 'text-open'}) => (
        <li className="mt-1 first:mt-0" key={number}>
          <Link className="text-default no-underline hover:text-accent hover:underline" href="#">
            <ReferenceIcon
              aria-hidden="true"
              className={`mr-1 inline-block align-text-bottom ${iconClassName}`}
              size={16}
            />
            <span className="font-semibold">{title}</span> <span className="text-muted">{number}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function IssueLink({title, number, icon: ReferenceIcon = IssueOpenedIcon, iconClassName = 'text-open'}: Reference) {
  return (
    <Link className="text-default no-underline hover:text-accent hover:underline" href="#">
      <ReferenceIcon aria-hidden="true" className={`mr-1 inline-block align-text-bottom ${iconClassName}`} size={16} />
      <span className="font-semibold">{title}</span> <span className="text-muted">{number}</span>
    </Link>
  )
}

function TokenValue({text, className}: {text: string; className: string}) {
  return (
    <span className="mx-1 inline-flex align-middle">
      <Token as="a" href="#" text={text} size="small" className={className} />
    </span>
  )
}

function TimelineEvent({label, action, icon: Icon, date, variant, references, actions, badgeClassName}: EventFixture) {
  return (
    <VariantSection label={label}>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge className={badgeClassName} variant={variant}>
            <Icon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {action} <MutedTime date={new Date(date)} href="#" />
            {references ? <IssueReferenceList references={references} /> : null}
          </Timeline.Body>
          {actions ? <Timeline.Actions>{actions}</Timeline.Actions> : null}
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  )
}

function renderFixtures(fixtures: readonly EventFixture[]) {
  return (
    <Examples className={examplesClassName}>
      {fixtures.map(fixture => (
        <TimelineEvent {...fixture} key={fixture.label} />
      ))}
    </Examples>
  )
}

const neutralBadge = 'bg-neutral-emphasis text-on-emphasis'

const closed: readonly EventFixture[] = [
  {
    label: 'Closed as completed',
    action: (
      <>
        closed this as{' '}
        <Link href="#" inline>
          completed
        </Link>
      </>
    ),
    icon: CheckCircleIcon,
    variant: 'done',
    date: dates.one,
  },
  {
    label: 'Closed as not planned',
    action: (
      <>
        closed this as{' '}
        <Link href="#" inline>
          not planned
        </Link>
      </>
    ),
    icon: CircleSlashIcon,
    date: dates.two,
    badgeClassName: neutralBadge,
  },
  {
    label: 'Closed via pull request',
    action: (
      <>
        closed this as{' '}
        <Link href="#" inline>
          completed
        </Link>{' '}
        in <BoldLink href="#">#123</BoldLink>
      </>
    ),
    icon: CheckCircleIcon,
    variant: 'done',
    date: dates.three,
  },
  {
    label: 'Closed via commit',
    action: (
      <>
        closed this as{' '}
        <Link href="#" inline>
          completed
        </Link>{' '}
        in{' '}
        <Link className="font-mono text-xs font-semibold text-default" href="#">
          abc1234
        </Link>
      </>
    ),
    icon: CheckCircleIcon,
    variant: 'done',
    date: dates.four,
  },
  {
    label: 'Closed via project',
    action: (
      <>
        closed this as{' '}
        <Link href="#" inline>
          completed
        </Link>{' '}
        by moving to Done in <TableIcon aria-hidden="true" className="mr-1 inline-block align-middle" size={16} />
        <BoldLink href="#">Roadmap</BoldLink>
      </>
    ),
    icon: CheckCircleIcon,
    variant: 'done',
    date: dates.five,
  },
  {
    label: 'Closed as duplicate',
    action: (
      <>
        closed this as a{' '}
        <Link href="#" inline>
          duplicate
        </Link>{' '}
        of <IssueLink title="Fix the flaky avatar test" number="#42" icon={IssueClosedIcon} iconClassName="text-done" />
      </>
    ),
    icon: CircleSlashIcon,
    date: dates.six,
    badgeClassName: neutralBadge,
  },
  {label: 'Closed (no reason)', action: 'closed this', icon: CheckCircleIcon, variant: 'done', date: dates.seven},
]

const state: readonly EventFixture[] = [
  {label: 'Reopened', action: 'reopened this', icon: IssueReopenedIcon, variant: 'open', date: dates.one},
  {
    label: 'Transferred',
    action: (
      <>
        transferred this issue from{' '}
        <Link href="#" inline>
          octo-org/legacy-repo
        </Link>
      </>
    ),
    icon: LinkExternalIcon,
    date: dates.two,
  },
  {label: 'Pinned', action: 'pinned this issue', icon: PinIcon, date: dates.three},
  {label: 'Unpinned', action: 'unpinned this issue', icon: PinIcon, date: dates.four},
  {
    label: 'Converted to discussion',
    action: (
      <>
        converted this issue into a discussion <BoldLink href="#">#123</BoldLink>
      </>
    ),
    icon: CommentDiscussionIcon,
    date: dates.five,
  },
  {
    label: 'Converted from draft',
    action: 'converted this from a draft issue',
    icon: IssueDraftIcon,
    date: dates.six,
  },
]

function CommitReferences({multiple}: {multiple: boolean}) {
  const commits = multiple
    ? [
        ['Fix flaky avatar upload retry', 'abc1234'],
        ['Add regression test for retry path', 'def5678'],
        ['Document the retry backoff', '9a0b1c2'],
      ]
    : [['Fix flaky avatar upload retry', 'abc1234']]
  return (
    <div className="mt-2 flex flex-col gap-1">
      {commits.map(([message, oid], index) => (
        <div className="flex items-center justify-between gap-2" key={oid}>
          <Link href="#" className="block font-mono text-xs leading-[18px] text-muted hover:text-muted" muted>
            {message}
          </Link>
          {!multiple && index === 0 ? (
            <span>
              <Label variant="success">Verified</Label>{' '}
              <Link href="#" className="inline font-mono text-xs leading-[18px] text-muted hover:text-muted" muted>
                {oid}
              </Link>
            </span>
          ) : (
            <Link href="#" className="block font-mono text-xs leading-[18px] text-muted hover:text-muted" muted>
              {oid}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

function CommitReferenceEvent({multiple}: {multiple: boolean}) {
  const date = multiple ? dates.four : dates.three
  return (
    <VariantSection label={multiple ? 'Multiple commit references' : 'Single commit reference'}>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <GitCommitIcon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {multiple ? 'added 3 commits that reference this issue' : 'added a commit that references this issue'}{' '}
            <MutedTime date={new Date(date)} href="#" />
            <CommitReferences multiple={multiple} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  )
}

const duplicateReferences: readonly EventFixture[] = [
  {
    label: 'Marked as duplicate',
    action: (
      <>
        marked this as a duplicate of <IssueLink title="Upload fails on large avatars" number="#42" />{' '}
      </>
    ),
    icon: DuplicateIcon,
    date: dates.one,
    actions: <Button size="small">Undo</Button>,
  },
  {
    label: 'Marked as canonical',
    action: (
      <>
        marked <IssueLink title="Retry uploads on transient errors" number="#43" /> as a duplicate of this issue
      </>
    ),
    icon: DuplicateIcon,
    date: dates.two,
  },
  {
    label: 'Unmarked as duplicate',
    action: (
      <>
        unmarked this as a duplicate of <IssueLink title="Upload fails on large avatars" number="#42" />{' '}
      </>
    ),
    icon: DuplicateIcon,
    date: dates.three,
  },
  {
    label: 'Unmarked as canonical',
    action: (
      <>
        unmarked <IssueLink title="Retry uploads on transient errors" number="#43" /> as a duplicate of this issue
      </>
    ),
    icon: DuplicateIcon,
    date: dates.four,
  },
]

const moderation: readonly EventFixture[] = [
  {
    label: 'User blocked',
    action: (
      <>
        blocked <BoldLink href="#">six7</BoldLink>
      </>
    ),
    icon: BlockedIcon,
    date: dates.one,
  },
  {
    label: 'User temporarily blocked',
    action: (
      <>
        temporarily blocked <BoldLink href="#">six7</BoldLink>
      </>
    ),
    icon: BlockedIcon,
    date: dates.two,
  },
  {
    label: 'Comment pinned',
    action: (
      <>
        pinned a{' '}
        <Link href="#" inline>
          comment
        </Link>
      </>
    ),
    icon: PinIcon,
    date: dates.three,
  },
  {
    label: 'Comment unpinned',
    action: (
      <>
        unpinned a{' '}
        <Link href="#" inline>
          comment
        </Link>
      </>
    ),
    icon: PinIcon,
    date: dates.four,
  },
]

const issueTypes: readonly EventFixture[] = [
  {
    label: 'Issue type added',
    action: (
      <>
        added the <TokenValue text="Bug" className="border-danger-muted bg-danger-muted text-danger" /> issue type
      </>
    ),
    icon: IssueOpenedIcon,
    date: dates.one,
  },
  {
    label: 'Issue type removed',
    action: (
      <>
        removed the <TokenValue text="Bug" className="border-danger-muted bg-danger-muted text-danger" /> issue type
      </>
    ),
    icon: IssueOpenedIcon,
    date: dates.two,
  },
  {
    label: 'Issue type changed',
    action: (
      <>
        changed the issue type from{' '}
        <TokenValue text="Bug" className="border-danger-muted bg-danger-muted text-danger" /> to{' '}
        <TokenValue text="Feature" className="border-accent-muted bg-accent-muted text-accent" />
      </>
    ),
    icon: IssueOpenedIcon,
    date: dates.three,
  },
]

const hierarchy: readonly EventFixture[] = [
  {
    label: 'Sub-issue added (single)',
    action: 'added a sub-issue',
    icon: IssueTracksIcon,
    date: dates.one,
    references: [openIssueReference],
  },
  {
    label: 'Sub-issues added (multiple)',
    action: 'added sub-issues',
    icon: IssueTracksIcon,
    date: dates.two,
    references: [openIssueReference, closedIssueReference],
  },
  {
    label: 'Sub-issue removed (single)',
    action: 'removed a sub-issue',
    icon: IssueTracksIcon,
    date: dates.three,
    references: [openIssueReference],
  },
  {
    label: 'Sub-issues removed (multiple)',
    action: 'removed sub-issues',
    icon: IssueTracksIcon,
    date: dates.four,
    references: [openIssueReference, closedIssueReference],
  },
  {
    label: 'Parent issue added (single)',
    action: 'added a parent issue',
    icon: IssueTrackedByIcon,
    date: dates.five,
    references: [{title: 'Epic: reliable avatar uploads', number: '#7', iconClassName: 'text-open'}],
  },
  {
    label: 'Parent issues added (multiple)',
    action: 'added parent issues',
    icon: IssueTrackedByIcon,
    date: dates.six,
    references: [
      {title: 'Epic: reliable avatar uploads', number: '#7', iconClassName: 'text-open'},
      {title: 'Q3 reliability tracker', number: '#8', iconClassName: 'text-open'},
    ],
  },
  {
    label: 'Parent issue removed (single)',
    action: 'removed a parent issue',
    icon: IssueTrackedByIcon,
    date: dates.seven,
    references: [{title: 'Epic: reliable avatar uploads', number: '#7', iconClassName: 'text-open'}],
  },
  {
    label: 'Parent issues removed (multiple)',
    action: 'removed parent issues',
    icon: IssueTrackedByIcon,
    date: dates.eight,
    references: [
      {title: 'Epic: reliable avatar uploads', number: '#7', iconClassName: 'text-open'},
      {title: 'Q3 reliability tracker', number: '#8', iconClassName: 'text-open'},
    ],
  },
]

const dependencies: readonly EventFixture[] = [
  {
    label: 'Blocked by (single)',
    action: 'marked this as blocked',
    icon: BlockedIcon,
    date: dates.one,
    references: [{title: 'Upgrade the storage client', number: '#51', iconClassName: 'text-open'}],
  },
  {
    label: 'Blocked by (multiple)',
    action: 'marked this as blocked by 2 issues',
    icon: BlockedIcon,
    date: dates.two,
    references: [
      {title: 'Upgrade the storage client', number: '#51', iconClassName: 'text-open'},
      {title: 'Add multipart upload support', number: '#52', iconClassName: 'text-open'},
    ],
  },
  {
    label: 'Blocked by removed (single)',
    action: 'unmarked this as blocked',
    icon: BlockedIcon,
    date: dates.three,
    references: [{title: 'Upgrade the storage client', number: '#51', iconClassName: 'text-open'}],
  },
  {
    label: 'Blocked by removed (multiple)',
    action: 'unmarked this as blocked by 2 issues',
    icon: BlockedIcon,
    date: dates.four,
    references: [
      {title: 'Upgrade the storage client', number: '#51', iconClassName: 'text-open'},
      {title: 'Add multipart upload support', number: '#52', iconClassName: 'text-open'},
    ],
  },
  {
    label: 'Blocking (single)',
    action: 'marked this as blocking',
    icon: BlockedIcon,
    date: dates.five,
    references: [{title: 'Ship the avatar uploader', number: '#60', iconClassName: 'text-open'}],
  },
  {
    label: 'Blocking (multiple)',
    action: 'marked this as blocking 2 issues',
    icon: BlockedIcon,
    date: dates.six,
    references: [
      {title: 'Ship the avatar uploader', number: '#60', iconClassName: 'text-open'},
      {title: 'Roll out to mobile clients', number: '#61', iconClassName: 'text-open'},
    ],
  },
  {
    label: 'Blocking removed (single)',
    action: 'unmarked this as blocking',
    icon: BlockedIcon,
    date: dates.seven,
    references: [{title: 'Ship the avatar uploader', number: '#60', iconClassName: 'text-open'}],
  },
  {
    label: 'Blocking removed (multiple)',
    action: 'unmarked this as blocking 2 issues',
    icon: BlockedIcon,
    date: dates.eight,
    references: [
      {title: 'Ship the avatar uploader', number: '#60', iconClassName: 'text-open'},
      {title: 'Roll out to mobile clients', number: '#61', iconClassName: 'text-open'},
    ],
  },
]

function FieldName({children}: {children: React.ReactNode}) {
  return <span className="mx-1 font-semibold text-default">{children}</span>
}

function FieldValue({children}: {children: React.ReactNode}) {
  return (
    <Link href="#" inline className="ml-1">
      {children}
    </Link>
  )
}

const fields: readonly EventFixture[] = [
  {
    label: 'Set · text',
    action: (
      <>
        set <FieldName>Team</FieldName> to <FieldValue>Identity</FieldValue>
      </>
    ),
    icon: TypographyIcon,
    date: dates.one,
  },
  {
    label: 'Set · number',
    action: (
      <>
        set <FieldName>Story Points</FieldName> to <FieldValue>5</FieldValue>
      </>
    ),
    icon: NumberIcon,
    date: '2022-07-25T15:30:00Z',
  },
  {
    label: 'Set · date',
    action: (
      <>
        set <FieldName>Target Date</FieldName> to <FieldValue>Aug 1, 2022</FieldValue>
      </>
    ),
    icon: CalendarIcon,
    date: dates.two,
  },
  {
    label: 'Set · single select',
    action: (
      <>
        set <FieldName>Priority</FieldName> to{' '}
        <TokenValue text="High" className="border-danger-muted bg-danger-muted text-danger" />
      </>
    ),
    icon: SingleSelectIcon,
    date: dates.three,
  },
  {
    label: 'Changed · text',
    action: (
      <>
        changed <FieldName>Team</FieldName> to <FieldValue>Platform</FieldValue>
      </>
    ),
    icon: TypographyIcon,
    date: dates.four,
  },
  {
    label: 'Changed · number',
    action: (
      <>
        changed <FieldName>Story Points</FieldName> to <FieldValue>8</FieldValue>
      </>
    ),
    icon: NumberIcon,
    date: dates.five,
  },
  {
    label: 'Changed · date',
    action: (
      <>
        changed <FieldName>Target Date</FieldName> to <FieldValue>Aug 15, 2022</FieldValue>
      </>
    ),
    icon: CalendarIcon,
    date: dates.six,
  },
  {
    label: 'Changed · single select',
    action: (
      <>
        changed <FieldName>Priority</FieldName> to{' '}
        <TokenValue text="Low" className="border-success-muted bg-success-muted text-success" />
      </>
    ),
    icon: SingleSelectIcon,
    date: dates.seven,
  },
  {
    label: 'Cleared · text',
    action: (
      <>
        cleared <FieldName>Team</FieldName>
      </>
    ),
    icon: TypographyIcon,
    date: dates.eight,
  },
  {
    label: 'Cleared · number',
    action: (
      <>
        cleared <FieldName>Story Points</FieldName>
      </>
    ),
    icon: NumberIcon,
    date: '2022-07-18T09:00:00Z',
  },
  {
    label: 'Cleared · date',
    action: (
      <>
        cleared <FieldName>Target Date</FieldName>
      </>
    ),
    icon: CalendarIcon,
    date: '2022-07-17T12:00:00Z',
  },
  {
    label: 'Cleared · single select',
    action: (
      <>
        cleared <FieldName>Priority</FieldName>
      </>
    ),
    icon: SingleSelectIcon,
    date: '2022-07-16T08:30:00Z',
  },
  {
    label: 'Rollup · updated',
    action: (
      <>
        updated <FieldName>Team</FieldName>
        <FieldValue>Platform</FieldValue> and <FieldName>Story Points</FieldName>
        <FieldValue>8</FieldValue>
      </>
    ),
    icon: TypographyIcon,
    date: '2022-07-15T10:00:00Z',
  },
  {
    label: 'Rollup · removed',
    action: (
      <>
        removed <FieldName>Team</FieldName> and <FieldName>Priority</FieldName>
      </>
    ),
    icon: TypographyIcon,
    date: '2022-07-14T10:00:00Z',
  },
  {
    label: 'Rollup · updated and removed',
    action: (
      <>
        updated <FieldName>Team</FieldName>
        <FieldValue>Platform</FieldValue>, and also removed <FieldName>Priority</FieldName>
      </>
    ),
    icon: TypographyIcon,
    date: '2022-07-13T10:00:00Z',
  },
]

const projects: readonly EventFixture[] = [
  {
    label: 'Added to project',
    action: (
      <>
        added this to <TableIcon aria-hidden="true" className="mr-1 inline-block align-middle" size={16} />
        <Link href="#" inline className="text-default">
          Roadmap
        </Link>
      </>
    ),
    icon: TableIcon,
    date: dates.one,
  },
  {
    label: 'Removed from project',
    action: (
      <>
        removed this from <TableIcon aria-hidden="true" className="mr-1 inline-block align-middle" size={16} />
        <Link href="#" inline className="text-default">
          Roadmap
        </Link>
      </>
    ),
    icon: TableIcon,
    date: dates.two,
  },
]

const labels: readonly EventFixture[] = [
  {
    label: 'Label added',
    action: (
      <>
        added <TokenValue text="bug" className="border-danger-muted bg-danger-muted text-danger" />
      </>
    ),
    icon: TagIcon,
    date: dates.one,
  },
  {
    label: 'Label removed',
    action: (
      <>
        removed <TokenValue text="bug" className="border-danger-muted bg-danger-muted text-danger" />
      </>
    ),
    icon: TagIcon,
    date: dates.two,
  },
  {
    label: 'Labels added and removed',
    action: (
      <>
        added <TokenValue text="enhancement" className="border-accent-muted bg-accent-muted text-accent" /> and removed{' '}
        <TokenValue text="bug" className="border-danger-muted bg-danger-muted text-danger" />
      </>
    ),
    icon: TagIcon,
    date: dates.three,
  },
]

const assignments: readonly EventFixture[] = [
  {label: 'Self-assigned', action: 'self-assigned this', icon: PersonIcon, date: dates.one},
  {
    label: 'Assigned',
    action: (
      <>
        assigned <BoldLink href="#">hubot</BoldLink>
      </>
    ),
    icon: PersonIcon,
    date: dates.two,
  },
  {
    label: 'Assigned multiple',
    action: (
      <>
        assigned <BoldLink href="#">hubot</BoldLink> and <BoldLink href="#">octocat</BoldLink>
      </>
    ),
    icon: PersonIcon,
    date: dates.three,
  },
  {label: 'Self-unassigned', action: 'removed their assignment', icon: PersonIcon, date: dates.four},
  {
    label: 'Unassigned',
    action: (
      <>
        unassigned <BoldLink href="#">hubot</BoldLink>
      </>
    ),
    icon: PersonIcon,
    date: dates.five,
  },
  {
    label: 'Unassigned multiple',
    action: (
      <>
        unassigned <BoldLink href="#">hubot</BoldLink> and <BoldLink href="#">octocat</BoldLink>
      </>
    ),
    icon: PersonIcon,
    date: dates.six,
  },
]

export const EventClosed: Story = {render: () => renderFixtures(closed)}
export const EventState: Story = {render: () => renderFixtures(state)}
export const EventReferences: Story = {
  render: () => (
    <Examples className={examplesClassName}>
      <TimelineEvent
        label="Linked pull request"
        action={
          <>
            linked a pull request that will close this issue{' '}
            <GitPullRequestIcon aria-label="Open" className="mx-1 inline-block align-middle text-open" size={16} />
            <BoldLink href="#">Add retry logic to the uploader</BoldLink>
            <span className="text-muted">#42</span>
          </>
        }
        icon={CrossReferenceIcon}
        date={dates.one}
      />
      <TimelineEvent
        label="Unlinked pull request"
        action={
          <>
            removed a link to a pull request{' '}
            <GitPullRequestIcon aria-label="Open" className="mx-1 inline-block align-middle text-open" size={16} />
            <BoldLink href="#">Add retry logic to the uploader</BoldLink>
            <span className="text-muted">#42</span>
          </>
        }
        icon={GitPullRequestIcon}
        date={dates.two}
        badgeClassName="text-open"
      />
      <CommitReferenceEvent multiple={false} />
      <CommitReferenceEvent multiple />
    </Examples>
  ),
}
export const EventDuplicates: Story = {render: () => renderFixtures(duplicateReferences)}
export const EventModeration: Story = {render: () => renderFixtures(moderation)}
export const EventIssueTypes: Story = {render: () => renderFixtures(issueTypes)}
export const EventIssueHierarchy: Story = {render: () => renderFixtures(hierarchy)}
export const EventDependencies: Story = {render: () => renderFixtures(dependencies)}
export const EventIssueFields: Story = {render: () => renderFixtures(fields)}
export const EventProject: Story = {
  render: () => (
    <Examples className={examplesClassName}>
      {projects.map(fixture => (
        <TimelineEvent {...fixture} key={fixture.label} />
      ))}
      <VariantSection label="Project status changed">
        <Timeline aria-label="Issue timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <TableIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'moved this to In Progress in '}
              <TableIcon aria-hidden="true" className="mr-1 inline-block align-middle" size={16} />
              <Link href="#" inline className="text-default">
                Roadmap
              </Link>{' '}
              <MutedTime date={new Date(dates.three)} href="#" />
            </Timeline.Body>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Badge>
              <TableIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'moved this from Todo to In Progress in '}
              <TableIcon aria-hidden="true" className="mr-1 inline-block align-middle" size={16} />
              <Link href="#" inline className="text-default">
                Roadmap
              </Link>{' '}
              <MutedTime date={new Date('2022-07-24T16:42:00Z')} href="#" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}
export const EventLabels: Story = {render: () => renderFixtures(labels)}
export const EventTitle: Story = {
  render: () =>
    renderFixtures([
      {
        label: 'Title changed',
        action: (
          <>
            changed the title <del>Fix the uplaod bug</del> Fix the upload bug
          </>
        ),
        icon: PencilIcon,
        date: dates.four,
      },
    ]),
}
export const EventMilestones: Story = {
  render: () =>
    renderFixtures([
      {
        label: 'Added to milestone',
        action: (
          <>
            added this to the{' '}
            <Link href="#" inline className="text-default">
              v2.0
            </Link>{' '}
            milestone
          </>
        ),
        icon: MilestoneIcon,
        date: dates.one,
      },
      {
        label: 'Removed from milestone',
        action: (
          <>
            removed this from the{' '}
            <Link href="#" inline className="text-default">
              v2.0
            </Link>{' '}
            milestone
          </>
        ),
        icon: MilestoneIcon,
        date: dates.two,
      },
    ]),
}
export const EventAssignments: Story = {render: () => renderFixtures(assignments)}
export const EventLockUnlock: Story = {
  render: () => (
    <Examples className={examplesClassName}>
      <VariantSection label="Locked (with reason)">
        <Timeline aria-label="Issue timeline">
          {[
            ['off topic', dates.one],
            ['resolved', '2022-07-26T11:47:00Z'],
            ['spam', '2022-07-26T11:48:00Z'],
            ['too heated', '2022-07-26T11:49:00Z'],
          ].map(([reason, date]) => (
            <Timeline.Item key={reason}>
              <Timeline.Badge>
                <LockIcon aria-hidden="true" />
              </Timeline.Badge>
              <Timeline.Body>
                <UserActor href="#" muted />
                {`locked as ${reason} and limited conversation to collaborators `}
                <MutedTime date={new Date(date)} href="#" />
              </Timeline.Body>
            </Timeline.Item>
          ))}
        </Timeline>
      </VariantSection>
      <TimelineEvent
        label="Locked (no reason)"
        action="locked and limited conversation to collaborators"
        icon={LockIcon}
        date={dates.two}
      />
      <TimelineEvent label="Unlocked" action="unlocked this conversation" icon={UnlockIcon} date={dates.three} />
    </Examples>
  ),
}
export const EventCommentDeleted: Story = {
  render: () =>
    renderFixtures([
      {
        label: 'Comment deleted',
        action: (
          <>
            deleted a comment from{' '}
            <Link href="#" inline>
              octocat
            </Link>
          </>
        ),
        icon: TrashIcon,
        date: dates.one,
      },
    ]),
}

function CrossReference({
  icon: ReferenceIcon,
  title,
  number,
  iconClassName,
}: {
  icon: Icon
  title: string
  number: string
  iconClassName: string
}) {
  return (
    <li className="mt-1 first:mt-0">
      <ReferenceIcon
        aria-label="Open"
        className={`inline-block align-text-bottom text-open ${iconClassName}`}
        size={16}
      />
      <Link href="#" inline className="font-semibold">
        {title}
      </Link>
      <span className="text-muted"> {number}</span>
    </li>
  )
}

export const EventCrossReferences: Story = {
  render: () => (
    <Examples className={examplesClassName}>
      <VariantSection label="Mentioned in an issue">
        <Timeline aria-label="Issue timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <LinkExternalIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'mentioned this '}
              <MutedTime date={new Date(dates.one)} href="#" />
              <ul className="mt-2 ml-1 list-none p-0">
                <CrossReference
                  icon={IssueOpenedIcon}
                  title="Track flaky upload retries"
                  number="#128"
                  iconClassName="mr-1"
                />
              </ul>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
      <VariantSection label="Mentioned in a pull request">
        <Timeline aria-label="Issue timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <LinkExternalIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'mentioned this '}
              <MutedTime date={new Date(dates.two)} href="#" />
              <ul className="mt-2 ml-1 list-none p-0">
                <CrossReference
                  icon={GitPullRequestIcon}
                  title="Add retry logic to the uploader"
                  number="#42"
                  iconClassName="mx-1"
                />
              </ul>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
      <VariantSection label="Linked a closing pull request">
        <Timeline aria-label="Issue timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <LinkExternalIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'linked a pull request that will close this issue '}
              <MutedTime date={new Date(dates.three)} href="#" />
              <ul className="mt-2 ml-1 list-none p-0">
                <CrossReference
                  icon={GitPullRequestIcon}
                  title="Fix the upload retry race condition"
                  number="#57"
                  iconClassName="mx-1"
                />
              </ul>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}
