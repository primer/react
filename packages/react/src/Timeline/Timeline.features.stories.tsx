import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Timeline from './Timeline'
import Octicon from '../Octicon'
import {
  CheckIcon,
  FlameIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  HeartIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  LockIcon,
  ShieldCheckIcon,
  SkipIcon,
  XIcon,
} from '@primer/octicons-react'
import Link from '../Link'
import {Button} from '../Button'
import Label from '../Label'
import classes from './Timeline.features.stories.module.css'

export default {
  title: 'Components/Timeline/Features',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
    'Timeline.Break': Timeline.Break,
    'Timeline.Actions': Timeline.Actions,
  },
} as Meta<ComponentProps<typeof Timeline>>

export const ClipSidebar = () => (
  <Timeline clipSidebar>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const ClipSidebarStart = () => (
  <Timeline clipSidebar="start">
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const ClipSidebarEnd = () => (
  <Timeline clipSidebar="end">
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const CondensedItems = () => (
  <Timeline>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Break />
    <Timeline.Item condensed>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const TimelineBreak = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge variant="done">
        <Octicon icon={GitMergeIcon} aria-label="Merged" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Break />
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitBranchIcon} aria-label="Branch" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const BadgeVariants = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge variant="accent">
        <Octicon icon={GitPullRequestIcon} aria-label="Pull request" />
      </Timeline.Badge>
      <Timeline.Body>Accent</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="success">
        <Octicon icon={IssueClosedIcon} aria-label="Closed" />
      </Timeline.Badge>
      <Timeline.Body>Success</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="attention">
        <Octicon icon={FlameIcon} aria-label="Attention" />
      </Timeline.Badge>
      <Timeline.Body>Attention</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="severe">
        <Octicon icon={SkipIcon} aria-label="Severe" />
      </Timeline.Badge>
      <Timeline.Body>Severe</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="danger">
        <Octicon icon={XIcon} aria-label="Danger" />
      </Timeline.Badge>
      <Timeline.Body>Danger</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="done">
        <Octicon icon={GitMergeIcon} aria-label="Merged" />
      </Timeline.Badge>
      <Timeline.Body>Done</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="open">
        <Octicon icon={IssueOpenedIcon} aria-label="Open" />
      </Timeline.Badge>
      <Timeline.Body>Open</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="closed">
        <Octicon icon={IssueClosedIcon} aria-label="Closed" />
      </Timeline.Badge>
      <Timeline.Body>Closed</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="sponsors">
        <Octicon icon={HeartIcon} aria-label="Sponsors" />
      </Timeline.Badge>
      <Timeline.Body>Sponsors</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const WithInlineLinks = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>
        <Link href="#" className={classes.LinkWithBoldStyle} muted>
          Monalisa
        </Link>
        enabled auto-merge (squash)
      </Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const WithActions = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge variant="done">
        <Octicon icon={GitMergeIcon} aria-label="Merged" />
      </Timeline.Badge>
      <Timeline.Body>
        <Link href="#" className={classes.LinkWithBoldStyle} muted>
          Monalisa
        </Link>
        merged commit{' '}
        <Link href="#" muted>
          a1b2c3d
        </Link>{' '}
        into main
      </Timeline.Body>
      <Timeline.Actions>
        <Button size="small">Revert</Button>
      </Timeline.Actions>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="done">
        <Octicon icon={GitMergeIcon} aria-label="Merged" />
      </Timeline.Badge>
      <Timeline.Body>
        <Link href="#" className={classes.LinkWithBoldStyle} muted>
          Monalisa
        </Link>
        merged this pull request
      </Timeline.Body>
      <Timeline.Actions>
        <Button size="small">Revert</Button>
        <Button size="small">View details</Button>
      </Timeline.Actions>
    </Timeline.Item>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>
        <Link href="#" className={classes.LinkWithBoldStyle} muted>
          Monalisa
        </Link>
        pushed a commit
      </Timeline.Body>
      <Timeline.Actions>
        <Octicon icon={CheckIcon} aria-label="All checks passed" />
        <Link href="#" muted>
          a1b2c3d
        </Link>
        <Label variant="success">
          <Octicon icon={ShieldCheckIcon} />
          Verified
        </Label>
      </Timeline.Actions>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitPullRequestIcon} aria-label="Cross-reference" />
      </Timeline.Badge>
      <Timeline.Body>
        <Link href="#" className={classes.LinkWithBoldStyle} muted>
          Monalisa
        </Link>
        mentioned this in a pull request
      </Timeline.Body>
      <Timeline.Actions>
        <Octicon icon={LockIcon} aria-label="Private" />
        <Link href="#" muted>
          monalisa/private-repo#42
        </Link>
        <Label variant="success">Open</Label>
      </Timeline.Actions>
    </Timeline.Item>
  </Timeline>
)
