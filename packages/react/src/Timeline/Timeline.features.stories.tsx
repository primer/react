import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Timeline from './Timeline'
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
import Link from '../Link'
import RelativeTime from '../RelativeTime'
import {Button} from '../Button'
import Label from '../Label'
import StateLabel from '../StateLabel'
import Avatar from '../Avatar'
import BranchName from '../BranchName'
import Octicon from '../Octicon'
import classes from './Timeline.features.stories.module.css'

export default {
  title: 'Components/Timeline/Features',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Avatar': Timeline.Avatar,
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
  </Timeline>
)

export const ClipSidebarStart = () => (
  <Timeline clipSidebar="start">
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
  </Timeline>
)

export const ClipSidebarEnd = () => (
  <Timeline clipSidebar="end">
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
  </Timeline>
)

export const CondensedItems = () => (
  <Timeline>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <GitCommitIcon aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <GitCommitIcon aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Break />
    <Timeline.Item condensed>
      <Timeline.Badge>
        <GitCommitIcon aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item condensed>
      <Timeline.Badge>
        <GitCommitIcon aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const TimelineBreak = () => (
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
)

export const BadgeVariants = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge variant="accent">
        <GitPullRequestIcon aria-label="Pull request" />
      </Timeline.Badge>
      <Timeline.Body>Accent</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="success">
        <IssueClosedIcon aria-label="Closed" />
      </Timeline.Badge>
      <Timeline.Body>Success</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="attention">
        <FlameIcon aria-label="Attention" />
      </Timeline.Badge>
      <Timeline.Body>Attention</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="severe">
        <SkipIcon aria-label="Severe" />
      </Timeline.Badge>
      <Timeline.Body>Severe</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="danger">
        <XIcon aria-label="Danger" />
      </Timeline.Badge>
      <Timeline.Body>Danger</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="done">
        <GitMergeIcon aria-label="Merged" />
      </Timeline.Badge>
      <Timeline.Body>Done</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="open">
        <IssueOpenedIcon aria-label="Open" />
      </Timeline.Badge>
      <Timeline.Body>Open</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="closed">
        <IssueClosedIcon aria-label="Closed" />
      </Timeline.Badge>
      <Timeline.Body>Closed</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge variant="sponsors">
        <HeartIcon aria-label="Sponsors" />
      </Timeline.Badge>
      <Timeline.Body>Sponsors</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

export const WithInlineLinks = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge>
        <GitCommitIcon aria-label="Commit" />
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
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline>
      <Timeline.Item>
        <Timeline.Badge variant="done">
          <Octicon icon={GitMergeIcon} aria-label="Merged" />
        </Timeline.Badge>
        <Timeline.Body>
          <Link href="#" className={classes.LinkWithBoldStyle} muted>
            Monalisa
          </Link>
          merged via the queue into <BranchName href="#">main</BranchName> with commit{' '}
          <Link href="#" className={classes.CommitSha}>
            01e49tb
          </Link>{' '}
          <Link href="#" className={classes.Timestamp} muted>
            just now
          </Link>
          <div className={classes.ChecksSubline}>28 checks passed</div>
        </Timeline.Body>
        <Timeline.Actions>
          <Button size="small">View details</Button>
          <Button size="small">Revert</Button>
        </Timeline.Actions>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={RepoPushIcon} aria-label="Force-push" />
        </Timeline.Badge>
        <Timeline.Body>
          <Link href="#" className={classes.LinkWithBoldStyle} muted>
            Monalisa
          </Link>
          force-pushed the <BranchName href="#">main</BranchName> branch from{' '}
          <Link href="#" className={classes.CommitSha}>
            01e49tb
          </Link>{' '}
          to{' '}
          <Link href="#" className={classes.CommitSha}>
            02f50uc
          </Link>{' '}
          <Link href="#" className={classes.Timestamp} muted>
            2 hours ago
          </Link>
        </Timeline.Body>
        <Timeline.Actions>
          <Button size="small">Compare</Button>
        </Timeline.Actions>
      </Timeline.Item>
      <Timeline.Item condensed>
        <Timeline.Badge>
          <Octicon icon={GitCommitIcon} aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>
          <Link href="#" muted>
            Update README.md
          </Link>
        </Timeline.Body>
        <Timeline.Actions>
          <Label className={classes.SignatureLabelVerified}>Verified</Label>
          <Octicon icon={CheckIcon} className={classes.IconSuccess} aria-label="All checks passed" />
          <Link href="#" className={classes.ShaLink} muted>
            3fbdc0
          </Link>
        </Timeline.Actions>
      </Timeline.Item>
      <Timeline.Item condensed>
        <Timeline.Badge>
          <Octicon icon={GitCommitIcon} aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>
          <Link href="#" muted>
            Initial commit
          </Link>
        </Timeline.Body>
        <Timeline.Actions>
          <Label>Unverified</Label>
          <Octicon icon={XIcon} className={classes.IconDanger} aria-label="Some checks failed" />
          <Link href="#" className={classes.ShaLink} muted>
            3fbdc0
          </Link>
        </Timeline.Actions>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={CrossReferenceIcon} aria-label="Cross-reference" />
        </Timeline.Badge>
        <Timeline.Body>
          <Avatar
            src="https://avatars.githubusercontent.com/u/92997159?v=4"
            size={20}
            className={classes.InlineAvatar}
          />
          <Link href="#" className={classes.LinkWithBoldStyle} muted>
            Monalisa
          </Link>
          mentioned this pull request{' '}
          <Link href="#" className={classes.Timestamp} muted>
            just now
          </Link>
          <div className={classes.CrossReferenceRow}>
            <div className={classes.CrossReferenceContent}>
              <div className={classes.CrossReferenceTitle}>
                <Link href="#" className={classes.CrossReferenceLink}>
                  <span className={classes.CrossReferenceName}>Fix positioning of Autocomplete overlay menu</span>{' '}
                  <span className={classes.CrossReferenceNumber}>primer/react#7431</span>
                </Link>
              </div>
              <div className={classes.CrossReferenceTaskline}>
                <Octicon icon={TasklistIcon} size={16} />
                17 tasks
              </div>
            </div>
            <div className={classes.CrossReferenceActions}>
              <Octicon icon={LockIcon} size={16} className={classes.CrossReferenceMeta} />
              <StateLabel status="pullOpened" size="medium">
                Open
              </StateLabel>
            </div>
          </div>
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

export const WithAvatar = () => (
  <div
    className={`${classes.RealisticTimeline} ${classes.AvatarGutter}`}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline>
      <Timeline.Item>
        <Timeline.Avatar>
          <Avatar size={40} src="https://avatars.githubusercontent.com/u/92997159?v=4" alt="" />
        </Timeline.Avatar>
        <Timeline.Badge variant="done">
          <Octicon icon={CheckIcon} aria-label="Approved" />
        </Timeline.Badge>
        <Timeline.Body>
          <Link href="#" className={classes.LinkWithBoldStyle} muted>
            monalisa
          </Link>
          {'approved these changes '}
          <RelativeTime date={new Date()} format="relative" />
        </Timeline.Body>
        <Timeline.Actions>
          <Button size="small">View reviewed changes</Button>
        </Timeline.Actions>
      </Timeline.Item>
    </Timeline>
  </div>
)
