import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  CheckIcon,
  CommentIcon,
  GitBranchIcon,
  NoteIcon,
  PersonIcon,
  RepoPushIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldSlashIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react'
import {Button} from '../Button'
import {Label} from '../Label'
import {Link} from '../Link'
import {LinkButton} from '../LinkButton'
import {Timeline} from './Timeline'
import {
  BoldLink,
  EventSubRow,
  Examples,
  InlineAvatar,
  MutedTime,
  UserActor,
  VariantSection,
} from './Timeline.storyHelpers'

const meta = {title: 'React Tailwind/Layout/Timeline/Features/Dependabot', component: Timeline} satisfies Meta<
  typeof Timeline
>
export default meta
type Story = StoryObj<typeof meta>

const DEPENDABOT_AVATAR = 'https://avatars.githubusercontent.com/u/27347476?v=4'
const SIX7_AVATAR = 'https://avatars.githubusercontent.com/u/4548309?v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/u/480938?v=4'

function DependabotActor() {
  return (
    <>
      <InlineAvatar shape="square" src={DEPENDABOT_AVATAR} />
      <BoldLink href="#" muted>
        dependabot
      </BoldLink>
      <Label className="mr-1 align-middle" variant="secondary">
        bot
      </Label>
    </>
  )
}

function PushPill({sha}: {sha: string}) {
  return (
    <code className="font-mono">
      <Link
        className="inline-block rounded-md bg-accent-muted px-1 py-0.5 font-mono text-xs text-accent no-underline hover:no-underline"
        href="#"
      >
        {sha}
      </Link>
    </code>
  )
}

function TimelineEvent({
  actions,
  badge,
  badgeVariant,
  children,
  label,
}: {
  actions?: React.ReactNode
  badge: React.ReactNode
  badgeVariant?: React.ComponentProps<typeof Timeline.Badge>['variant']
  children: React.ReactNode
  label: string
}) {
  return (
    <VariantSection label={label}>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant={badgeVariant}>{badge}</Timeline.Badge>
          <Timeline.Body>{children}</Timeline.Body>
          {actions ? <Timeline.Actions>{actions}</Timeline.Actions> : null}
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  )
}

const Time = ({date}: {date: string}) => <MutedTime date={new Date(date)} />
const SuccessShield = () => (
  <Timeline.Badge variant="success">
    <ShieldIcon aria-hidden="true" />
  </Timeline.Badge>
)

export const EventOpened: Story = {
  render: () => (
    <Examples>
      <VariantSection label="Opened">
        <Timeline aria-label="Dependabot alert timeline">
          <Timeline.Item>
            <SuccessShield />
            <Timeline.Body>
              <DependabotActor />
              {'opened this '}
              <Time date="2022-07-26T11:46:07Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
      <VariantSection label="Opened from pull request">
        <Timeline aria-label="Dependabot alert timeline">
          <Timeline.Item>
            <SuccessShield />
            <Timeline.Body>
              <DependabotActor />
              {'opened this from '}
              <BoldLink href="#">#123</BoldLink> <Time date="2022-07-26T11:46:07Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
      <VariantSection label="Opened from push">
        <Timeline aria-label="Dependabot alert timeline">
          <Timeline.Item>
            <SuccessShield />
            <Timeline.Body>
              <DependabotActor />
              {'opened this from '}
              <PushPill sha="adfc29a" /> <Time date="2022-07-26T11:46:07Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}

export const EventFixed: Story = {
  render: () => (
    <Examples>
      <TimelineEvent badge={<ShieldCheckIcon aria-hidden="true" />} badgeVariant="done" label="Fixed">
        <DependabotActor />
        {'closed this as completed '}
        <Time date="2022-08-01T09:30:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<ShieldCheckIcon aria-hidden="true" />} badgeVariant="done" label="Fixed via pull request">
        <DependabotActor />
        {'closed this as completed in '}
        <BoldLink href="#">#123</BoldLink> <Time date="2022-08-01T09:30:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<ShieldCheckIcon aria-hidden="true" />} badgeVariant="done" label="Fixed via push">
        <DependabotActor />
        {'closed this as completed in '}
        <PushPill sha="adfc29a" /> <Time date="2022-08-01T09:30:00Z" />
      </TimelineEvent>
    </Examples>
  ),
}

export const EventDismissed: Story = {
  render: () => (
    <Examples>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Dismissed as risk is tolerable">
        <UserActor href="#" muted />
        {'dismissed this as risk is tolerable '}
        <Time date="2022-08-02T14:10:00Z" />
        <EventSubRow icon={NoteIcon}>
          This dependency is only used in our test tooling, so the risk is acceptable.
        </EventSubRow>
      </TimelineEvent>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Dismissed as fix started">
        <UserActor href="#" muted />
        {'dismissed this as fix started '}
        <Time date="2022-08-02T14:10:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Dismissed as no bandwidth">
        <UserActor href="#" muted />
        {'dismissed this as no bandwidth to fix this '}
        <Time date="2022-08-02T14:10:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Dismissed as not used">
        <UserActor href="#" muted />
        {'dismissed this as vulnerable code is not actually used '}
        <Time date="2022-08-02T14:10:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Dismissed as inaccurate">
        <UserActor href="#" muted />
        {'dismissed this as inaccurate '}
        <Time date="2022-08-02T14:10:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Auto-dismissed by alert rule">
        <DependabotActor />
        {'dismissed this due to an alert rule '}
        <Time date="2022-08-03T08:00:00Z" />
        <EventSubRow icon={NoteIcon}>
          {'Rule created and '}
          <Link href="#" inline>
            low-severity-dev-deps
          </Link>
          {' was applied'}
        </EventSubRow>
      </TimelineEvent>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Auto-dismissed from pull request">
        <DependabotActor />
        {'dismissed this due to an alert rule from '}
        <BoldLink href="#">#123</BoldLink> <Time date="2022-08-03T08:00:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<ShieldSlashIcon aria-hidden="true" />} label="Auto-dismissed from push">
        <DependabotActor />
        {'dismissed this due to an alert rule from '}
        <PushPill sha="adfc29a" /> <Time date="2022-08-03T08:00:00Z" />
      </TimelineEvent>
    </Examples>
  ),
}

export const EventReopened: Story = {
  render: () => (
    <Examples>
      <TimelineEvent badge={<SyncIcon aria-hidden="true" />} badgeVariant="success" label="Reopened">
        <UserActor href="#" muted />
        {'reopened this '}
        <Time date="2022-08-04T10:15:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<SyncIcon aria-hidden="true" />} badgeVariant="success" label="Reintroduced">
        <DependabotActor />
        {'reopened this '}
        <Time date="2022-08-05T11:00:00Z" />
      </TimelineEvent>
      <TimelineEvent
        badge={<SyncIcon aria-hidden="true" />}
        badgeVariant="success"
        label="Reintroduced from pull request"
      >
        <DependabotActor />
        {'reopened this from '}
        <BoldLink href="#">#123</BoldLink> <Time date="2022-08-05T11:00:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<SyncIcon aria-hidden="true" />} badgeVariant="success" label="Reintroduced from push">
        <DependabotActor />
        {'reopened this from '}
        <PushPill sha="adfc29a" /> <Time date="2022-08-05T11:00:00Z" />
      </TimelineEvent>
      <TimelineEvent
        badge={<SyncIcon aria-hidden="true" />}
        badgeVariant="success"
        label="Auto-reopened by rule change"
      >
        <DependabotActor />
        {'reopened this '}
        <Time date="2022-08-06T09:45:00Z" />
        <EventSubRow icon={NoteIcon}>
          {'Rule disabled: '}
          <Link href="#" inline>
            low-severity-dev-deps
          </Link>
        </EventSubRow>
      </TimelineEvent>
    </Examples>
  ),
}

export const EventDismissalRequest: Story = {
  render: () => (
    <Examples>
      <TimelineEvent
        actions={
          <Button size="small" variant="primary">
            Review request
          </Button>
        }
        badge={<CommentIcon aria-hidden="true" className="text-attention" />}
        label="Dismissal requested"
      >
        <UserActor href="#" muted />
        {'requested to dismiss this as '}
        <strong>Tolerable risk</strong> <Time date="2022-08-07T13:20:00Z" />
        <EventSubRow icon={NoteIcon}>
          This dependency is only used in our test tooling, so the risk is acceptable.
        </EventSubRow>
      </TimelineEvent>
      <TimelineEvent badge={<CheckIcon aria-hidden="true" className="text-success" />} label="Dismissal approved">
        <UserActor href="#" muted />
        {'approved dismissal '}
        <Time date="2022-08-08T10:05:00Z" />
        <EventSubRow icon={NoteIcon}>Confirmed this dependency is dev-only — approving the dismissal.</EventSubRow>
      </TimelineEvent>
      <TimelineEvent badge={<XIcon aria-hidden="true" className="text-danger" />} label="Dismissal denied">
        <UserActor href="#" muted />
        {'denied dismissal '}
        <Time date="2022-08-08T15:40:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<XIcon aria-hidden="true" className="text-muted" />} label="Dismissal cancelled">
        <UserActor href="#" muted />
        {'cancelled their dismissal request '}
        <Time date="2022-08-09T09:00:00Z" />
      </TimelineEvent>
    </Examples>
  ),
}

export const EventAssignment: Story = {
  render: () => (
    <Examples>
      <TimelineEvent badge={<PersonIcon aria-hidden="true" />} label="Self-assigned">
        <UserActor href="#" muted />
        {'self-assigned this '}
        <Time date="2022-08-10T09:00:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<PersonIcon aria-hidden="true" />} label="Assigned another user">
        <UserActor href="#" muted />
        {'assigned '}
        <UserActor href="#" login="six7" muted src={SIX7_AVATAR} /> <Time date="2022-08-10T09:05:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<PersonIcon aria-hidden="true" />} label="Removed own assignment">
        <UserActor href="#" muted />
        {'removed their assignment '}
        <Time date="2022-08-10T09:10:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<PersonIcon aria-hidden="true" />} label="Unassigned another user">
        <UserActor href="#" muted />
        {'unassigned '}
        <UserActor href="#" login="six7" muted src={SIX7_AVATAR} /> <Time date="2022-08-10T09:15:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<PersonIcon aria-hidden="true" />} label="Assigned and unassigned">
        <UserActor href="#" muted />
        {'assigned '}
        <UserActor href="#" login="six7" muted src={SIX7_AVATAR} />
        {' and unassigned '}
        <UserActor href="#" login="hubot" muted src={HUBOT_AVATAR} /> <Time date="2022-08-10T09:20:00Z" />
      </TimelineEvent>
    </Examples>
  ),
}

export const EventCopilotWork: Story = {
  render: () => (
    <Examples>
      <TimelineEvent
        actions={
          <LinkButton href="#" size="small">
            View session
          </LinkButton>
        }
        badge={<GitBranchIcon aria-hidden="true" />}
        label="Work started"
      >
        <strong>Copilot</strong>
        {' started work on behalf of '}
        <UserActor href="#" muted /> <Time date="2022-08-11T10:00:00Z" />
      </TimelineEvent>
      <TimelineEvent badge={<RepoPushIcon aria-hidden="true" />} label="Work finished">
        <strong>Copilot</strong>
        {' finished work on behalf of '}
        <UserActor href="#" muted /> <Time date="2022-08-11T10:45:00Z" />
      </TimelineEvent>
    </Examples>
  ),
}
