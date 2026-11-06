import type {ComponentProps, ElementType, ReactNode} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  CheckIcon,
  CircleSlashIcon,
  CommentIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  LawIcon,
  NoteIcon,
  ShieldCheckIcon,
  ShieldIcon,
  XIcon,
} from '@primer/octicons-react'
import {BranchName} from '../BranchName'
import {Button} from '../Button'
import {Link} from '../Link'
import {Timeline} from './Timeline'
import {EventSubRow, Examples, MutedTime, UserActor, VariantSection} from './Timeline.storyHelpers'

const meta = {title: 'React Tailwind/Layout/Timeline/Features/License Compliance', component: Timeline} satisfies Meta<
  typeof Timeline
>
export default meta
type Story = StoryObj<typeof meta>

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/hubot'
const LICENSE_BOT_AVATAR = 'https://avatars.githubusercontent.com/u/9919?s=40&v=4'

function PullRequestLink({number, title}: {number: number; title: string}) {
  return (
    <span className="mt-1 inline-flex items-center text-xs leading-normal">
      <GitPullRequestIcon aria-hidden="true" className="mr-2 text-success" size={16} />
      <Link className="text-default hover:text-default" href={`../../pull/${number}`} inline>
        {title} #{number}
      </Link>
    </span>
  )
}

function PolicyLink() {
  return (
    <Link href="../../settings/security_analysis" inline>
      license policy
    </Link>
  )
}

interface LicenseEventProps {
  action: ReactNode
  actor?: ReactNode
  date: string
  icon: ElementType
  label: string
  subRow?: ReactNode
  variant?: ComponentProps<typeof Timeline.Badge>['variant']
  actions?: ReactNode
}

function LicenseEvent({action, actor, date, icon: Icon, label, subRow, variant, actions}: LicenseEventProps) {
  return (
    <VariantSection label={label}>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant={variant}>
            <Icon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            {actor}
            {actor ? ' ' : null}
            {action} <MutedTime date={new Date(date)} />
            {subRow}
          </Timeline.Body>
          {actions ? <Timeline.Actions>{actions}</Timeline.Actions> : null}
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  )
}

const user = (login: string, src: string, href?: string) => <UserActor href={href} login={login} src={src} />

export const EventOpened: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action="opened this alert"
        actor={user('github-license-compliance[bot]', LICENSE_BOT_AVATAR)}
        date="2025-10-20T10:00:00Z"
        icon={ShieldIcon}
        label="Opened"
        variant="success"
      />
    </Examples>
  ),
}

export const EventAppearedInBranch: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action={
          <>
            Appeared in branch <BranchName href="../../tree/feature-branch">feature-branch</BranchName>
          </>
        }
        date="2025-10-20T10:01:00Z"
        icon={GitBranchIcon}
        label="Appeared in branch"
      />
    </Examples>
  ),
}

export const EventReviewRequested: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action="requested to close"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-21T09:00:00Z"
        icon={CommentIcon}
        label="Requested to close"
      />
      <LicenseEvent
        action="requested to close as used in tests"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-21T09:05:00Z"
        icon={CommentIcon}
        label="Requested to close as a specific reason (with comment)"
        subRow={<EventSubRow icon={NoteIcon}>This dependency is only pulled in by our test harness.</EventSubRow>}
      />
      <LicenseEvent
        action="requested to close"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        actions={
          <Button size="small" variant="primary">
            Review request
          </Button>
        }
        date="2025-10-21T09:10:00Z"
        icon={CommentIcon}
        label="Requested to close with a pull request (latest — shows Review request)"
        subRow={<PullRequestLink number={42} title="Replace GPL dependency" />}
      />
    </Examples>
  ),
}

export const EventReviewApproved: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action="approved closure request"
        actor={user('hubot', HUBOT_AVATAR, 'https://github.com/hubot')}
        date="2025-10-22T10:00:00Z"
        icon={CheckIcon}
        label="Approved closure request"
      />
      <LicenseEvent
        action="approved closure request"
        actor={user('hubot', HUBOT_AVATAR, 'https://github.com/hubot')}
        date="2025-10-22T10:05:00Z"
        icon={CheckIcon}
        label="Approved closure request (with comment)"
        subRow={<EventSubRow icon={NoteIcon}>Agreed — test-only usage is within policy.</EventSubRow>}
      />
    </Examples>
  ),
}

export const EventReviewDenied: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action="denied closure request"
        actor={user('hubot', HUBOT_AVATAR, 'https://github.com/hubot')}
        date="2025-10-22T11:00:00Z"
        icon={XIcon}
        label="Denied closure request"
      />
      <LicenseEvent
        action="denied closure request"
        actor={user('hubot', HUBOT_AVATAR, 'https://github.com/hubot')}
        date="2025-10-22T11:05:00Z"
        icon={XIcon}
        label="Denied closure request (with comment)"
        subRow={
          <EventSubRow icon={NoteIcon}>
            This package is distributed to customers, so the license still applies.
          </EventSubRow>
        }
      />
    </Examples>
  ),
}

export const EventReviewExpired: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action="Request to close expired"
        actor={user('github-license-compliance[bot]', LICENSE_BOT_AVATAR)}
        date="2025-10-23T10:00:00Z"
        icon={CircleSlashIcon}
        label="Request to close expired"
      />
    </Examples>
  ),
}

export const EventExceptionAdded: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action={
          <>
            added npm/left-pad to <PolicyLink /> for monalisa/octo-app
          </>
        }
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-23T12:00:00Z"
        icon={LawIcon}
        label="Added a package exception to the license policy"
      />
      <LicenseEvent
        action="created exception"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-23T12:05:00Z"
        icon={LawIcon}
        label="Created exception (fallback)"
      />
    </Examples>
  ),
}

export const EventLicensesAdded: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action={
          <>
            added MIT, Apache-2.0 to <PolicyLink /> for monalisa/octo-app
          </>
        }
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-24T12:00:00Z"
        icon={LawIcon}
        label="Added licenses to the license policy"
      />
      <LicenseEvent
        action="added to approved licenses"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-24T12:05:00Z"
        icon={LawIcon}
        label="Added to approved licenses (fallback)"
      />
    </Examples>
  ),
}

export const EventClosed: Story = {
  render: () => (
    <Examples>
      <LicenseEvent
        action="closed as amendment"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-25T10:00:00Z"
        icon={ShieldCheckIcon}
        label="Closed as amendment (with comment)"
        subRow={<EventSubRow icon={NoteIcon}>Added a policy exception covering this package.</EventSubRow>}
        variant="done"
      />
      <LicenseEvent
        action="closed as private package"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-25T10:05:00Z"
        icon={ShieldCheckIcon}
        label="Closed as private package"
        variant="done"
      />
      <LicenseEvent
        action="closed as inaccurate license"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-25T10:10:00Z"
        icon={ShieldCheckIcon}
        label="Closed as inaccurate license"
        variant="done"
      />
      <LicenseEvent
        action="closed as policy edited"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-25T10:15:00Z"
        icon={ShieldCheckIcon}
        label="Closed as policy edited"
        variant="done"
      />
      <LicenseEvent
        action="closed as fixed"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-25T10:20:00Z"
        icon={ShieldCheckIcon}
        label="Closed as fixed"
        variant="done"
      />
      <LicenseEvent
        action="closed as outdated"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-25T10:25:00Z"
        icon={ShieldCheckIcon}
        label="Closed as outdated"
        variant="done"
      />
      <LicenseEvent
        action="closed this alert"
        actor={user('monalisa', MONALISA_AVATAR, 'https://github.com/monalisa')}
        date="2025-10-25T10:30:00Z"
        icon={ShieldCheckIcon}
        label="Closed this alert (default)"
        variant="done"
      />
    </Examples>
  ),
}
