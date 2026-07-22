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
import {Button} from '../Button'
import Label from '../Label'
import Link from '../Link'
import Octicon from '../Octicon'
import Token from '../Token'
import classes from './Timeline.issues.features.stories.module.css'
import {BoldLink, Examples, MutedTime, UserActor, VariantSection} from './internal/timelineStoryHelpers'
import {actorTypeForLogin, ISSUE_TAXONOMY, toEventDataAttributes} from './taxonomy'
import type {IssueEventType} from './taxonomy'

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
 * Serialize the taxonomy `data-*` contract (github/primer#6664) for one Issues
 * event row. `type` is an ISSUE_TAXONOMY leaf; `category` + `visibility` are read
 * from the catalog, so metadata leaves (labels, assignees, milestones, project
 * fields, issue types, rename) pick up `visibility: 'auditOnly'` automatically.
 * Pass the row's rendered actor login so `data-actor-type` resolves (every Issues
 * event carries an actor).
 */
const issueAttrs = (type: IssueEventType, login?: string) =>
  toEventDataAttributes({
    scope: 'issue',
    type,
    category: ISSUE_TAXONOMY[type].category,
    visibility: ISSUE_TAXONOMY[type].visibility,
    actorType: login ? actorTypeForLogin(login) : undefined,
  })

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
  <Examples>
    {/* Closed as completed */}
    <VariantSection label="Closed as completed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <Link href="#" inline>
              completed
            </Link>{' '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Not planned — neutral (gray) badge. Timeline.Badge has no `neutral`
          variant, so drive the documented `--timelineBadge-bgColor` hook inline
          (portable for docs copy-paste; matches production `TimelineRow`). */}
    <VariantSection label="Closed as not planned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('closed', 'monalisa')}>
          <Timeline.Badge
            style={
              {
                '--timelineBadge-bgColor': 'var(--bgColor-neutral-emphasis)',
                color: 'var(--fgColor-onEmphasis)',
              } as React.CSSProperties
            }
          >
            <Octicon icon={CircleSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <Link href="#" inline>
              not planned
            </Link>{' '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed via pull request */}
    <VariantSection label="Closed via pull request">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <Link href="#" inline>
              completed
            </Link>
            {' in '}
            <BoldLink href="#">#123</BoldLink> <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed via commit */}
    <VariantSection label="Closed via commit">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <Link href="#" inline>
              completed
            </Link>
            {' in '}
            <Link href="#" className={classes.CommitSha}>
              abc1234
            </Link>{' '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed via project (ProjectV2 status change). github-ui composes
          the closer link as TableIcon + project title; there is no Primer
          equivalent for github-ui's `ProjectV2` closer link. */}
    <VariantSection label="Closed via project">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <Link href="#" inline>
              completed
            </Link>
            {' by moving to Done in '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <BoldLink href="#">Roadmap</BoldLink> <MutedTime date={new Date('2022-07-22T14:20:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as duplicate — neutral (gray) badge (see note above). github-ui
          renders an `IssueLink` (state icon + title + #number + hovercard);
          composed here from Primer primitives. */}
    <VariantSection label="Closed as duplicate">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('closed', 'monalisa')}>
          <Timeline.Badge
            style={
              {
                '--timelineBadge-bgColor': 'var(--bgColor-neutral-emphasis)',
                color: 'var(--fgColor-onEmphasis)',
              } as React.CSSProperties
            }
          >
            <Octicon icon={CircleSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-21T08:30:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed with no state reason */}
    <VariantSection label="Closed (no reason)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="done">
            <Octicon icon={CheckCircleIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this '}
            <MutedTime date={new Date('2022-07-20T10:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Reopened — open (green) badge via useIssueState (ReopenedEvent.tsx) */}
    <VariantSection label="Reopened">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('reopened', 'monalisa')}>
          <Timeline.Badge variant="open">
            <Octicon icon={IssueReopenedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'reopened this '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Transferred — github-ui's TransferredEvent renders the source repo as a
          plain inline Link (the audit shows it bold; live code is canonical). */}
    <VariantSection label="Transferred">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('transferred', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'transferred this issue from '}
            <Link href="#" inline>
              octo-org/legacy-repo
            </Link>{' '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Pinned */}
    <VariantSection label="Pinned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('pinned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PinIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'pinned this issue '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unpinned */}
    <VariantSection label="Unpinned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('unpinned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PinIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unpinned this issue '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Converted to discussion — github-ui's ConvertedToDiscussionEvent links
          the resulting discussion by number. */}
    <VariantSection label="Converted to discussion">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('converted_to_discussion', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CommentDiscussionIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'converted this issue into a discussion '}
            <BoldLink href="#">#123</BoldLink> <MutedTime date={new Date('2022-07-22T14:20:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Converted from draft */}
    <VariantSection label="Converted from draft">
      <Timeline aria-label="Issue timeline">
        {/* Untagged: a metadata/auditOnly event that ISSUE_TAXONOMY does not yet enumerate as a distinct leaf (candidate leaf to add in a follow-up, not a defect). Emitting a data-event-type without a real catalog leaf would break the taxonomy single source of truth. */}
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={IssueDraftIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'converted this from a draft issue '}
            <MutedTime date={new Date('2022-07-21T08:30:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Linked pull request — ConnectedEvent.tsx (CrossReferenceIcon badge,
          open PR state icon inline before the PR title). */}
    <VariantSection label="Linked pull request">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('connected', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CrossReferenceIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'linked a pull request that will close this issue '}
            <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
            <BoldLink href="#">Add retry logic to the uploader</BoldLink>
            <span className={classes.IssueLinkNumber}>#42</span>{' '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unlinked pull request — DisconnectedEvent.tsx uses the PR state icon AS
          the badge icon (leadingIcon={PullStateIcon}), so the badge octicon is
          green (open) on a default badge. Verified the live render path is
          active (in TIMELINE_ITEMS[__typename], current useIssueState hook,
          story fixture is an OPEN PR) — the Figma audit's gray cross-reference
          icon is behind the live code here. */}
    <VariantSection label="Unlinked pull request">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('disconnected', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={GitPullRequestIcon} className={classes.BadgeIconOpen} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed a link to a pull request '}
            <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrStateIcon} aria-label="Open" />
            <BoldLink href="#">Add retry logic to the uploader</BoldLink>
            <span className={classes.IssueLinkNumber}>#42</span>{' '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Single commit reference — ReferencedEvent.tsx. The timestamp renders
          inline (showAgoTimestamp={false}) and the commit card is sub-content. */}
    <VariantSection label="Single commit reference">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('referenced', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added a commit that references this issue '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
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
    </VariantSection>

    {/* Multiple commit references — same event, pluralized copy + N cards. */}
    <VariantSection label="Multiple commit references">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('referenced', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={GitCommitIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added 3 commits that reference this issue '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
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
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Marked this as a duplicate of <canonical>. Right-controls "Undo" button
          (viewerCanUndo) → Timeline.Actions. The canonical issue is open, so its
          IssueLink uses the open (green) state icon. */}
    <VariantSection label="Marked as duplicate">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('marked_as_duplicate', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'marked this as a duplicate of '}
            <Link href="#" className={classes.IssueLink}>
              <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
              <span className={classes.IssueLinkTitle}>Upload fails on large avatars</span>{' '}
              <span className={classes.IssueLinkNumber}>#42</span>
            </Link>{' '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small">Undo</Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Marked <canonical> as a duplicate of this issue — no right controls. */}
    <VariantSection label="Marked as canonical">
      <Timeline aria-label="Issue timeline">
        {/* Untagged: a metadata/auditOnly event that ISSUE_TAXONOMY does not yet enumerate as a distinct leaf (the catalog has only 'marked_as_duplicate'); candidate leaf to add in a follow-up, not a defect. */}
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'marked '}
            <Link href="#" className={classes.IssueLink}>
              <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
              <span className={classes.IssueLinkTitle}>Retry uploads on transient errors</span>{' '}
              <span className={classes.IssueLinkNumber}>#43</span>
            </Link>
            {' as a duplicate of this issue '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unmarked this as a duplicate of <canonical>. */}
    <VariantSection label="Unmarked as duplicate">
      <Timeline aria-label="Issue timeline">
        {/* Untagged: a metadata/auditOnly event that ISSUE_TAXONOMY does not yet enumerate as a distinct leaf (the catalog has only 'marked_as_duplicate'); candidate leaf to add in a follow-up, not a defect. */}
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unmarked this as a duplicate of '}
            <Link href="#" className={classes.IssueLink}>
              <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
              <span className={classes.IssueLinkTitle}>Upload fails on large avatars</span>{' '}
              <span className={classes.IssueLinkNumber}>#42</span>
            </Link>{' '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unmarked <canonical> as a duplicate of this issue. */}
    <VariantSection label="Unmarked as canonical">
      <Timeline aria-label="Issue timeline">
        {/* Untagged: a metadata/auditOnly event that ISSUE_TAXONOMY does not yet enumerate as a distinct leaf (the catalog has only 'marked_as_duplicate'); candidate leaf to add in a follow-up, not a defect. */}
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={DuplicateIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unmarked '}
            <Link href="#" className={classes.IssueLink}>
              <Octicon icon={IssueOpenedIcon} size={16} className={classes.IssueLinkIconOpen} />
              <span className={classes.IssueLinkTitle}>Retry uploads on transient errors</span>{' '}
              <span className={classes.IssueLinkNumber}>#43</span>
            </Link>
            {' as a duplicate of this issue '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Moderation event group (audit § 7).
 *
 * Blocks use a default `BlockedIcon` badge; comment pin/unpin use `PinIcon`.
 * github-ui's UserBlockedEvent renders the blocked user as a bold profile link
 * (no avatar) via `ProfileReference`.
 */
export const EventModeration = () => (
  <Examples>
    {/* User blocked (permanent) */}
    <VariantSection label="User blocked">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('user_blocked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'blocked '}
            <BoldLink href="#">six7</BoldLink> <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* User temporarily blocked */}
    <VariantSection label="User temporarily blocked">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('user_blocked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'temporarily blocked '}
            <BoldLink href="#">six7</BoldLink> <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Comment pinned — IssueCommentPinnedEvent.tsx links the pinned comment. */}
    <VariantSection label="Comment pinned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('comment_pinned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PinIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'pinned a '}
            <Link href="#" inline>
              comment
            </Link>{' '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Comment unpinned */}
    <VariantSection label="Comment unpinned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('comment_unpinned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PinIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unpinned a '}
            <Link href="#" inline>
              comment
            </Link>{' '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Type added */}
    <VariantSection label="Issue type added">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('issue_type_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueOpenedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Type removed */}
    <VariantSection label="Issue type removed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('issue_type_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueOpenedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Type changed */}
    <VariantSection label="Issue type changed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('issue_type_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueOpenedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Sub-issue added (single) */}
    <VariantSection label="Sub-issue added (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('sub_issue_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added a sub-issue '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
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
    </VariantSection>

    {/* Sub-issue added (multiple) — plural copy + N reference rows */}
    <VariantSection label="Sub-issues added (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('sub_issue_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added sub-issues '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
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
    </VariantSection>

    {/* Sub-issue removed (single) */}
    <VariantSection label="Sub-issue removed (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('sub_issue_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed a sub-issue '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
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
    </VariantSection>

    {/* Sub-issues removed (multiple) */}
    <VariantSection label="Sub-issues removed (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('sub_issue_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTracksIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed sub-issues '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
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
    </VariantSection>

    {/* Parent issue added (single) */}
    <VariantSection label="Parent issue added (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('parent_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added a parent issue '}
            <MutedTime date={new Date('2022-07-22T14:20:00Z')} href="#" />
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
    </VariantSection>

    {/* Parent issues added (multiple) */}
    <VariantSection label="Parent issues added (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('parent_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added parent issues '}
            <MutedTime date={new Date('2022-07-21T08:30:00Z')} href="#" />
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
    </VariantSection>

    {/* Parent issue removed (single) */}
    <VariantSection label="Parent issue removed (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('parent_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed a parent issue '}
            <MutedTime date={new Date('2022-07-20T10:00:00Z')} href="#" />
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
    </VariantSection>

    {/* Parent issues removed (multiple) */}
    <VariantSection label="Parent issues removed (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('parent_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={IssueTrackedByIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed parent issues '}
            <MutedTime date={new Date('2022-07-19T13:15:00Z')} href="#" />
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
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Blocked by (single) */}
    <VariantSection label="Blocked by (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocked_by_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'marked this as blocked '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
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
    </VariantSection>

    {/* Blocked by (multiple) — count in copy + N rows */}
    <VariantSection label="Blocked by (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocked_by_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'marked this as blocked by 2 issues '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
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
    </VariantSection>

    {/* Blocked by removed (single) */}
    <VariantSection label="Blocked by removed (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocked_by_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unmarked this as blocked '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
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
    </VariantSection>

    {/* Blocked by removed (multiple) */}
    <VariantSection label="Blocked by removed (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocked_by_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unmarked this as blocked by 2 issues '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
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
    </VariantSection>

    {/* Blocking (single) */}
    <VariantSection label="Blocking (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocking_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'marked this as blocking '}
            <MutedTime date={new Date('2022-07-22T14:20:00Z')} href="#" />
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
    </VariantSection>

    {/* Blocking (multiple) */}
    <VariantSection label="Blocking (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocking_added', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'marked this as blocking 2 issues '}
            <MutedTime date={new Date('2022-07-21T08:30:00Z')} href="#" />
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
    </VariantSection>

    {/* Blocking removed (single) */}
    <VariantSection label="Blocking removed (single)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocking_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unmarked this as blocking '}
            <MutedTime date={new Date('2022-07-20T10:00:00Z')} href="#" />
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
    </VariantSection>

    {/* Blocking removed (multiple) */}
    <VariantSection label="Blocking removed (multiple)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('blocking_removed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={BlockedIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unmarked this as blocking 2 issues '}
            <MutedTime date={new Date('2022-07-19T13:15:00Z')} href="#" />
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
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Set text field */}
    <VariantSection label="Set · text">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'set '}
            <span className={classes.FieldName}>Team</span>
            {' to '}
            <Link href="#" inline className={classes.FieldValue}>
              Identity
            </Link>{' '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Set number field */}
    <VariantSection label="Set · number">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={NumberIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'set '}
            <span className={classes.FieldName}>Story Points</span>
            {' to '}
            <Link href="#" inline className={classes.FieldValue}>
              5
            </Link>{' '}
            <MutedTime date={new Date('2022-07-25T15:30:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Set date field */}
    <VariantSection label="Set · date">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CalendarIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'set '}
            <span className={classes.FieldName}>Target Date</span>
            {' to '}
            <Link href="#" inline className={classes.FieldValue}>
              Aug 1, 2022
            </Link>{' '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Set single-select field — value is a colored token */}
    <VariantSection label="Set · single select">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={SingleSelectIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Changed text field */}
    <VariantSection label="Changed · text">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'changed '}
            <span className={classes.FieldName}>Team</span>
            {' to '}
            <Link href="#" inline className={classes.FieldValue}>
              Platform
            </Link>{' '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Changed number field */}
    <VariantSection label="Changed · number">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={NumberIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'changed '}
            <span className={classes.FieldName}>Story Points</span>
            {' to '}
            <Link href="#" inline className={classes.FieldValue}>
              8
            </Link>{' '}
            <MutedTime date={new Date('2022-07-22T14:20:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Changed date field */}
    <VariantSection label="Changed · date">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CalendarIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'changed '}
            <span className={classes.FieldName}>Target Date</span>
            {' to '}
            <Link href="#" inline className={classes.FieldValue}>
              Aug 15, 2022
            </Link>{' '}
            <MutedTime date={new Date('2022-07-21T08:30:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Changed single-select field */}
    <VariantSection label="Changed · single select">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={SingleSelectIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-20T10:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Cleared text field — no value */}
    <VariantSection label="Cleared · text">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'cleared '}
            <span className={classes.FieldName}>Team</span>{' '}
            <MutedTime date={new Date('2022-07-19T13:15:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Cleared number field */}
    <VariantSection label="Cleared · number">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={NumberIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'cleared '}
            <span className={classes.FieldName}>Story Points</span>{' '}
            <MutedTime date={new Date('2022-07-18T09:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Cleared date field */}
    <VariantSection label="Cleared · date">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CalendarIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'cleared '}
            <span className={classes.FieldName}>Target Date</span>{' '}
            <MutedTime date={new Date('2022-07-17T12:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Cleared single-select field */}
    <VariantSection label="Cleared · single select">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={SingleSelectIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'cleared '}
            <span className={classes.FieldName}>Priority</span>{' '}
            <MutedTime date={new Date('2022-07-16T08:30:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Rollup: updated only — multiple field updates collapsed into one row */}
    <VariantSection label="Rollup · updated">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-15T10:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Rollup: removed only */}
    <VariantSection label="Rollup · removed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed '}
            <span className={classes.FieldName}>Team</span>
            {' and '}
            <span className={classes.FieldName}>Priority</span>{' '}
            <MutedTime date={new Date('2022-07-14T10:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Rollup: updated and also removed — combined row joined by "and also" */}
    <VariantSection label="Rollup · updated and removed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TypographyIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'updated '}
            <span className={classes.FieldName}>Team</span>
            <Link href="#" inline className={classes.FieldValue}>
              Platform
            </Link>
            {', and also removed '}
            <span className={classes.FieldName}>Priority</span>{' '}
            <MutedTime date={new Date('2022-07-13T10:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Added to project */}
    <VariantSection label="Added to project">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('added_to_project', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TableIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added this to '}
            {/* Issue-version ProjectV2 reference (github-ui `ProjectV2.tsx`). */}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Removed from project */}
    <VariantSection label="Removed from project">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('removed_from_project', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TableIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed this from '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Project status changed. Two forms per live
        `ProjectV2ItemStatusChangedEvent.tsx`: with no previous status,
        "moved this to {status} in {project}"; with a previous status,
        "moved this from {previousStatus} to {status} in {project}". Status
        strings are PLAIN TEXT (not bold). Both forms shown under one caption. */}
    <VariantSection label="Project status changed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TableIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'moved this to In Progress in '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item {...issueAttrs('project_field_changed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TableIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'moved this from Todo to In Progress in '}
            <Octicon icon={TableIcon} size={16} className={classes.ProjectRefIcon} />
            <Link href="#" inline className={classes.ProjectRefLink}>
              Roadmap
            </Link>{' '}
            <MutedTime date={new Date('2022-07-24T16:42:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Label added */}
    <VariantSection label="Label added">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('labeled', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TagIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Label removed */}
    <VariantSection label="Label removed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('unlabeled', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TagIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Added + removed (rollup) — RolledupLabeledEvent joins both renderings
        with "and" between them. */}
    <VariantSection label="Labels added and removed">
      <Timeline aria-label="Issue timeline">
        {/* Untagged: a metadata/auditOnly rolled-up event (labeled + unlabeled in one row) that ISSUE_TAXONOMY does not yet enumerate as a distinct leaf; candidate leaf to add in a follow-up, not a defect. */}
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={TagIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
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
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Title changed */}
    <VariantSection label="Title changed">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('renamed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PencilIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'changed the title '}
            <del>Fix the uplaod bug</del> Fix the upload bug{' '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Added to milestone */}
    <VariantSection label="Added to milestone">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('milestoned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={MilestoneIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'added this to the '}
            <Link href="#" inline className={classes.ProjectRefLink}>
              v2.0
            </Link>
            {' milestone '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Removed from milestone */}
    <VariantSection label="Removed from milestone">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('demilestoned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={MilestoneIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed this from the '}
            <Link href="#" inline className={classes.ProjectRefLink}>
              v2.0
            </Link>
            {' milestone '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Self-assigned */}
    <VariantSection label="Self-assigned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('assigned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'self-assigned this '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Assigned someone else — assignee is a bold link, no avatar. */}
    <VariantSection label="Assigned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('assigned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'assigned '}
            <BoldLink href="#">hubot</BoldLink> <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Assigned multiple — joined with "and". */}
    <VariantSection label="Assigned multiple">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('assigned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'assigned '}
            <BoldLink href="#">hubot</BoldLink>
            {' and '}
            <BoldLink href="#">octocat</BoldLink> <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Self-unassigned */}
    <VariantSection label="Self-unassigned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('unassigned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed their assignment '}
            <MutedTime date={new Date('2022-07-23T11:05:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unassigned someone else */}
    <VariantSection label="Unassigned">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('unassigned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unassigned '}
            <BoldLink href="#">hubot</BoldLink> <MutedTime date={new Date('2022-07-22T14:20:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unassigned multiple — joined with "and". */}
    <VariantSection label="Unassigned multiple">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('unassigned', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unassigned '}
            <BoldLink href="#">hubot</BoldLink>
            {' and '}
            <BoldLink href="#">octocat</BoldLink> <MutedTime date={new Date('2022-07-21T08:30:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Locked with reason — one row per reason (off topic / resolved / spam /
        too heated). */}
    <VariantSection label="Locked (with reason)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('locked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LockIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'locked as off topic and limited conversation to collaborators '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item {...issueAttrs('locked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LockIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'locked as resolved and limited conversation to collaborators '}
            <MutedTime date={new Date('2022-07-26T11:47:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item {...issueAttrs('locked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LockIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'locked as spam and limited conversation to collaborators '}
            <MutedTime date={new Date('2022-07-26T11:48:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Item {...issueAttrs('locked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LockIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'locked as too heated and limited conversation to collaborators '}
            <MutedTime date={new Date('2022-07-26T11:49:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Locked (no reason) */}
    <VariantSection label="Locked (no reason)">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('locked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LockIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'locked and limited conversation to collaborators '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unlocked — UnlockIcon badge (not LockIcon). */}
    <VariantSection label="Unlocked">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('unlocked', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={UnlockIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unlocked this conversation '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Comment deleted */}
    <VariantSection label="Comment deleted">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('comment_deleted', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={TrashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'deleted a comment from '}
            <Link href="#" inline>
              octocat
            </Link>{' '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Mentioned from an issue */}
    <VariantSection label="Mentioned in an issue">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('cross_referenced', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'mentioned this '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
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
    </VariantSection>

    {/* Mentioned from a pull request */}
    <VariantSection label="Mentioned in a pull request">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('cross_referenced', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'mentioned this '}
            <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
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
    </VariantSection>

    {/* Linked a closing pull request */}
    <VariantSection label="Linked a closing pull request">
      <Timeline aria-label="Issue timeline">
        <Timeline.Item {...issueAttrs('cross_referenced', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={LinkExternalIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'linked a pull request that will close this issue '}
            <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
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
    </VariantSection>
  </Examples>
)
