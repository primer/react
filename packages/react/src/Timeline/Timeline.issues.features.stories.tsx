import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
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
  NumberIcon,
  PinIcon,
  SingleSelectIcon,
  TableIcon,
  TypographyIcon,
} from '@primer/octicons-react'
import Avatar from '../Avatar'
import {Button} from '../Button'
import Label from '../Label'
import Link from '../Link'
import Octicon from '../Octicon'
import RelativeTime from '../RelativeTime'
import Token from '../Token'
import classes from './Timeline.issues.features.stories.module.css'

/**
 * Issue Timeline event examples (Phase 2 of github/primer#6663).
 *
 * These stories recreate GitHub's live issue-timeline events using the Primer
 * `Timeline` compositional slots, sourced from the `timeline-audit` Figma audit
 * (`issue-timeline-events-for-figma.md`) and verified against the live React
 * implementation in `github/github-ui` (`packages/timeline-items`).
 *
 * FUTURE FILTERING (taxonomy still open — github/primer#6663): category
 * `data-*` attributes (e.g. `data-event-category="closed"`) will attach to each
 * `Timeline.Item` below so stories can be filtered/grouped by event family. We
 * intentionally do NOT add them yet to avoid baking in a taxonomy.
 *
 * SLOT USAGE (Phase 1 slots — establishes the convention for downstream groups):
 * - `Timeline.Avatar` (gutter slot, #6677): the 40px LEFT-GUTTER avatar. Reserved
 *   for comment-style events. Badge-row events like Closed do NOT use it — the
 *   live github-ui `ClosedEvent` renders through `TimelineRow`, which places the
 *   actor's small (20px) avatar INLINE in the body (`EventActor` inline-avatar
 *   mode), not in the gutter. We mirror that here: avatar inline in `Timeline.Body`.
 * - `Timeline.Actions` (right-controls slot, #6678): for buttons / SHAs / status
 *   pills on the right edge. Closed has no right controls, so it is omitted here.
 *   Downstream groups that DO have right controls (e.g. Duplicates' "Marked as
 *   duplicate" has a button) should add it as a sibling of `Timeline.Body`:
 *
 *     <Timeline.Item>
 *       <Timeline.Badge>{...}</Timeline.Badge>
 *       <Timeline.Body>{...}</Timeline.Body>
 *       <Timeline.Actions>
 *         <Button size="small">View details</Button>
 *       </Timeline.Actions>
 *     </Timeline.Item>
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'

// Inline 20px avatar + bold username link, matching github-ui's `EventActor`
// (packages/timeline-items/components/row/EventActor.tsx) inline-avatar mode.
const Actor = () => (
  <>
    <Avatar src={MONALISA_AVATAR} size={20} alt="" className={classes.InlineAvatar} />
    <Link href="#" className={classes.LinkWithBoldStyle} muted>
      monalisa
    </Link>
  </>
)

// Muted underlined relative timestamp, mirroring github-ui's `Ago` deep-link.
const Time = ({date}: {date: string}) => (
  <Link href="#" className={classes.Timestamp} muted>
    <RelativeTime date={new Date(date)} format="relative" />
  </Link>
)

export default {
  title: 'Components/Timeline/Issues Features',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Avatar': Timeline.Avatar,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
    'Timeline.Break': Timeline.Break,
    'Timeline.Actions': Timeline.Actions,
  },
  decorators: [
    // File-scoped: render every story in the future-state list semantics
    // (`<ol>`/`<li>`). The `primer_react_timeline_list_semantics` flag is merged
    // on main; this opts these stories into the DOM the timeline will ship.
    Story => (
      <FeatureFlags flags={{primer_react_timeline_list_semantics: true}}>
        <Story />
      </FeatureFlags>
    ),
  ],
} as Meta<ComponentProps<typeof Timeline>>

/**
 * The Closed event group — `IssueTimeline.eventClosed` (audit § 2).
 *
 * All seven variants are stacked in a single `<Timeline>` so they can be
 * scanned like a Figma component set. Badge icon and color are dynamically
 * derived by `useIssueState({ state: 'CLOSED', stateReason })` in the live code:
 * completed/PR/commit/project/no-reason -> CheckCircleIcon on `done` (purple);
 * not-planned/duplicate -> CircleSlashIcon on `neutral` (gray).
 */
export const EventClosed = () => (
  <div
    className={classes.RealisticTimeline}
    // Prevent the placeholder `href="#"` links from navigating inside Storybook.
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Closed as completed */}
      <Timeline.Item>
        <Timeline.Badge variant="done">
          <Octicon icon={CheckCircleIcon} aria-label="Closed as completed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Closed as completed</span>
          <Actor />
          {'closed this as '}
          <Link href="#" inline>
            completed
          </Link>{' '}
          <Time date="2022-07-26T11:46:07Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Not planned — neutral (gray) badge. Timeline.Badge has no `neutral`
          variant, so drive the documented `--timelineBadge-bgColor` hook inline
          (portable for docs copy-paste; matches production `TimelineRow`). */}
      <Timeline.Item>
        <Timeline.Badge
          style={
            {
              '--timelineBadge-bgColor': 'var(--bgColor-neutral-emphasis)',
              color: 'var(--fgColor-onEmphasis)',
            } as React.CSSProperties
          }
        >
          <Octicon icon={CircleSlashIcon} aria-label="Closed as not planned" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Closed as not planned</span>
          <Actor />
          {'closed this as '}
          <Link href="#" inline>
            not planned
          </Link>{' '}
          <Time date="2022-07-25T09:12:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Closed via pull request */}
      <Timeline.Item>
        <Timeline.Badge variant="done">
          <Octicon icon={CheckCircleIcon} aria-label="Closed via pull request" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Closed via pull request</span>
          <Actor />
          {'closed this as '}
          <Link href="#" inline>
            completed
          </Link>
          {' in '}
          <Link href="#" className={classes.LinkWithBoldStyle}>
            #123
          </Link>{' '}
          <Time date="2022-07-24T16:40:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Closed via commit */}
      <Timeline.Item>
        <Timeline.Badge variant="done">
          <Octicon icon={CheckCircleIcon} aria-label="Closed via commit" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Closed via commit</span>
          <Actor />
          {'closed this as '}
          <Link href="#" inline>
            completed
          </Link>
          {' in '}
          <Link href="#" className={classes.CommitSha}>
            abc1234
          </Link>{' '}
          <Time date="2022-07-23T11:05:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Closed via project (ProjectV2 status change). github-ui composes
          the closer link as TableIcon + project title; there is no Primer
          equivalent for github-ui's `ProjectV2` closer link. */}
      <Timeline.Item>
        <Timeline.Badge variant="done">
          <Octicon icon={CheckCircleIcon} aria-label="Closed via project" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Closed via project</span>
          <Actor />
          {'closed this as '}
          <Link href="#" inline>
            completed
          </Link>
          {' by moving to Done in '}
          <Octicon icon={TableIcon} size={16} className={classes.ProjectIcon} />
          <Link href="#" className={classes.LinkWithBoldStyle}>
            Roadmap
          </Link>{' '}
          <Time date="2022-07-22T14:20:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Closed as duplicate — neutral (gray) badge (see note above). github-ui
          renders an `IssueLink` (state icon + title + #number + hovercard);
          composed here from Primer primitives. */}
      <Timeline.Item>
        <Timeline.Badge
          style={
            {
              '--timelineBadge-bgColor': 'var(--bgColor-neutral-emphasis)',
              color: 'var(--fgColor-onEmphasis)',
            } as React.CSSProperties
          }
        >
          <Octicon icon={CircleSlashIcon} aria-label="Closed as duplicate" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Closed as duplicate</span>
          <Actor />
          {'closed this as a '}
          <Link href="#" inline>
            duplicate
          </Link>
          {' of '}
          <Link href="#" className={classes.IssueLink}>
            <Octicon icon={IssueClosedIcon} size={16} className={classes.IssueLinkIcon} />
            <span className={classes.IssueLinkTitle}>Fix the flaky avatar test</span>{' '}
            <span className={classes.IssueLinkNumber}>#42</span>
          </Link>{' '}
          <Time date="2022-07-21T08:30:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Closed with no state reason */}
      <Timeline.Item>
        <Timeline.Badge variant="done">
          <Octicon icon={CheckCircleIcon} aria-label="Closed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Closed (no reason)</span>
          <Actor />
          {'closed this '}
          <Time date="2022-07-20T10:00:00Z" />
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The Issue-state event group (audit § 3).
 *
 * Six state-change variants. Badge icon/color verified against the live
 * github-ui components (not the audit's icon column): Reopened maps to
 * `useIssueState({ state: 'OPEN' })` -> `open` (green) badge; the rest are
 * structural events with a default (muted) badge.
 */
export const EventState = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Reopened — open (green) badge via useIssueState (ReopenedEvent.tsx) */}
      <Timeline.Item>
        <Timeline.Badge variant="open">
          <Octicon icon={IssueReopenedIcon} aria-label="Reopened" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Reopened</span>
          <Actor />
          {'reopened this '}
          <Time date="2022-07-26T11:46:07Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Transferred — github-ui's TransferredEvent renders the source repo as a
          plain inline Link (the audit shows it bold; live code is canonical). */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={LinkExternalIcon} aria-label="Transferred" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Transferred</span>
          <Actor />
          {'transferred this issue from '}
          <Link href="#" inline>
            octo-org/legacy-repo
          </Link>{' '}
          <Time date="2022-07-25T09:12:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Pinned */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={PinIcon} aria-label="Pinned" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Pinned</span>
          <Actor />
          {'pinned this issue '}
          <Time date="2022-07-24T16:40:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Unpinned */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={PinIcon} aria-label="Unpinned" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Unpinned</span>
          <Actor />
          {'unpinned this issue '}
          <Time date="2022-07-23T11:05:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Converted to discussion — github-ui's ConvertedToDiscussionEvent links
          the resulting discussion by number. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={CommentDiscussionIcon} aria-label="Converted to discussion" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Converted to discussion</span>
          <Actor />
          {'converted this issue into a discussion '}
          <Link href="#" className={classes.LinkWithBoldStyle}>
            #123
          </Link>{' '}
          <Time date="2022-07-22T14:20:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Converted from draft */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueDraftIcon} aria-label="Converted from draft" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Converted from draft</span>
          <Actor />
          {'converted this from a draft issue '}
          <Time date="2022-07-21T08:30:00Z" />
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The References event group (audit § 5).
 *
 * Cross-reference events. All use a default (muted) badge except where the
 * badge icon is itself a PR state icon. The inline PR state icon mirrors
 * github-ui's `sourceIcon('PullRequest', isDraft, isInMergeQueue)`; commit
 * references compose a simplified `ReferencedEventInner` card.
 */
export const EventReferences = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Linked pull request — ConnectedEvent.tsx (CrossReferenceIcon badge,
          open PR state icon inline before the PR title). */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={CrossReferenceIcon} aria-label="Linked pull request" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Linked pull request</span>
          <Actor />
          {'linked a pull request that will close this issue '}
          <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
          <Link href="#" className={classes.LinkWithBoldStyle}>
            Add retry logic to the uploader
          </Link>
          <span className={classes.IssueLinkNumber}>#42</span> <Time date="2022-07-26T11:46:07Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Unlinked pull request — DisconnectedEvent.tsx uses the PR state icon AS
          the badge icon (leadingIcon={PullStateIcon}), so the badge octicon is
          green (open) on a default badge. Verified the live render path is
          active (in TIMELINE_ITEMS[__typename], current useIssueState hook,
          story fixture is an OPEN PR) — the Figma audit's gray cross-reference
          icon is behind the live code here. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={GitPullRequestIcon} className={classes.BadgeIconOpen} aria-label="Unlinked pull request" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Unlinked pull request</span>
          <Actor />
          {'removed a link to a pull request '}
          <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
          <Link href="#" className={classes.LinkWithBoldStyle}>
            Add retry logic to the uploader
          </Link>
          <span className={classes.IssueLinkNumber}>#42</span> <Time date="2022-07-25T09:12:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Single commit reference — ReferencedEvent.tsx. The timestamp renders
          inline (showAgoTimestamp={false}) and the commit card is sub-content. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={GitCommitIcon} aria-label="Commit reference" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Single commit reference</span>
          <Actor />
          {'added a commit that references this issue '}
          <Time date="2022-07-24T16:40:00Z" />
          {/* Simplified ReferencedEventInner card (github-ui composes message +
              verification status + abbreviated OID per commit). */}
          <div className={classes.CommitRefBox}>
            <div className={classes.CommitRefRow}>
              <Link href="#" className={classes.CommitRefMessage} muted>
                Fix flaky avatar upload retry
              </Link>
              <span>
                <Label variant="success">Verified</Label>{' '}
                <Link href="#" className={classes.CommitRefOid} muted>
                  abc1234
                </Link>
              </span>
            </div>
          </div>
        </Timeline.Body>
      </Timeline.Item>

      {/* Multiple commit references — same event, pluralized copy + N cards. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={GitCommitIcon} aria-label="Commit references" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Multiple commit references</span>
          <Actor />
          {'added 3 commits that reference this issue '}
          <Time date="2022-07-23T11:05:00Z" />
          <div className={classes.CommitRefBox}>
            <div className={classes.CommitRefRow}>
              <Link href="#" className={classes.CommitRefMessage} muted>
                Fix flaky avatar upload retry
              </Link>
              <Link href="#" className={classes.CommitRefOid} muted>
                abc1234
              </Link>
            </div>
            <div className={classes.CommitRefRow}>
              <Link href="#" className={classes.CommitRefMessage} muted>
                Add regression test for retry path
              </Link>
              <Link href="#" className={classes.CommitRefOid} muted>
                def5678
              </Link>
            </div>
            <div className={classes.CommitRefRow}>
              <Link href="#" className={classes.CommitRefMessage} muted>
                Document the retry backoff
              </Link>
              <Link href="#" className={classes.CommitRefOid} muted>
                9a0b1c2
              </Link>
            </div>
          </div>
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The Duplicates event group (audit § 6).
 *
 * All four variants use a default (muted) `DuplicateIcon` badge. This is the
 * first group with a right-controls case: github-ui's `MarkedAsDuplicateEvent`
 * renders an "Undo" button via `TimelineRow.Trailing` when the viewer can undo.
 * We map that to the `Timeline.Actions` slot (sibling of `Timeline.Body`).
 */
export const EventDuplicates = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Marked this as a duplicate of <canonical>. Right-controls "Undo" button
          (viewerCanUndo) → Timeline.Actions. The canonical issue is open, so its
          IssueLink uses the open (green) state icon. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={DuplicateIcon} aria-label="Marked as duplicate" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Marked as duplicate</span>
          <Actor />
          {'marked this as a duplicate of '}
          <Link href="#" className={classes.IssueLink}>
            <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
            <span className={classes.IssueLinkTitle}>Upload fails on large avatars</span>{' '}
            <span className={classes.IssueLinkNumber}>#42</span>
          </Link>{' '}
          <Time date="2022-07-26T11:46:07Z" />
        </Timeline.Body>
        <Timeline.Actions>
          <Button size="small">Undo</Button>
        </Timeline.Actions>
      </Timeline.Item>

      {/* Marked <canonical> as a duplicate of this issue — no right controls. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={DuplicateIcon} aria-label="Marked as canonical" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Marked as canonical</span>
          <Actor />
          {'marked '}
          <Link href="#" className={classes.IssueLink}>
            <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
            <span className={classes.IssueLinkTitle}>Retry uploads on transient errors</span>{' '}
            <span className={classes.IssueLinkNumber}>#43</span>
          </Link>
          {' as a duplicate of this issue '}
          <Time date="2022-07-25T09:12:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Unmarked this as a duplicate of <canonical>. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={DuplicateIcon} aria-label="Unmarked as duplicate" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Unmarked as duplicate</span>
          <Actor />
          {'unmarked this as a duplicate of '}
          <Link href="#" className={classes.IssueLink}>
            <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
            <span className={classes.IssueLinkTitle}>Upload fails on large avatars</span>{' '}
            <span className={classes.IssueLinkNumber}>#42</span>
          </Link>{' '}
          <Time date="2022-07-24T16:40:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Unmarked <canonical> as a duplicate of this issue. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={DuplicateIcon} aria-label="Unmarked as canonical" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Unmarked as canonical</span>
          <Actor />
          {'unmarked '}
          <Link href="#" className={classes.IssueLink}>
            <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
            <span className={classes.IssueLinkTitle}>Retry uploads on transient errors</span>{' '}
            <span className={classes.IssueLinkNumber}>#43</span>
          </Link>
          {' as a duplicate of this issue '}
          <Time date="2022-07-23T11:05:00Z" />
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The Moderation event group (audit § 7).
 *
 * Blocks use a default `BlockedIcon` badge; comment pin/unpin use `PinIcon`.
 * github-ui's UserBlockedEvent renders the blocked user as a bold profile link
 * (no avatar) via `ProfileReference`.
 */
export const EventModeration = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* User blocked (permanent) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="User blocked" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>User blocked</span>
          <Actor />
          {'blocked '}
          <Link href="#" className={classes.LinkWithBoldStyle}>
            six7
          </Link>{' '}
          <Time date="2022-07-26T11:46:07Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* User temporarily blocked */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="User temporarily blocked" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>User temporarily blocked</span>
          <Actor />
          {'temporarily blocked '}
          <Link href="#" className={classes.LinkWithBoldStyle}>
            six7
          </Link>{' '}
          <Time date="2022-07-25T09:12:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Comment pinned — IssueCommentPinnedEvent.tsx links the pinned comment. */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={PinIcon} aria-label="Comment pinned" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Comment pinned</span>
          <Actor />
          {'pinned a '}
          <Link href="#" inline>
            comment
          </Link>{' '}
          <Time date="2022-07-24T16:40:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Comment unpinned */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={PinIcon} aria-label="Comment unpinned" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Comment unpinned</span>
          <Actor />
          {'unpinned a '}
          <Link href="#" inline>
            comment
          </Link>{' '}
          <Time date="2022-07-23T11:05:00Z" />
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The Issue-types event group (audit § 10).
 *
 * All three variants use a default `IssueOpenedIcon` badge. github-ui composes
 * a colored `IssueTypeToken` (Primer `Token` with named-color styling) that
 * links to the type-filtered issue list; approximated here with Primer
 * functional color tokens.
 */
export const EventIssueTypes = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Type added */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueOpenedIcon} aria-label="Issue type added" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Issue type added</span>
          <Actor />
          {'added the '}
          <span className={classes.TokenWrapper}>
            <Token
              as="a"
              href="#"
              text="Bug"
              size="small"
              style={{
                backgroundColor: 'var(--bgColor-danger-muted)',
                color: 'var(--fgColor-danger)',
                borderColor: 'var(--borderColor-danger-muted)',
              }}
            />
          </span>
          {' issue type '}
          <Time date="2022-07-26T11:46:07Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Type removed */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueOpenedIcon} aria-label="Issue type removed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Issue type removed</span>
          <Actor />
          {'removed the '}
          <span className={classes.TokenWrapper}>
            <Token
              as="a"
              href="#"
              text="Bug"
              size="small"
              style={{
                backgroundColor: 'var(--bgColor-danger-muted)',
                color: 'var(--fgColor-danger)',
                borderColor: 'var(--borderColor-danger-muted)',
              }}
            />
          </span>
          {' issue type '}
          <Time date="2022-07-25T09:12:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Type changed */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueOpenedIcon} aria-label="Issue type changed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Issue type changed</span>
          <Actor />
          {'changed the issue type from '}
          <span className={classes.TokenWrapper}>
            <Token
              as="a"
              href="#"
              text="Bug"
              size="small"
              style={{
                backgroundColor: 'var(--bgColor-danger-muted)',
                color: 'var(--fgColor-danger)',
                borderColor: 'var(--borderColor-danger-muted)',
              }}
            />
          </span>
          {' to '}
          <span className={classes.TokenWrapper}>
            <Token
              as="a"
              href="#"
              text="Feature"
              size="small"
              style={{
                backgroundColor: 'var(--bgColor-accent-muted)',
                color: 'var(--fgColor-accent)',
                borderColor: 'var(--borderColor-accent-muted)',
              }}
            />
          </span>{' '}
          <Time date="2022-07-24T16:40:00Z" />
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The Issue-hierarchy event group (audit § 8).
 *
 * Sub-issue events use `IssueTracksIcon`; parent-issue events use
 * `IssueTrackedByIcon`. All default (muted) badge. github-ui renders the
 * linked issues in a bordered list (`TimelineRow.Secondary`) below the copy.
 *
 * SINGLE vs MULTIPLE: live code branches on `itemsToRender.length` — the
 * leading copy switches singular/plural ("added a sub-issue" -> "added
 * sub-issues") AND the secondary list grows from 1 to N `IssueLink` rows.
 * (SubIssueAddedEvent.tsx: `LABELS.timeline.subIssueAdded[length === 1 ?
 * 'single' : 'multiple']` + `itemsToRender.map(...)`.)
 */
export const EventIssueHierarchy = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Sub-issue added (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTracksIcon} aria-label="Sub-issue added" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Sub-issue added (single)</span>
          <Actor />
          {'added a sub-issue '}
          <Time date="2022-07-26T11:46:07Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Add retry logic to the uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#42</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Sub-issue added (multiple) — plural copy + N reference rows */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTracksIcon} aria-label="Sub-issues added" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Sub-issues added (multiple)</span>
          <Actor />
          {'added sub-issues '}
          <Time date="2022-07-25T09:12:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Add retry logic to the uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#42</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueClosedIcon} size={16} className={classes.IssueLinkIcon} />
                <span className={classes.IssueLinkTitle}>Document the retry backoff</span>{' '}
                <span className={classes.IssueLinkNumber}>#43</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Sub-issue removed (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTracksIcon} aria-label="Sub-issue removed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Sub-issue removed (single)</span>
          <Actor />
          {'removed a sub-issue '}
          <Time date="2022-07-24T16:40:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Add retry logic to the uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#42</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Sub-issues removed (multiple) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTracksIcon} aria-label="Sub-issues removed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Sub-issues removed (multiple)</span>
          <Actor />
          {'removed sub-issues '}
          <Time date="2022-07-23T11:05:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Add retry logic to the uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#42</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueClosedIcon} size={16} className={classes.IssueLinkIcon} />
                <span className={classes.IssueLinkTitle}>Document the retry backoff</span>{' '}
                <span className={classes.IssueLinkNumber}>#43</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Parent issue added (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTrackedByIcon} aria-label="Parent issue added" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Parent issue added (single)</span>
          <Actor />
          {'added a parent issue '}
          <Time date="2022-07-22T14:20:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Epic: reliable avatar uploads</span>{' '}
                <span className={classes.IssueLinkNumber}>#7</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Parent issues added (multiple) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTrackedByIcon} aria-label="Parent issues added" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Parent issues added (multiple)</span>
          <Actor />
          {'added parent issues '}
          <Time date="2022-07-21T08:30:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Epic: reliable avatar uploads</span>{' '}
                <span className={classes.IssueLinkNumber}>#7</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Q3 reliability tracker</span>{' '}
                <span className={classes.IssueLinkNumber}>#8</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Parent issue removed (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTrackedByIcon} aria-label="Parent issue removed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Parent issue removed (single)</span>
          <Actor />
          {'removed a parent issue '}
          <Time date="2022-07-20T10:00:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Epic: reliable avatar uploads</span>{' '}
                <span className={classes.IssueLinkNumber}>#7</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Parent issues removed (multiple) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={IssueTrackedByIcon} aria-label="Parent issues removed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Parent issues removed (multiple)</span>
          <Actor />
          {'removed parent issues '}
          <Time date="2022-07-19T13:15:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Epic: reliable avatar uploads</span>{' '}
                <span className={classes.IssueLinkNumber}>#7</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Q3 reliability tracker</span>{' '}
                <span className={classes.IssueLinkNumber}>#8</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The Dependencies event group (audit § 9).
 *
 * Blocked-by and blocking events both use `BlockedIcon` (default badge). The
 * dependent issues render in a bordered secondary list, like the hierarchy
 * group.
 *
 * SINGLE vs MULTIPLE: live code branches on `itemsToRender.length`. Singular
 * copy has no count ("marked this as blocked"); plural copy adds a count
 * ("marked this as blocked by 2 issues") via `LABELS.timeline.blockedByAdded
 * .multiple(count)`, and the secondary list grows from 1 to N rows.
 */
export const EventDependencies = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Blocked by (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Marked as blocked" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocked by (single)</span>
          <Actor />
          {'marked this as blocked '}
          <Time date="2022-07-26T11:46:07Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Upgrade the storage client</span>{' '}
                <span className={classes.IssueLinkNumber}>#51</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Blocked by (multiple) — count in copy + N rows */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Marked as blocked by multiple issues" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocked by (multiple)</span>
          <Actor />
          {'marked this as blocked by 2 issues '}
          <Time date="2022-07-25T09:12:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Upgrade the storage client</span>{' '}
                <span className={classes.IssueLinkNumber}>#51</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Add multipart upload support</span>{' '}
                <span className={classes.IssueLinkNumber}>#52</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Blocked by removed (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Unmarked as blocked" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocked by removed (single)</span>
          <Actor />
          {'unmarked this as blocked '}
          <Time date="2022-07-24T16:40:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Upgrade the storage client</span>{' '}
                <span className={classes.IssueLinkNumber}>#51</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Blocked by removed (multiple) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Unmarked as blocked by multiple issues" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocked by removed (multiple)</span>
          <Actor />
          {'unmarked this as blocked by 2 issues '}
          <Time date="2022-07-23T11:05:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Upgrade the storage client</span>{' '}
                <span className={classes.IssueLinkNumber}>#51</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Add multipart upload support</span>{' '}
                <span className={classes.IssueLinkNumber}>#52</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Blocking (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Marked as blocking" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocking (single)</span>
          <Actor />
          {'marked this as blocking '}
          <Time date="2022-07-22T14:20:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Ship the avatar uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#60</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Blocking (multiple) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Marked as blocking multiple issues" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocking (multiple)</span>
          <Actor />
          {'marked this as blocking 2 issues '}
          <Time date="2022-07-21T08:30:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Ship the avatar uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#60</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Roll out to mobile clients</span>{' '}
                <span className={classes.IssueLinkNumber}>#61</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Blocking removed (single) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Unmarked as blocking" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocking removed (single)</span>
          <Actor />
          {'unmarked this as blocking '}
          <Time date="2022-07-20T10:00:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Ship the avatar uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#60</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>

      {/* Blocking removed (multiple) */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={BlockedIcon} aria-label="Unmarked as blocking multiple issues" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Blocking removed (multiple)</span>
          <Actor />
          {'unmarked this as blocking 2 issues '}
          <Time date="2022-07-19T13:15:00Z" />
          <ul className={classes.RefList}>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Ship the avatar uploader</span>{' '}
                <span className={classes.IssueLinkNumber}>#60</span>
              </Link>
            </li>
            <li className={classes.RefListItem}>
              <Link href="#" className={classes.IssueLink}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
                <span className={classes.IssueLinkTitle}>Roll out to mobile clients</span>{' '}
                <span className={classes.IssueLinkNumber}>#61</span>
              </Link>
            </li>
          </ul>
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)

/**
 * The Issue-fields event group (audit § 11).
 *
 * Custom issue-field updates. The badge icon is per field TYPE, resolved by
 * github-ui's `getFieldTypeOcticon`: text -> `TypographyIcon`, number ->
 * `NumberIcon`, date -> `CalendarIcon`, single-select -> `SingleSelectIcon`.
 * All default (muted) badge. Copy: set -> "set {field} to {value}", changed ->
 * "changed {field} to {value}", cleared -> "cleared {field}" (no value).
 * Single-select values render as a colored token; date as a formatted date.
 *
 * The final three variants are ROLLUPS (`RolledupIssueFieldEvent`): multiple
 * field updates collapse into one row — "updated {…}", "removed {…}", or both
 * joined by "and also". Rollup rows use the default-type (`TypographyIcon`)
 * badge. (Audit notes the IssueField rollup window is 1 hour; fixtures model
 * only the rendered variants, not the timing.)
 */
export const EventIssueFields = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <Timeline aria-label="Issue timeline">
      {/* Set text field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={TypographyIcon} aria-label="Text field set" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Set · text</span>
          <Actor />
          {'set '}
          <span className={classes.FieldName}>Team</span>
          {' to '}
          <Link href="#" inline className={classes.FieldValue}>
            Identity
          </Link>{' '}
          <Time date="2022-07-26T11:46:07Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Set number field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={NumberIcon} aria-label="Number field set" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Set · number</span>
          <Actor />
          {'set '}
          <span className={classes.FieldName}>Story Points</span>
          {' to '}
          <Link href="#" inline className={classes.FieldValue}>
            5
          </Link>{' '}
          <Time date="2022-07-25T15:30:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Set date field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={CalendarIcon} aria-label="Date field set" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Set · date</span>
          <Actor />
          {'set '}
          <span className={classes.FieldName}>Target Date</span>
          {' to '}
          <Link href="#" inline className={classes.FieldValue}>
            Aug 1, 2022
          </Link>{' '}
          <Time date="2022-07-25T09:12:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Set single-select field — value is a colored token */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={SingleSelectIcon} aria-label="Single select field set" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Set · single select</span>
          <Actor />
          {'set '}
          <span className={classes.FieldName}>Priority</span>
          {' to '}
          {/* github-ui renders an `IssueFieldSingleSelectValueToken` (colored
              Primer Token) for select values; approximated with functional
              color tokens. */}
          <span className={classes.TokenWrapper}>
            <Token
              as="a"
              href="#"
              text="High"
              size="small"
              style={{
                backgroundColor: 'var(--bgColor-danger-muted)',
                color: 'var(--fgColor-danger)',
                borderColor: 'var(--borderColor-danger-muted)',
              }}
            />
          </span>{' '}
          <Time date="2022-07-24T16:40:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Changed text field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={TypographyIcon} aria-label="Text field changed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Changed · text</span>
          <Actor />
          {'changed '}
          <span className={classes.FieldName}>Team</span>
          {' to '}
          <Link href="#" inline className={classes.FieldValue}>
            Platform
          </Link>{' '}
          <Time date="2022-07-23T11:05:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Changed number field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={NumberIcon} aria-label="Number field changed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Changed · number</span>
          <Actor />
          {'changed '}
          <span className={classes.FieldName}>Story Points</span>
          {' to '}
          <Link href="#" inline className={classes.FieldValue}>
            8
          </Link>{' '}
          <Time date="2022-07-22T14:20:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Changed date field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={CalendarIcon} aria-label="Date field changed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Changed · date</span>
          <Actor />
          {'changed '}
          <span className={classes.FieldName}>Target Date</span>
          {' to '}
          <Link href="#" inline className={classes.FieldValue}>
            Aug 15, 2022
          </Link>{' '}
          <Time date="2022-07-21T08:30:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Changed single-select field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={SingleSelectIcon} aria-label="Single select field changed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Changed · single select</span>
          <Actor />
          {'changed '}
          <span className={classes.FieldName}>Priority</span>
          {' to '}
          <span className={classes.TokenWrapper}>
            <Token
              as="a"
              href="#"
              text="Low"
              size="small"
              style={{
                backgroundColor: 'var(--bgColor-success-muted)',
                color: 'var(--fgColor-success)',
                borderColor: 'var(--borderColor-success-muted)',
              }}
            />
          </span>{' '}
          <Time date="2022-07-20T10:00:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Cleared text field — no value */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={TypographyIcon} aria-label="Text field cleared" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Cleared · text</span>
          <Actor />
          {'cleared '}
          <span className={classes.FieldName}>Team</span> <Time date="2022-07-19T13:15:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Cleared number field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={NumberIcon} aria-label="Number field cleared" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Cleared · number</span>
          <Actor />
          {'cleared '}
          <span className={classes.FieldName}>Story Points</span> <Time date="2022-07-18T09:00:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Cleared date field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={CalendarIcon} aria-label="Date field cleared" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Cleared · date</span>
          <Actor />
          {'cleared '}
          <span className={classes.FieldName}>Target Date</span> <Time date="2022-07-17T12:00:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Cleared single-select field */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={SingleSelectIcon} aria-label="Single select field cleared" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Cleared · single select</span>
          <Actor />
          {'cleared '}
          <span className={classes.FieldName}>Priority</span> <Time date="2022-07-16T08:30:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Rollup: updated only — multiple field updates collapsed into one row */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={TypographyIcon} aria-label="Fields updated" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Rollup · updated</span>
          <Actor />
          {'updated '}
          <span className={classes.FieldName}>Team</span>
          <Link href="#" inline className={classes.FieldValue}>
            Platform
          </Link>
          {' and '}
          <span className={classes.FieldName}>Story Points</span>
          <Link href="#" inline className={classes.FieldValue}>
            8
          </Link>{' '}
          <Time date="2022-07-15T10:00:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Rollup: removed only */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={TypographyIcon} aria-label="Fields removed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Rollup · removed</span>
          <Actor />
          {'removed '}
          <span className={classes.FieldName}>Team</span>
          {' and '}
          <span className={classes.FieldName}>Priority</span> <Time date="2022-07-14T10:00:00Z" />
        </Timeline.Body>
      </Timeline.Item>

      {/* Rollup: updated and also removed — combined row joined by "and also" */}
      <Timeline.Item>
        <Timeline.Badge>
          <Octicon icon={TypographyIcon} aria-label="Fields updated and removed" />
        </Timeline.Badge>
        <Timeline.Body>
          <span className={classes.VariantLabel}>Rollup · updated and removed</span>
          <Actor />
          {'updated '}
          <span className={classes.FieldName}>Team</span>
          <Link href="#" inline className={classes.FieldValue}>
            Platform
          </Link>
          {', and also removed '}
          <span className={classes.FieldName}>Priority</span> <Time date="2022-07-13T10:00:00Z" />
        </Timeline.Body>
      </Timeline.Item>
    </Timeline>
  </div>
)
