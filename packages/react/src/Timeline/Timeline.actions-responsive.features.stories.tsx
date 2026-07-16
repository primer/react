/*
  Prototypes for `Timeline.Actions` responsive/wrap behavior on narrow viewports.
  Tracks: https://github.com/github/primer/issues/6693

  Each story wraps the Timeline in a horizontally-resizable container. Drag the
  bottom-right corner of the container to shrink/grow the Timeline width and
  observe how the prototype option responds.

  Options mirror the three approaches enumerated in the issue:
    1. Wrap Actions below Body on narrow widths (container query on Timeline.Item).
    2. Stack Actions vertically when the row is narrow.
    3. Stay inline, do nothing (current behavior baseline).
*/

import type {Meta} from '@storybook/react-vite'
import type {ComponentProps, ReactNode} from 'react'
import Timeline from './Timeline'
import {CheckIcon, GitCommitIcon, GitMergeIcon, RepoPushIcon, XIcon} from '@primer/octicons-react'
import Link from '../Link'
import {Button} from '../Button'
import Label from '../Label'
import BranchName from '../BranchName'
import Octicon from '../Octicon'
import classes from './Timeline.actions-responsive.features.stories.module.css'

export default {
  title: 'Components/Timeline/Features/Actions Responsive',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Body': Timeline.Body,
    'Timeline.Actions': Timeline.Actions,
  },
} as Meta<ComponentProps<typeof Timeline>>

/**
 * Wraps each `Timeline.Item` in a `.ItemContainer` element that establishes an
 * inline-size container so prototype CSS can query the item's own width.
 * Options 1 and 2 rely on this; Option 3 (baseline) also uses it so the DOM
 * shape is identical across stories and the only variable is the CSS.
 */
function ResizableTimeline({children}: {children: ReactNode}) {
  return (
    <div
      className={classes.ResizableContainer}
      onClick={e => {
        if ((e.target as HTMLElement).closest('a')) e.preventDefault()
      }}
    >
      <Timeline>{children}</Timeline>
    </div>
  )
}

/**
 * Renders the same set of realistic Timeline items used to stress-test each
 * option. Cases cover: two-button actions, single-button + long body, a
 * condensed multi-element row, a worst-case long body + long actions, and
 * PR-style commit rows where the Actions slot is a verification cluster
 * (Label + icon + SHA link) rather than buttons.
 */
function ItemCases({itemClassName, actionsClassName}: {itemClassName?: string; actionsClassName?: string}) {
  return (
    <>
      {/* Case A: two-button actions, medium body. */}
      <div className={classes.ItemContainer}>
        <Timeline.Item className={itemClassName}>
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
          </Timeline.Body>
          <Timeline.Actions className={actionsClassName}>
            <Button size="small">View details</Button>
            <Button size="small">Revert</Button>
          </Timeline.Actions>
        </Timeline.Item>
      </div>

      {/* Case B: single-button actions, longer body. */}
      <div className={classes.ItemContainer}>
        <Timeline.Item className={itemClassName}>
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
          <Timeline.Actions className={actionsClassName}>
            <Button size="small">Compare</Button>
          </Timeline.Actions>
        </Timeline.Item>
      </div>

      {/* Case C: condensed row with multiple small elements. */}
      <div className={classes.ItemContainer}>
        <Timeline.Item condensed className={itemClassName}>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>
            <Link href="#" muted>
              Update README.md with much longer commit subject to force wrapping
            </Link>
          </Timeline.Body>
          <Timeline.Actions className={actionsClassName}>
            <Label className={classes.SignatureLabelVerified}>Verified</Label>
            <Octicon icon={CheckIcon} className={classes.IconSuccess} aria-label="All checks passed" />
            <Link href="#" className={classes.ShaLink} muted>
              3fbdc0
            </Link>
          </Timeline.Actions>
        </Timeline.Item>
      </div>

      {/* Case D: torture test — long body + long, multi-element actions. */}
      <div className={classes.ItemContainer}>
        <Timeline.Item className={itemClassName}>
          <Timeline.Badge variant="done">
            <Octicon icon={GitMergeIcon} aria-label="Merged" />
          </Timeline.Badge>
          <Timeline.Body>
            <Link href="#" className={classes.LinkWithBoldStyle} muted>
              Monalisa
            </Link>
            merged commit{' '}
            <Link href="#" className={classes.CommitSha}>
              01e49tb
            </Link>{' '}
            into <BranchName href="#">release/2026-11</BranchName> with a longer summary that mentions several
            additional details about the change
          </Timeline.Body>
          <Timeline.Actions className={actionsClassName}>
            <Button size="small">View details</Button>
            <Button size="small">Compare</Button>
            <Button size="small">Revert</Button>
          </Timeline.Actions>
        </Timeline.Item>
      </div>

      {/* Case E: PR commit row — realistic long commit subject with a
          `Verified` signature cluster (Label + check icon + SHA link) in
          Actions instead of buttons. Mirrors the pattern used on PR
          commit-added events (see github/primer#6693 discussion). */}
      <div className={classes.ItemContainer}>
        <Timeline.Item condensed className={itemClassName}>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>
            <Link href="#" muted>
              Apply suggestions from code review
            </Link>
          </Timeline.Body>
          <Timeline.Actions className={actionsClassName}>
            <Label className={classes.SignatureLabelVerified}>Verified</Label>
            <Octicon icon={CheckIcon} className={classes.IconSuccess} aria-label="Signature verified" />
            <Link href="#" className={classes.ShaLink} muted>
              3fbdc0
            </Link>
          </Timeline.Actions>
        </Timeline.Item>
      </div>

      {/* Case F: PR commit row — `Partially verified` variant with a longer
          label and an X icon. Stresses the SHA cluster with a wider Actions
          slot to see how each option handles the extra width. */}
      <div className={classes.ItemContainer}>
        <Timeline.Item condensed className={itemClassName}>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit" />
          </Timeline.Badge>
          <Timeline.Body>
            <Link href="#" muted>
              Initial commit
            </Link>
          </Timeline.Body>
          <Timeline.Actions className={actionsClassName}>
            <Label className={classes.SignatureLabelPartial}>Partially verified</Label>
            <Octicon icon={XIcon} className={classes.IconDanger} aria-label="Signature partially verified" />
            <Link href="#" className={classes.ShaLink} muted>
              3fbdc0
            </Link>
          </Timeline.Actions>
        </Timeline.Item>
      </div>
    </>
  )
}

export const Option1WrapBelow = () => (
  <div className={classes.Stack}>
    <p className={classes.OptionCaption}>
      Option 1 — Actions wrap onto a new row below Body when the item is below 480px, left-aligned with the body
      content. Drag the container edge to see the transition.
    </p>
    <ResizableTimeline>
      <ItemCases itemClassName={classes.Option1Item} actionsClassName={classes.Option1Actions} />
    </ResizableTimeline>
  </div>
)

export const Option2StackVertical = () => (
  <div className={classes.Stack}>
    <p className={classes.OptionCaption}>
      Option 2 — Actions stack vertically (column) inside their slot when the item is below 480px. Row layout is
      preserved above the breakpoint.
    </p>
    <ResizableTimeline>
      <ItemCases actionsClassName={classes.Option2Actions} />
    </ResizableTimeline>
  </div>
)

export const Option3StayInline = () => (
  <div className={classes.Stack}>
    <p className={classes.OptionCaption}>
      Option 3 — Baseline. Current behavior: Actions stay on the right edge and Body wraps first. Included for
      side-by-side comparison.
    </p>
    <ResizableTimeline>
      <ItemCases />
    </ResizableTimeline>
  </div>
)
