import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  CheckIcon,
  CommentIcon,
  DotFillIcon,
  GitBranchIcon,
  NoteIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldXIcon,
  XIcon,
} from '@primer/octicons-react'
import {Button} from '../Button'
import {Label} from '../Label'
import {Link} from '../Link'
import {Timeline} from './Timeline'
import {EventSubRow, Examples, MutedTime, RealisticTimeline, UserActor, VariantSection} from './Timeline.storyHelpers'

const meta = {title: 'React Tailwind/Layout/Timeline/Features/Code Scanning', component: Timeline} satisfies Meta<
  typeof Timeline
>

export default meta
type Story = StoryObj<typeof meta>

const Ref = ({name}: {name: string}) => <span className="font-semibold text-default">{name}</span>

function Time({date}: {date: string}) {
  return (
    <>
      {' '}
      <MutedTime date={new Date(date)} />
    </>
  )
}

function MonoPill({children}: {children: React.ReactNode}) {
  return (
    <span className="ml-1 inline-block rounded-sm bg-muted px-1 font-mono text-xs text-default align-middle">
      {children}
    </span>
  )
}

function ConfigPill({category}: {category: string}) {
  return (
    <>
      {' in configuration'}
      <MonoPill>{category}</MonoPill>
    </>
  )
}

function SubRow({children}: {children: React.ReactNode}) {
  return <div className="mt-2 pl-1 text-xs leading-[18px] text-muted">{children}</div>
}

const BoldBody = ({children}: {children: React.ReactNode}) => (
  <span className="font-semibold text-default">{children}</span>
)
const Reason = ({children}: {children: React.ReactNode}) => (
  <span className="font-semibold text-default">{children}</span>
)

export const EventDetected: Story = {
  render: () => (
    <Examples>
      <VariantSection label="First detected in commit">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <ShieldIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <BoldBody>First detected in commit</BoldBody>
              <Time date="2024-01-08T11:46:07Z" />
              <SubRow>
                {'src/components/'}
                <span className="font-semibold text-default">Button.tsx:42 on branch</span> <Ref name="main" />
              </SubRow>
            </Timeline.Body>
            <Timeline.Actions>
              <Label size="small" title="Label: Tool version 2.15.0" variant="secondary">
                2.15.0
              </Label>
            </Timeline.Actions>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Appeared in branch">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <GitBranchIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <BoldBody>Appeared in branch</BoldBody> <Ref name="main" />
              <Time date="2024-01-09T09:30:00Z" />
              <SubRow>
                <ShieldIcon aria-label="Workflow succeeded" className="mr-1 inline-block text-success align-middle" />
                <Link className="font-semibold text-default hover:text-accent" href="#">
                  CodeQL #128:
                </Link>{' '}
                Commit
                <Link className="ml-1 font-mono text-muted" href="#">
                  adfc29a
                </Link>
              </SubRow>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Reappeared in branch">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <ShieldIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <BoldBody>Reappeared in branch</BoldBody> <Ref name="main" />
              <ConfigPill category="rust" />
              <Time date="2024-01-10T14:05:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}

export const EventFixed: Story = {
  render: () => (
    <RealisticTimeline>
      <VariantSection label="Fixed in branch (current ref)">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge variant="done">
              <ShieldCheckIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <BoldBody>Fixed in branch</BoldBody> <Ref name="main" />
              <Time date="2024-01-12T10:15:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Fixed in branch (other ref)">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <CheckIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <BoldBody>Fixed in branch</BoldBody> <Ref name="feature-x" />
              <Time date="2024-01-12T10:15:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Configuration deleted (current ref)">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge variant="done">
              <ShieldCheckIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <BoldBody>Closed as</BoldBody> <MonoPill>java</MonoPill>{' '}
              <BoldBody>configuration was deleted in branch</BoldBody> <Ref name="main" />
              <Time date="2024-01-13T16:40:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Configuration deleted (other ref)">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <CheckIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <BoldBody>Closed as</BoldBody> <MonoPill>java</MonoPill>{' '}
              <BoldBody>configuration was deleted in branch</BoldBody> <Ref name="feature-x" />
              <Time date="2024-01-13T16:40:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </RealisticTimeline>
  ),
}

export const EventClosedByUser: Story = {
  render: () => (
    <Examples>
      <VariantSection label="Closed as false positive">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge variant="danger">
              <ShieldXIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'closed this as '}
              <Reason>false positive</Reason> <Time date="2024-01-14T08:20:00Z" />
              <EventSubRow icon={NoteIcon}>Verified this pattern only appears in generated fixtures.</EventSubRow>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Closed as used in tests">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge variant="danger">
              <ShieldXIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'closed this as '}
              <Reason>used in tests</Reason> <Time date="2024-01-14T08:20:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Closed as won't fix">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge variant="danger">
              <ShieldXIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'closed this as '}
              <Reason>won&apos;t fix</Reason> <Time date="2024-01-14T08:20:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Closed (no resolution)">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge variant="danger">
              <ShieldXIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'closed this '}
              <Time date="2024-01-14T08:20:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}

export const EventReopened: Story = {
  render: () => (
    <Examples>
      <VariantSection label="Reopened">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge variant="success">
              <DotFillIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'reopened this '}
              <Time date="2024-01-15T11:05:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}

export const EventDismissalRequested: Story = {
  render: () => (
    <Examples>
      <VariantSection label="Requested to dismiss">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <CommentIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'requested to dismiss this as false positive '}
              <Time date="2024-01-16T09:00:00Z" />
              <EventSubRow icon={NoteIcon}>This finding is a test-only helper, safe to dismiss.</EventSubRow>
            </Timeline.Body>
            <Timeline.Actions>
              <Button size="small" variant="primary">
                Review request
              </Button>
            </Timeline.Actions>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}

export const EventDismissalReviewed: Story = {
  render: () => (
    <Examples>
      <VariantSection label="Approved dismissal">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <CheckIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'approved dismissal '}
              <Time date="2024-01-17T13:30:00Z" />
              <EventSubRow icon={NoteIcon}>Agreed — this rule does not apply to test fixtures.</EventSubRow>
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>

      <VariantSection label="Denied dismissal">
        <Timeline aria-label="Code scanning alert timeline">
          <Timeline.Item>
            <Timeline.Badge>
              <XIcon aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
              <UserActor href="#" muted />
              {'denied dismissal '}
              <Time date="2024-01-17T13:30:00Z" />
            </Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </VariantSection>
    </Examples>
  ),
}
