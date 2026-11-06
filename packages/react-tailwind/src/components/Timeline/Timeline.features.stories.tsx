import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  CheckIcon,
  CrossReferenceIcon,
  FlameIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  HeartIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  LockIcon,
  RepoPushIcon,
  SkipIcon,
  TasklistIcon,
  XIcon,
} from '@primer/octicons-react'
import {Avatar} from '../Avatar'
import {BranchName} from '../BranchName'
import {Button} from '../Button'
import {Label} from '../Label'
import {Link} from '../Link'
import {RelativeTime} from '../RelativeTime'
import {StateLabel} from '../StateLabel'
import {Timeline} from './Timeline'
import {BoldLink, Examples, InlineAvatar, RealisticTimeline} from './Timeline.storyHelpers'

const meta = {
  title: 'React Tailwind/Layout/Timeline/Features',
  component: Timeline,
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

const Message = () => (
  <>
    <Timeline.Item>
      <Timeline.Badge>
        <GitCommitIcon aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <GitCommitIcon aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </>
)

export const ClipSidebar: Story = {
  render: () => (
    <Timeline clipSidebar>
      <Message />
    </Timeline>
  ),
}
export const ClipSidebarStart: Story = {
  render: () => (
    <Timeline clipSidebar="start">
      <Message />
    </Timeline>
  ),
}
export const ClipSidebarEnd: Story = {
  render: () => (
    <Timeline clipSidebar="end">
      <Message />
    </Timeline>
  ),
}

export const CondensedItems: Story = {
  render: () => (
    <Timeline>
      {[0, 1].map(index => (
        <Timeline.Item condensed key={index}>
          <Timeline.Badge>
            <GitCommitIcon aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
      ))}
      <Timeline.Break />
      {[2, 3].map(index => (
        <Timeline.Item condensed key={index}>
          <Timeline.Badge>
            <GitCommitIcon aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>This is a message</Timeline.Body>
        </Timeline.Item>
      ))}
    </Timeline>
  ),
}

export const TimelineBreak: Story = {
  render: () => (
    <Timeline>
      <Timeline.Item>
        <Timeline.Badge variant="done">
          <GitMergeIcon aria-label="Merged" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
      <Timeline.Break />
      <Timeline.Item>
        <Timeline.Badge>
          <GitBranchIcon aria-label="Branch" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
}

const badgeVariants = [
  ['accent', GitPullRequestIcon, 'Pull request', 'Accent'],
  ['success', IssueClosedIcon, 'Closed', 'Success'],
  ['attention', FlameIcon, 'Attention', 'Attention'],
  ['severe', SkipIcon, 'Severe', 'Severe'],
  ['danger', XIcon, 'Danger', 'Danger'],
  ['done', GitMergeIcon, 'Merged', 'Done'],
  ['open', IssueOpenedIcon, 'Open', 'Open'],
  ['closed', IssueClosedIcon, 'Closed', 'Closed'],
  ['sponsors', HeartIcon, 'Sponsors', 'Sponsors'],
] as const

export const BadgeVariants: Story = {
  render: () => (
    <Timeline>
      {badgeVariants.map(([variant, Icon, label, body]) => (
        <Timeline.Item key={variant}>
          <Timeline.Badge variant={variant}>
            <Icon aria-label={label} />
          </Timeline.Badge>
          <Timeline.Body>{body}</Timeline.Body>
        </Timeline.Item>
      ))}
    </Timeline>
  ),
}

export const WithInlineLinks: Story = {
  render: () => (
    <Timeline>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>
          <BoldLink href="#" muted>
            Monalisa
          </BoldLink>
          enabled auto-merge (squash)
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Examples>
      <Timeline>
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <GitMergeIcon aria-label="Merged" />
          </Timeline.Badge>
          <Timeline.Body>
            <BoldLink href="#" muted>
              Monalisa
            </BoldLink>
            merged via the queue into <BranchName href="#">main</BranchName> with commit{' '}
            <Link className="inline font-mono text-xs leading-[18px] font-semibold text-default" href="#">
              01e49tb
            </Link>{' '}
            <Link className="inline underline hover:underline" href="#" muted>
              just now
            </Link>
            <div className="mt-1 text-xs leading-[18px] text-muted">28 checks passed</div>
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small">View details</Button>
            <Button size="small">Revert</Button>
          </Timeline.Actions>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <RepoPushIcon aria-label="Force-push" />
          </Timeline.Badge>
          <Timeline.Body>
            <BoldLink href="#" muted>
              Monalisa
            </BoldLink>
            force-pushed the <BranchName href="#">main</BranchName> branch from{' '}
            <Link className="inline font-mono text-xs leading-[18px] font-semibold text-default" href="#">
              01e49tb
            </Link>{' '}
            to{' '}
            <Link className="inline font-mono text-xs leading-[18px] font-semibold text-default" href="#">
              02f50uc
            </Link>{' '}
            <Link className="inline underline hover:underline" href="#" muted>
              2 hours ago
            </Link>
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small">Compare</Button>
          </Timeline.Actions>
        </Timeline.Item>
        <Timeline.Item condensed>
          <Timeline.Badge>
            <GitCommitIcon aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>
            <Link className="inline" href="#" muted>
              Update README.md
            </Link>
          </Timeline.Body>
          <Timeline.Actions>
            <Label className="@max-[479px]/timeline:hidden text-success">Verified</Label>
            <CheckIcon aria-label="All checks passed" className="text-success" />
            <Link className="inline font-mono text-xs leading-[18px] underline hover:underline" href="#" muted>
              3fbdc0
            </Link>
          </Timeline.Actions>
        </Timeline.Item>
        <Timeline.Item condensed>
          <Timeline.Badge>
            <GitCommitIcon aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>
            <Link className="inline" href="#" muted>
              Initial commit
            </Link>
          </Timeline.Body>
          <Timeline.Actions>
            <Label className="@max-[479px]/timeline:hidden">Unverified</Label>
            <XIcon aria-label="Some checks failed" className="text-danger" />
            <Link className="inline font-mono text-xs leading-[18px] underline hover:underline" href="#" muted>
              3fbdc0
            </Link>
          </Timeline.Actions>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <CrossReferenceIcon aria-label="Cross-reference" />
          </Timeline.Badge>
          <Timeline.Body>
            <InlineAvatar size={20} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
            <BoldLink href="#" muted>
              Monalisa
            </BoldLink>
            mentioned this pull request{' '}
            <Link className="inline underline hover:underline" href="#" muted>
              just now
            </Link>
            <div className="mt-1 flex items-start gap-3 @max-[479px]/timeline:flex-col @max-[479px]/timeline:gap-1">
              <div className="min-w-0 flex-1 text-md">
                <Link className="group inline text-default underline hover:text-accent" href="#">
                  <span className="font-semibold">Fix positioning of Autocomplete overlay menu</span>{' '}
                  <span className="text-muted group-hover:text-accent">primer/react#7431</span>
                </Link>
              </div>
              <LockIcon aria-label="Private" className="shrink-0 text-muted" size={16} />
              <StateLabel size="small" status="pullOpened">
                Open
              </StateLabel>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs leading-[18px] text-muted">
              <TasklistIcon aria-hidden="true" size={16} />
              17 tasks
            </div>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </Examples>
  ),
}

export const WithAvatar: Story = {
  render: () => (
    <RealisticTimeline className="pl-[72px]">
      <Timeline>
        <Timeline.Item>
          <Timeline.Avatar>
            <Avatar alt="" size={40} src="https://avatars.githubusercontent.com/u/92997159?v=4" />
          </Timeline.Avatar>
          <Timeline.Badge variant="done">
            <CheckIcon aria-label="Approved" />
          </Timeline.Badge>
          <Timeline.Body>
            <BoldLink href="#" muted>
              monalisa
            </BoldLink>
            approved these changes <RelativeTime date={new Date()} format="relative" />
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small">View reviewed changes</Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </RealisticTimeline>
  ),
}

export const WithListSemantics: Story = {
  render: () => (
    <Timeline>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>Opted in: Timeline renders as an ordered list with list items.</Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>Each Timeline.Item renders as a li.</Timeline.Body>
      </Timeline.Item>
      <Timeline.Break />
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>Timeline.Break renders as a presentational li.</Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
}
