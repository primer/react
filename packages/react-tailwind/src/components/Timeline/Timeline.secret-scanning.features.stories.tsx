import type {ComponentProps, ElementType, ReactNode} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  AlertIcon,
  CheckCircleIcon,
  CommentIcon,
  FileAddedIcon,
  FileRemovedIcon,
  PersonIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldSlashIcon,
  SkipIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react'
import {Button} from '../Button'
import {Timeline} from './Timeline'
import {GitHubActor, MutedTime, RealisticTimeline, UserActor, VariantSection} from './Timeline.storyHelpers'

const meta = {title: 'React Tailwind/Layout/Timeline/Features/Secret Scanning', component: Timeline} satisfies Meta<
  typeof Timeline
>
export default meta
type Story = StoryObj<typeof meta>

const SIX7_AVATAR = 'https://avatars.githubusercontent.com/u/4548309?v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/u/480938?v=4'
const DEFAULT_SECRET_ACTOR = <UserActor size={16} />

interface SecretEventProps {
  action: ReactNode
  actor?: ReactNode
  actions?: ReactNode
  date: string
  icon: ElementType
  label: string
  subRow?: ReactNode
  variant?: ComponentProps<typeof Timeline.Badge>['variant']
}

function SmallEventSubRow({children, icon: Icon}: {children: ReactNode; icon: ElementType}) {
  return (
    <div className="mt-1 flex items-center gap-1 text-xs leading-[18px] text-muted">
      <Icon aria-hidden="true" size={12} />
      <span>{children}</span>
    </div>
  )
}

function SecretEvent({
  action,
  actor = DEFAULT_SECRET_ACTOR,
  actions,
  date,
  icon: Icon,
  label,
  subRow,
  variant,
}: SecretEventProps) {
  return (
    <VariantSection label={label}>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant={variant}>
            <Icon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            {actor}
            {action} <MutedTime date={new Date(date)} />
            {subRow}
          </Timeline.Body>
          {actions ? <Timeline.Actions>{actions}</Timeline.Actions> : null}
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  )
}

export const EventCreated: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent
        action="opened this alert"
        actor={<GitHubActor />}
        date="2022-07-26T11:46:07Z"
        icon={ShieldIcon}
        label="Created"
        variant="success"
      />
    </RealisticTimeline>
  ),
}

export const EventResolution: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent
        action={
          <>
            closed this as <strong>revoked</strong>
          </>
        }
        date="2022-07-26T11:46:07Z"
        icon={ShieldCheckIcon}
        label="Closed as revoked"
        subRow={
          <SmallEventSubRow icon={CommentIcon}>
            Rotated the leaked token and confirmed the provider revoked it.
          </SmallEventSubRow>
        }
        variant="done"
      />
      <SecretEvent
        action={
          <>
            closed this as <strong>false positive</strong>
          </>
        }
        date="2022-07-25T09:12:00Z"
        icon={ShieldSlashIcon}
        label="Closed as false positive"
      />
      <SecretEvent
        action={
          <>
            closed this as <strong>won&apos;t fix</strong>
          </>
        }
        date="2022-07-24T16:40:00Z"
        icon={ShieldSlashIcon}
        label="Closed as won't fix"
      />
      <SecretEvent
        action={
          <>
            closed this as <strong>used in tests</strong>
          </>
        }
        date="2022-07-23T11:05:00Z"
        icon={ShieldSlashIcon}
        label="Closed as used in tests"
      />
      <SecretEvent
        action={
          <>
            closed this as <strong>pattern deleted</strong>
          </>
        }
        date="2022-07-22T14:18:00Z"
        icon={ShieldSlashIcon}
        label="Closed as pattern deleted"
      />
      <SecretEvent
        action={
          <>
            closed this as <strong>pattern edited</strong>
          </>
        }
        date="2022-07-21T08:02:00Z"
        icon={ShieldSlashIcon}
        label="Closed as pattern edited"
      />
      <SecretEvent
        action={
          <>
            closed this as <strong>ignored by configuration</strong>
          </>
        }
        date="2022-07-20T10:33:00Z"
        icon={ShieldSlashIcon}
        label="Closed as ignored by configuration"
      />
      <VariantSection label="Reopened">
        <Timeline aria-label="Secret scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <ShieldSlashIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor size={16} />
              closed this as <strong>false positive</strong> <MutedTime date={new Date('2022-07-26T18:20:00Z')} />
            </Timeline.Body>
          </Timeline.Item>
          <Timeline.Break />
          <Timeline.Item>
            <Timeline.Badge variant="success">
              <SyncIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor size={16} />
              reopened this <MutedTime date={new Date('2022-07-27T12:00:00Z')} />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </RealisticTimeline>
  ),
}

export const EventBypass: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent
        action="bypassed push protection"
        date="2022-07-26T11:46:07Z"
        icon={AlertIcon}
        label="Bypassed push protection"
      />
      <SecretEvent
        action="requested bypass privileges"
        date="2022-07-26T11:50:00Z"
        icon={CommentIcon}
        label="Bypass requested (delegated bypass enabled)"
      />
      <SecretEvent
        action="approved a bypass"
        date="2022-07-26T12:10:00Z"
        icon={CheckCircleIcon}
        label="Bypass approved (delegated bypass enabled)"
      />
    </RealisticTimeline>
  ),
}

export const EventValidityChange: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent
        action="verified this secret is active"
        actor={<GitHubActor />}
        date="2022-07-26T11:46:07Z"
        icon={AlertIcon}
        label="Validity: active (automated)"
        variant="danger"
      />
      <SecretEvent
        action="set validity to active"
        date="2022-07-26T13:00:00Z"
        icon={AlertIcon}
        label="Validity: active (manual)"
        variant="danger"
      />
      <SecretEvent
        action="verified this secret is inactive"
        actor={<GitHubActor />}
        date="2022-07-26T11:46:07Z"
        icon={SkipIcon}
        label="Validity: inactive (automated)"
      />
      <SecretEvent
        action="set validity to inactive"
        date="2022-07-26T13:05:00Z"
        icon={SkipIcon}
        label="Validity: inactive (manual)"
      />
      <SecretEvent
        action="is unable to determine the validity of this secret"
        actor={<GitHubActor />}
        date="2022-07-26T11:46:07Z"
        icon={AlertIcon}
        label="Validity: unknown (automated)"
        variant="attention"
      />
      <SecretEvent
        action="set validity to unknown"
        date="2022-07-26T13:10:00Z"
        icon={AlertIcon}
        label="Validity: unknown (manual)"
        variant="attention"
      />
    </RealisticTimeline>
  ),
}

export const EventReport: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent action="reported this secret" date="2022-07-26T11:46:07Z" icon={ShieldCheckIcon} label="Reported" />
    </RealisticTimeline>
  ),
}

export const EventMetadata: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent
        action="found extended metadata about this secret"
        actor={<GitHubActor />}
        date="2022-07-26T11:46:07Z"
        icon={FileAddedIcon}
        label="Extended metadata found"
      />
      <SecretEvent
        action="removed extended metadata after it expired"
        actor={<GitHubActor />}
        date="2022-07-26T11:46:07Z"
        icon={FileRemovedIcon}
        label="Extended metadata removed"
      />
    </RealisticTimeline>
  ),
}

export const EventClosureRequest: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent
        action="requested to dismiss this as false positive"
        actions={
          <Button size="small" variant="primary">
            Review request
          </Button>
        }
        date="2022-07-26T11:46:07Z"
        icon={CommentIcon}
        label="Dismissal requested (reviewer view)"
        subRow={
          <SmallEventSubRow icon={CommentIcon}>This token only ever pointed at our throwaway sandbox.</SmallEventSubRow>
        }
      />
      <SecretEvent
        action="requested to dismiss this as false positive"
        actions={
          <Button size="small" variant="invisible">
            Cancel request
          </Button>
        }
        date="2022-07-26T11:46:07Z"
        icon={CommentIcon}
        label="Dismissal requested (requester view)"
      />
      <SecretEvent
        action="approved dismissal"
        date="2022-07-26T12:30:00Z"
        icon={CheckCircleIcon}
        label="Dismissal approved"
        subRow={<SmallEventSubRow icon={CommentIcon}>Confirmed — safe to dismiss.</SmallEventSubRow>}
        actor={<UserActor login="six7" size={16} src={SIX7_AVATAR} />}
      />
      <SecretEvent
        action="denied dismissal"
        date="2022-07-26T12:35:00Z"
        icon={XIcon}
        label="Dismissal denied"
        subRow={<SmallEventSubRow icon={CommentIcon}>Please rotate the secret before dismissing.</SmallEventSubRow>}
        actor={<UserActor login="six7" size={16} src={SIX7_AVATAR} />}
      />
      <SecretEvent
        action="cancelled request to dismiss"
        date="2022-07-26T12:40:00Z"
        icon={SkipIcon}
        label="Dismissal request cancelled"
      />
    </RealisticTimeline>
  ),
}

export const EventAssignment: Story = {
  render: () => (
    <RealisticTimeline>
      <SecretEvent action="self-assigned this" date="2022-07-26T11:46:07Z" icon={PersonIcon} label="Self-assigned" />
      <SecretEvent
        action={
          <>
            assigned <UserActor login="six7" size={16} src={SIX7_AVATAR} />
          </>
        }
        date="2022-07-26T11:50:00Z"
        icon={PersonIcon}
        label="Assigned another user"
      />
      <SecretEvent
        action="removed their assignment"
        date="2022-07-26T11:55:00Z"
        icon={PersonIcon}
        label="Removed own assignment"
      />
      <SecretEvent
        action={
          <>
            unassigned <UserActor login="six7" size={16} src={SIX7_AVATAR} />
          </>
        }
        date="2022-07-26T12:00:00Z"
        icon={PersonIcon}
        label="Unassigned another user"
      />
      <SecretEvent
        action={
          <>
            assigned <UserActor login="six7" size={16} src={SIX7_AVATAR} /> and unassigned{' '}
            <UserActor login="hubot" size={16} src={HUBOT_AVATAR} />
          </>
        }
        date="2022-07-26T12:05:00Z"
        icon={PersonIcon}
        label="Assigned and unassigned"
      />
    </RealisticTimeline>
  ),
}
