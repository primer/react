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
 * SCOPE: These are Storybook-only examples by design. They are intentionally
 * NOT wired into components-json / the primer.style docs page (do NOT add this
 * file to `Timeline.docs.json` or `build.ts`). Individual timeline events are not
 * consumer-facing components — the primer.style Timeline page reflects the base
 * `Timeline` component's own stories, and any docs-site representation is a
 * Phase 3 consideration via base-component story changes, out of scope here.
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
  title: 'Components/Timeline/Events/Issues',
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
    {/* Closed as completed */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as completed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} aria-label="Closed as completed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'closed this as '}
            <Link href="#" inline>
              completed
            </Link>{' '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Not planned — neutral (gray) badge. Timeline.Badge has no `neutral`
          variant, so drive the documented `--timelineBadge-bgColor` hook inline
          (portable for docs copy-paste; matches production `TimelineRow`). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as not planned</h3>
      <Timeline aria-label="Issue timeline">
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
            <Actor />
            {'closed this as '}
            <Link href="#" inline>
              not planned
            </Link>{' '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed via pull request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed via pull request</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} aria-label="Closed via pull request" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Closed via commit */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed via commit</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} aria-label="Closed via commit" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Closed via project (ProjectV2 status change). github-ui composes
          the closer link as TableIcon + project title; there is no Primer
          equivalent for github-ui's `ProjectV2` closer link. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed via project</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} aria-label="Closed via project" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'closed this as '}
            <Link href="#" inline>
              completed
            </Link>
            {' by moving to Done in '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" className={classes.LinkWithBoldStyle}>
              Roadmap
            </Link>{' '}
            <Time date="2022-07-22T14:20:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as duplicate — neutral (gray) badge (see note above). github-ui
          renders an `IssueLink` (state icon + title + #number + hovercard);
          composed here from Primer primitives. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as duplicate</h3>
      <Timeline aria-label="Issue timeline">
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
      </Timeline>
    </section>

    {/* Closed with no state reason */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed (no reason)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} aria-label="Closed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'closed this '}
            <Time date="2022-07-20T10:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
    {/* Reopened — open (green) badge via useIssueState (ReopenedEvent.tsx) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reopened</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge variant="open">
            <Octicon icon={IssueReopenedIcon} aria-label="Reopened" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'reopened this '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Transferred — github-ui's TransferredEvent renders the source repo as a
          plain inline Link (the audit shows it bold; live code is canonical). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Transferred</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} aria-label="Transferred" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'transferred this issue from '}
            <Link href="#" inline>
              octo-org/legacy-repo
            </Link>{' '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Pinned */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Pinned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PinIcon} aria-label="Pinned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'pinned this issue '}
            <Time date="2022-07-24T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unpinned */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unpinned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PinIcon} aria-label="Unpinned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'unpinned this issue '}
            <Time date="2022-07-23T11:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Converted to discussion — github-ui's ConvertedToDiscussionEvent links
          the resulting discussion by number. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Converted to discussion</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentDiscussionIcon} aria-label="Converted to discussion" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'converted this issue into a discussion '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              #123
            </Link>{' '}
            <Time date="2022-07-22T14:20:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Converted from draft */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Converted from draft</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueDraftIcon} aria-label="Converted from draft" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'converted this from a draft issue '}
            <Time date="2022-07-21T08:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
    {/* Linked pull request — ConnectedEvent.tsx (CrossReferenceIcon badge,
          open PR state icon inline before the PR title). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Linked pull request</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CrossReferenceIcon} aria-label="Linked pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'linked a pull request that will close this issue '}
            <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
            <Link href="#" className={classes.LinkWithBoldStyle}>
              Add retry logic to the uploader
            </Link>
            <span className={classes.IssueLinkNumber}>#42</span> <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unlinked pull request — DisconnectedEvent.tsx uses the PR state icon AS
          the badge icon (leadingIcon={PullStateIcon}), so the badge octicon is
          green (open) on a default badge. Verified the live render path is
          active (in TIMELINE_ITEMS[__typename], current useIssueState hook,
          story fixture is an OPEN PR) — the Figma audit's gray cross-reference
          icon is behind the live code here. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unlinked pull request</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitPullRequestIcon} className={classes.BadgeIconOpen} aria-label="Unlinked pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'removed a link to a pull request '}
            <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
            <Link href="#" className={classes.LinkWithBoldStyle}>
              Add retry logic to the uploader
            </Link>
            <span className={classes.IssueLinkNumber}>#42</span> <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Single commit reference — ReferencedEvent.tsx. The timestamp renders
          inline (showAgoTimestamp={false}) and the commit card is sub-content. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Single commit reference</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit reference" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Multiple commit references — same event, pluralized copy + N cards. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Multiple commit references</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} aria-label="Commit references" />
          </Timeline.Badge>
          <Timeline.Body>
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
    </section>
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
    {/* Marked this as a duplicate of <canonical>. Right-controls "Undo" button
          (viewerCanUndo) → Timeline.Actions. The canonical issue is open, so its
          IssueLink uses the open (green) state icon. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Marked as duplicate</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} aria-label="Marked as duplicate" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Marked <canonical> as a duplicate of this issue — no right controls. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Marked as canonical</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} aria-label="Marked as canonical" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Unmarked this as a duplicate of <canonical>. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unmarked as duplicate</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} aria-label="Unmarked as duplicate" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Unmarked <canonical> as a duplicate of this issue. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unmarked as canonical</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} aria-label="Unmarked as canonical" />
          </Timeline.Badge>
          <Timeline.Body>
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
    </section>
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
    {/* User blocked (permanent) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>User blocked</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="User blocked" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'blocked '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              six7
            </Link>{' '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* User temporarily blocked */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>User temporarily blocked</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="User temporarily blocked" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'temporarily blocked '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              six7
            </Link>{' '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Comment pinned — IssueCommentPinnedEvent.tsx links the pinned comment. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Comment pinned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PinIcon} aria-label="Comment pinned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'pinned a '}
            <Link href="#" inline>
              comment
            </Link>{' '}
            <Time date="2022-07-24T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Comment unpinned */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Comment unpinned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PinIcon} aria-label="Comment unpinned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'unpinned a '}
            <Link href="#" inline>
              comment
            </Link>{' '}
            <Time date="2022-07-23T11:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
    {/* Type added */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Issue type added</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueOpenedIcon} aria-label="Issue type added" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Type removed */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Issue type removed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueOpenedIcon} aria-label="Issue type removed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Type changed */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Issue type changed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueOpenedIcon} aria-label="Issue type changed" />
          </Timeline.Badge>
          <Timeline.Body>
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
    </section>
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
    {/* Sub-issue added (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Sub-issue added (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} aria-label="Sub-issue added" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Sub-issue added (multiple) — plural copy + N reference rows */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Sub-issues added (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} aria-label="Sub-issues added" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Sub-issue removed (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Sub-issue removed (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} aria-label="Sub-issue removed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Sub-issues removed (multiple) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Sub-issues removed (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} aria-label="Sub-issues removed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Parent issue added (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Parent issue added (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} aria-label="Parent issue added" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Parent issues added (multiple) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Parent issues added (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} aria-label="Parent issues added" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Parent issue removed (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Parent issue removed (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} aria-label="Parent issue removed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Parent issues removed (multiple) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Parent issues removed (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} aria-label="Parent issues removed" />
          </Timeline.Badge>
          <Timeline.Body>
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
    </section>
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
    {/* Blocked by (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocked by (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Marked as blocked" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Blocked by (multiple) — count in copy + N rows */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocked by (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Marked as blocked by multiple issues" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Blocked by removed (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocked by removed (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Unmarked as blocked" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Blocked by removed (multiple) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocked by removed (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Unmarked as blocked by multiple issues" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Blocking (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocking (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Marked as blocking" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Blocking (multiple) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocking (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Marked as blocking multiple issues" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Blocking removed (single) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocking removed (single)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Unmarked as blocking" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Blocking removed (multiple) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Blocking removed (multiple)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} aria-label="Unmarked as blocking multiple issues" />
          </Timeline.Badge>
          <Timeline.Body>
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
    </section>
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
    {/* Set text field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Set · text</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} aria-label="Text field set" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Set number field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Set · number</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={NumberIcon} aria-label="Number field set" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Set date field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Set · date</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CalendarIcon} aria-label="Date field set" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Set single-select field — value is a colored token */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Set · single select</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SingleSelectIcon} aria-label="Single select field set" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Changed text field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Changed · text</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} aria-label="Text field changed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Changed number field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Changed · number</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={NumberIcon} aria-label="Number field changed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Changed date field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Changed · date</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CalendarIcon} aria-label="Date field changed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Changed single-select field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Changed · single select</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SingleSelectIcon} aria-label="Single select field changed" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Cleared text field — no value */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Cleared · text</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} aria-label="Text field cleared" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'cleared '}
            <span className={classes.FieldName}>Team</span> <Time date="2022-07-19T13:15:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Cleared number field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Cleared · number</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={NumberIcon} aria-label="Number field cleared" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'cleared '}
            <span className={classes.FieldName}>Story Points</span> <Time date="2022-07-18T09:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Cleared date field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Cleared · date</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CalendarIcon} aria-label="Date field cleared" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'cleared '}
            <span className={classes.FieldName}>Target Date</span> <Time date="2022-07-17T12:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Cleared single-select field */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Cleared · single select</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SingleSelectIcon} aria-label="Single select field cleared" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'cleared '}
            <span className={classes.FieldName}>Priority</span> <Time date="2022-07-16T08:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Rollup: updated only — multiple field updates collapsed into one row */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Rollup · updated</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} aria-label="Fields updated" />
          </Timeline.Badge>
          <Timeline.Body>
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
      </Timeline>
    </section>

    {/* Rollup: removed only */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Rollup · removed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} aria-label="Fields removed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'removed '}
            <span className={classes.FieldName}>Team</span>
            {' and '}
            <span className={classes.FieldName}>Priority</span> <Time date="2022-07-14T10:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Rollup: updated and also removed — combined row joined by "and also" */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Rollup · updated and removed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} aria-label="Fields updated and removed" />
          </Timeline.Badge>
          <Timeline.Body>
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
    </section>
  </div>
)

/**
 * The Project event group — shared timeline events (ProjectV2), Issue version.
 *
 * Sourced from the live React `timeline-items` components, which are the ISSUE
 * implementation of these "shared" events: `AddedToProjectV2Event.tsx`,
 * `RemovedFromProjectV2Event.tsx`, `ProjectV2ItemStatusChangedEvent.tsx`, and
 * the shared `ProjectV2.tsx` sub-component. All three use a `TableIcon` badge.
 *
 * Issue-version `{ProjectV2}` reference (live `ProjectV2.tsx`): an inline
 * default-colored `TableIcon` octicon, then a `<Link inline>` with REGULAR
 * weight and `color: var(--fgColor-default)` (NOT bold, NOT accent-blue). The
 * `inline` prop supplies the always-on underline. Status text is PLAIN TEXT
 * (live `ProjectV2ItemStatusChangedEvent.tsx` renders `status`/`previousStatus`
 * as bare strings, not bold).
 *
 * PR-SURFACE DIVERGENCE (build the PR version from ERB later, NOT from this):
 * The PR (ERB) path renders these events DIFFERENTLY —
 *   - Project link: `app/views/issues/events/_memex_project_link.html.erb` uses
 *     `<a class="Link--primary text-bold">` — i.e. a BOLD project name, NO inline
 *     `TableIcon`, and hover-only underline.
 *   - Status: `_project_item_status_changed_event.html.erb` wraps the status in
 *     `<strong>` (BOLD).
 * So: Issue = inline icon + regular-weight always-underlined link + plain-text
 * status; PR = bold link, no icon, bold status. Whoever builds the PR surface
 * must use the ERB spec above, not this Issue composition.
 */
export const EventProject = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Added to project */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Added to project</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TableIcon} aria-label="Added to project" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'added this to '}
            {/* Issue-version ProjectV2 reference (github-ui `ProjectV2.tsx`). */}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Removed from project */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Removed from project</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TableIcon} aria-label="Removed from project" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'removed this from '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Project status changed. Two forms per live
        `ProjectV2ItemStatusChangedEvent.tsx`: with no previous status,
        "moved this to {status} in {project}"; with a previous status,
        "moved this from {previousStatus} to {status} in {project}". Status
        strings are PLAIN TEXT (not bold). Both forms shown under one caption. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Project status changed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TableIcon} aria-label="Project status changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'moved this to In Progress in '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <Time date="2022-07-24T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TableIcon} aria-label="Project status changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'moved this from Todo to In Progress in '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <Time date="2022-07-24T16:42:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Labels event group — shared timeline events (Issue version).
 *
 * Sourced from live `LabeledEvent.tsx` / `UnlabeledEvent.tsx` (badge `TagIcon`).
 * Copy is just "added {label}" / "removed {label}" (live `LABELS.timeline.added`
 * / `removed`, then the `Label` pill — no "the"/"label" filler words). The
 * rolled-up form (`RolledupLabeledEvent`) joins them: "added {…} and removed {…}".
 *
 * Labels render as colored pills; the color comes from the label in live code
 * (`@github-ui/label-token` `LabelToken`). We compose the closest Primer
 * equivalent with `Token` + the label's semantic color tokens (same pattern as
 * the IssueTypes group).
 *
 * PR ERB source: `app/views/issues/events/_labeled_event.html.erb` — verify on
 * the PR build (label pill markup is shared, copy is the same).
 */
export const EventLabels = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Label added */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Label added</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TagIcon} aria-label="Label added" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'added '}
            <span className={classes.TokenWrapper}>
              <Token
                as="a"
                href="#"
                text="bug"
                size="small"
                style={{
                  backgroundColor: 'var(--bgColor-danger-muted)',
                  color: 'var(--fgColor-danger)',
                  borderColor: 'var(--borderColor-danger-muted)',
                }}
              />
            </span>{' '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Label removed */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Label removed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TagIcon} aria-label="Label removed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'removed '}
            <span className={classes.TokenWrapper}>
              <Token
                as="a"
                href="#"
                text="bug"
                size="small"
                style={{
                  backgroundColor: 'var(--bgColor-danger-muted)',
                  color: 'var(--fgColor-danger)',
                  borderColor: 'var(--borderColor-danger-muted)',
                }}
              />
            </span>{' '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Added + removed (rollup) — RolledupLabeledEvent joins both renderings
        with "and" between them. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Labels added and removed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TagIcon} aria-label="Labels added and removed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'added '}
            <span className={classes.TokenWrapper}>
              <Token
                as="a"
                href="#"
                text="enhancement"
                size="small"
                style={{
                  backgroundColor: 'var(--bgColor-accent-muted)',
                  color: 'var(--fgColor-accent)',
                  borderColor: 'var(--borderColor-accent-muted)',
                }}
              />
            </span>
            {' and removed '}
            <span className={classes.TokenWrapper}>
              <Token
                as="a"
                href="#"
                text="bug"
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
      </Timeline>
    </section>
  </div>
)

/**
 * The Title event group — shared timeline event (Issue version).
 *
 * Sourced from live `RenamedTitleEvent.tsx` (badge `PencilIcon`). Copy is
 * "changed the title {old} {new}" where the OLD title is struck through (`<del>`,
 * default color) and the NEW title is plain (default color, no underline). NOTE
 * audit-vs-live DRIFT: the audit phrases this "changed the title from {old} to
 * {new}", but live renders NO "from"/"to" words — just strikethrough old then
 * new (`LABELS.timeline.renamedTitle` = "changed the title").
 *
 * PR ERB source: `app/views/issues/events/_renamed_event.html.erb` — verify on
 * the PR build.
 */
export const EventTitle = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Title changed */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Title changed</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PencilIcon} aria-label="Title changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'changed the title '}
            <del>Fix the uplaod bug</del> Fix the upload bug <Time date="2022-07-23T11:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Milestones event group — shared timeline events (Issue version).
 *
 * Sourced from live `MilestonedEvent.tsx` / `DemilestonedEvent.tsx` (badge
 * `MilestoneIcon`). Copy: "added this to the {milestone} milestone" /
 * "removed this from the {milestone} milestone" (`LABELS.timeline.addedToMilestone`
 * / `removedFromMilestone` + the milestone link + `milestone`). The milestone
 * link is a regular-weight, default-color `<Link inline>` (live `.milestoneLink`
 * = `color: var(--fgColor-default)`); the `inline` prop gives the always-on
 * underline (also satisfies the high-contrast a11y rule).
 *
 * PR ERB source: `app/views/issues/events/_milestoned_event.html.erb` — verify
 * on the PR build.
 */
export const EventMilestones = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Added to milestone */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Added to milestone</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={MilestoneIcon} aria-label="Added to milestone" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'added this to the '}
            <Link href="#" inline className={classes.ProjectRefLink}>
              v2.0
            </Link>
            {' milestone '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Removed from milestone */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Removed from milestone</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={MilestoneIcon} aria-label="Removed from milestone" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'removed this from the '}
            <Link href="#" inline className={classes.ProjectRefLink}>
              v2.0
            </Link>
            {' milestone '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Assignments event group — shared timeline events (Issue version).
 *
 * Sourced from live `AssignedEvent.tsx` / `UnassignedEvent.tsx` (badge
 * `PersonIcon`). Copy: self → "self-assigned this" / "removed their assignment"
 * (no actor-name prefix); other → "assigned {user}" / "unassigned {user}";
 * multiple → joined with "and". The assignee is a BOLD text link with NO avatar
 * in the React Issue impl (`AssignmentEventAssignee` → `ProfileReference` inside
 * a `<Link>`, no avatar element).
 *
 * PR/Dependabot DIVERGENCE: Dependabot's assignment events render the assignee
 * via a different ActorComponent that DOES include an inline avatar (avatar +
 * name), unlike this Issue impl (bold name only). Whoever builds the
 * Dependabot/PR surface must use that ActorComponent, not this composition.
 */
export const EventAssignments = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Self-assigned */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Self-assigned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Self-assigned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'self-assigned this '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Assigned someone else — assignee is a bold link, no avatar. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Assigned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Assigned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'assigned '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              hubot
            </Link>{' '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Assigned multiple — joined with "and". */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Assigned multiple</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Assigned multiple" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'assigned '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              hubot
            </Link>
            {' and '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              octocat
            </Link>{' '}
            <Time date="2022-07-24T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Self-unassigned */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Self-unassigned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Self-unassigned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'removed their assignment '}
            <Time date="2022-07-23T11:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unassigned someone else */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unassigned</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Unassigned" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'unassigned '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              hubot
            </Link>{' '}
            <Time date="2022-07-22T14:20:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unassigned multiple — joined with "and". */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unassigned multiple</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Unassigned multiple" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'unassigned '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              hubot
            </Link>
            {' and '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              octocat
            </Link>{' '}
            <Time date="2022-07-21T08:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Lock/Unlock event group — shared timeline events (Issue version).
 *
 * Sourced from live `LockedEvent.tsx` / `UnlockedEvent.tsx`. Locked uses the
 * `LockIcon` badge; UNLOCKED uses the `UnlockIcon` badge (badge DRIFT vs the
 * single "LockIcon" family note — live `UnlockedEvent` passes
 * `leadingIcon={UnlockIcon}`). Locked copy: "locked as {reason} and limited
 * conversation to collaborators" (reason from `VALUES.lockedReasonStrings`:
 * off topic / resolved / spam / too heated); with no reason: "locked and limited
 * conversation to collaborators". Unlocked copy: "unlocked this conversation".
 *
 * PR ERB source: `app/views/issues/events/_locked_event.html.erb` — verify on
 * the PR build.
 */
export const EventLockUnlock = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Locked with reason — one row per reason (off topic / resolved / spam /
        too heated). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Locked (with reason)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LockIcon} aria-label="Locked as off topic" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'locked as off topic and limited conversation to collaborators '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LockIcon} aria-label="Locked as resolved" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'locked as resolved and limited conversation to collaborators '}
            <Time date="2022-07-26T11:47:00Z" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LockIcon} aria-label="Locked as spam" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'locked as spam and limited conversation to collaborators '}
            <Time date="2022-07-26T11:48:00Z" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LockIcon} aria-label="Locked as too heated" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'locked as too heated and limited conversation to collaborators '}
            <Time date="2022-07-26T11:49:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Locked (no reason) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Locked (no reason)</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LockIcon} aria-label="Locked" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'locked and limited conversation to collaborators '}
            <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unlocked — UnlockIcon badge (not LockIcon). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unlocked</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={UnlockIcon} aria-label="Unlocked" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'unlocked this conversation '}
            <Time date="2022-07-24T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Comment-deleted event group — shared timeline event (Issue version).
 *
 * Sourced from live `CommentDeletedEvent.tsx` (badge `TrashIcon`). Copy:
 * "deleted a comment from {user}" (`LABELS.timeline.deletedACommentFrom` + the
 * deleted comment author as an inline `<Link>` wrapping a `ProfileReference`).
 * The author link uses the `inline` prop (always-on underline / high-contrast).
 *
 * PR ERB source: `app/views/issues/events/_comment_deleted_event.html.erb` —
 * verify on the PR build.
 */
export const EventCommentDeleted = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Comment deleted */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Comment deleted</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TrashIcon} aria-label="Comment deleted" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'deleted a comment from '}
            <Link href="#" inline>
              octocat
            </Link>{' '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Cross-references event group — shared timeline events (Issue version).
 *
 * Sourced from live `CrossReferencedEvent.tsx` + `IssueLink.tsx` (badge
 * `LinkExternalIcon`). The body message is "mentioned this" (then timestamp);
 * the closing-PR form is "linked a pull request that will close this issue";
 * rolled-up forms read "mentioned this in {n} issues / pull requests". The
 * referenced source is rendered in a Secondary slot as an `IssueLink` row:
 * a state octicon (from `useIssueState().sourceIcon` — open issue green
 * `IssueOpenedIcon`, open PR green `GitPullRequestIcon`) + the title + the
 * abbreviated #number reference. We reuse the plain (borderless) `.RefList`.
 *
 * PR ERB source: `app/views/issues/events/_cross_referenced_event.html.erb` —
 * verify on the PR build.
 */
export const EventCrossReferences = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Mentioned from an issue */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Mentioned in an issue</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} aria-label="Mentioned in an issue" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'mentioned this '}
            <Time date="2022-07-26T11:46:07Z" />
            <ul className={classes.RefList}>
              <li className={classes.RefListItem}>
                <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} aria-label="Open" />
                <Link href="#" inline className={classes.IssueLinkTitle}>
                  Track flaky upload retries
                </Link>
                <span className={classes.IssueLinkNumber}> #128</span>
              </li>
            </ul>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Mentioned from a pull request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Mentioned in a pull request</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} aria-label="Mentioned in a pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'mentioned this '}
            <Time date="2022-07-25T09:12:00Z" />
            <ul className={classes.RefList}>
              <li className={classes.RefListItem}>
                <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
                <Link href="#" inline className={classes.IssueLinkTitle}>
                  Add retry logic to the uploader
                </Link>
                <span className={classes.IssueLinkNumber}> #42</span>
              </li>
            </ul>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Linked a closing pull request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Linked a closing pull request</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} aria-label="Linked a closing pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <Actor />
            {'linked a pull request that will close this issue '}
            <Time date="2022-07-24T16:40:00Z" />
            <ul className={classes.RefList}>
              <li className={classes.RefListItem}>
                <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
                <Link href="#" inline className={classes.IssueLinkTitle}>
                  Fix the upload retry race condition
                </Link>
                <span className={classes.IssueLinkNumber}> #57</span>
              </li>
            </ul>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)
