import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
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
import BranchName from '../BranchName'
import {Button} from '../Button'
import Link from '../Link'
import Octicon from '../Octicon'
import {EventSubRow, Examples, MutedTime, UserActor, VariantSection} from './internal/timelineStoryHelpers'
import classes from './Timeline.license-compliance.features.stories.module.css'

/**
 * License Compliance alert Timeline event examples (Phase 2 of github/primer#6663).
 *
 * These stories recreate GitHub's live license-compliance-alert timeline events
 * using the Primer `Timeline` compositional slots. They mirror the established
 * Issues (`Timeline.issues.features.stories.tsx`), Dependabot
 * (`Timeline.dependabot.features.stories.tsx`) and Secret Scanning
 * (`Timeline.secret-scanning.features.stories.tsx`) stories and are sourced from
 * the `timeline-audit` inventory
 * (`license-compliance-timeline-events-for-figma.md`), verified against the live
 * React implementation.
 *
 * SOURCE OF TRUTH — License Compliance is FULLY React (NOT ERB), like Secret
 * Scanning. The alert show page is a React SPA in `github/github-ui`, package
 * `packages/license-compliance-alerts/`. The timeline is rendered by
 * `components/timeline/AlertTimeline.tsx`, which maps each event through
 * `components/timeline/TimelineEventItem.tsx`, whose `switch (event.type)` is
 * the authoritative dispatch. The actual badge variant + octicon + copy for each
 * event live in the per-event components under `components/timeline/events/`,
 * which compose Primer React `Timeline` + `Timeline.Badge variant=` via two
 * shared wrappers in `events/shared.tsx`:
 * - `TimelineEventWithActor` — renders the event `actor` INLINE (a 20px circle
 *   `GitHubAvatar` + login), then the muted action verb + `RelativeTime`.
 * - `TimelineEventWithoutActor` — no actor; muted action verb + `RelativeTime`
 *   only (used by the synthetic `appeared_in_branch` event).
 *
 * The authoritative `switch (event.type)` dispatches NINE event types
 * (`types/alerts.ts` `AlertEventType`): `opened`, `appeared_in_branch`,
 * `review_requested`, `review_denied`, `review_approved`, `review_expired`,
 * `exception_added`, `licenses_added`, `closed`. `opened` and
 * `appeared_in_branch` are SYNTHETIC events created by Rails. The `default` case
 * renders `null` (unknown types render nothing).
 *
 * NO SYSTEM "GitHub" ACTOR ON THIS SURFACE: unlike the secret-scanning timeline
 * (which has a `MarkGithubIcon` + "GitHub" system actor for its Created event),
 * EVERY license-compliance actor event flows through `TimelineEventWithActor`,
 * which renders a user/bot actor — never a `MarkGithubIcon` system label. So
 * this file intentionally does NOT define a `GitHubActor` helper.
 *
 * SCOPE: These are Storybook-only examples by design. They are intentionally
 * NOT wired into components-json / the primer.style docs page (do NOT add this
 * file to `Timeline.docs.json` or `build.ts`). Individual timeline events are
 * not consumer-facing components — the primer.style Timeline page reflects the
 * base `Timeline` component's own stories, and any docs-site representation is a
 * Phase 3 consideration via base-component story changes, out of scope here.
 *
 * FUTURE FILTERING (taxonomy still open — github/primer#6663): category
 * `data-*` attributes (e.g. `data-event-category="created"`) will attach to each
 * `Timeline.Item` below so stories can be filtered/grouped by event family. We
 * intentionally do NOT add them yet to avoid baking in a taxonomy.
 *
 * PROOF-OF-PATTERN HISTORY: this file landed first as an `opened`-only
 * scaffold to validate the template, then grew to the full nine-group set. All
 * groups are verified against the live per-event components in
 * `events/` and, for the two synthetic events, against the Rails controller
 * `app/controllers/repos/license_compliance_alerts_controller.rb` (the synthetic
 * `opened` / `appeared_in_branch` builder).
 *
 * DORMANT CODE (verified, intentionally NOT built): `AppearedInBranchEvent`
 * renders a `PullRequestLink` sub-row whenever its event body carries
 * `pull_request_number` / `pull_request_title`, but the Rails
 * `create_synthetic_branch_event` only ever writes `{branch_name}` — it never
 * populates those PR fields (PR enrichment is applied ONLY to
 * `review_requested`). So that sub-row is dead in production; we build only the
 * branch-name variant. Likewise `review_expired` uses `TimelineEventWithActor`
 * but expiry is automatic and Rails attaches no actor, so it renders actor-less
 * (its copy "Request to close expired" is a standalone capitalized sentence).
 *
 * BADGE COLORS (live per-event components): success (green) `ShieldIcon` —
 * `opened`; done (purple) `ShieldCheckIcon` — `closed`. Every other group
 * renders a gray DEFAULT badge (`badgeVariant` undefined → `<Timeline.Badge>`
 * with a muted icon, no solid fill). We render those bare, matching the
 * secret-scanning / Dependabot convention (NOT the Issues
 * `--timelineBadge-bgColor` hook).
 *
 * ACCESSIBILITY NOTE: the only in-text `<Link>` on this surface is the actor
 * link (rendered when `actor.url` is present). Live `shared.tsx` styles it
 * SEMIBOLD + default foreground color (`actorLink`); the bold weight keeps it
 * distinguishable from the surrounding muted text without relying on color, so
 * it satisfies the axe `link-in-text-block` high-contrast rule. Any future
 * in-text link added here must likewise be `inline` (underline) or bold.
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/hubot'
// The license-compliance system bot — Rails attributes every system event
// (Opened, Review-expired) to `github-license-compliance[bot]` when user_id<=0.
const LICENSE_BOT_AVATAR = 'https://avatars.githubusercontent.com/u/9919?s=40&v=4'

/**
 * PR link sub-row — live `PullRequestLink` (`events/shared.tsx`): a 16px
 * success-green `GitPullRequestIcon` + an `f6` `<Link>` reading `{title}
 * #{number}`. Only the `review_requested` event renders this (the Rails
 * controller enriches that event with `pull_request_number` / `_title` when the
 * alert has an associated PR). The link is `inline` (underlined) here to satisfy
 * the axe `link-in-text-block` rule — live uses a color-only `defaultColorLink`
 * (an a11y debt we correct in the story).
 */
const PullRequestLink = ({number, title}: {number: number; title: string}) => (
  <span className={classes.PrRow}>
    <Octicon icon={GitPullRequestIcon} size={16} className={classes.PrIcon} />
    <Link href={`../../pull/${number}`} inline className={classes.SubRowLink}>
      {title} #{number}
    </Link>
  </span>
)

/**
 * Inline "license policy" link — live `ExceptionAddedEvent` / `LicensesAddedEvent`
 * embed a `<Link>` reading "license policy" inside the action sentence. Rendered
 * `inline` (underlined) here to satisfy the axe `link-in-text-block` rule (live
 * uses a color-only `defaultColorLink`).
 */
const PolicyLink = ({href = '../../settings/security_analysis'}: {href?: string}) => (
  <Link href={href} inline>
    license policy
  </Link>
)

export default {
  title: 'Components/Timeline/Events/License Compliance',
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
 * The Opened event group — `AlertEventType.Opened` (audit § 1).
 *
 * Source: `case AlertEventType.Opened` in `TimelineEventItem.tsx`, rendered by
 * `events/OpenedEvent.tsx`:
 *   `<TimelineEventWithActor icon={<ShieldIcon size={16} />}
 *     actionText="opened this alert" badgeVariant="success" />`
 * Badge: `ShieldIcon` on `success` (green). Copy is a fixed `"opened this
 * alert"` + the relative time. This is a SYNTHETIC event created by Rails, but
 * it still carries an `actor` (enriched by the Rails controller).
 *
 * ACTOR (security UNCERTAIN deep-dive resolved): the synthetic `opened` event is
 * ALWAYS attributed to the license-compliance system bot,
 * `github-license-compliance[bot]` (Rails `create_synthetic_opened_event`). Per
 * live `shared.tsx`, a login ending in `[bot]` renders avatar + bold display
 * login ("github-license-compliance") + a secondary "bot" Label — NOT a Link.
 * There is no human "opened" actor, so a single bot variant is shown.
 */
export const EventOpened = () => (
  <Examples>
    {/* Opened — license-compliance system bot, ShieldIcon on success (green) */}
    <VariantSection label="Opened">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="github-license-compliance[bot]" src={LICENSE_BOT_AVATAR} />{' '}
            <span className={classes.ActionText}>opened this alert</span>{' '}
            <MutedTime date={new Date('2025-10-20T10:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Appeared-in-branch event group — `AlertEventType.AppearedInBranch`
 * (audit § 2).
 *
 * Source: `case AlertEventType.AppearedInBranch` → `events/AppearedInBranchEvent.tsx`,
 * which uses `TimelineEventWithoutActor` (NO actor): `GitBranchIcon size={16}`
 * on the default (gray) badge, copy "Appeared in branch", followed by a
 * `BranchName` pill linking to the branch tree. This is a SYNTHETIC event.
 *
 * The component ALSO renders a `PullRequestLink` sub-row when its body has
 * `pull_request_number` / `pull_request_title` — but per the Rails
 * `create_synthetic_branch_event`, those fields are NEVER written for this event
 * (only `{branch_name}`), so that sub-row is DORMANT and intentionally not built
 * here. Single variant: the branch-name pill.
 */
export const EventAppearedInBranch = () => (
  <Examples>
    {/* Appeared in branch — actor-less, GitBranchIcon on the default (gray)
        badge, with a BranchName pill. PR sub-row is dormant (see group doc). */}
    <VariantSection label="Appeared in branch">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitBranchIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.ActionText}>Appeared in branch</span>{' '}
            <BranchName href="../../tree/feature-branch">feature-branch</BranchName>{' '}
            <MutedTime date={new Date('2025-10-20T10:01:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Review-requested event group — `AlertEventType.ReviewRequested`
 * (audit § 3).
 *
 * Source: `events/ReviewRequestedEvent.tsx` (`TimelineEventWithActor`):
 * `CommentIcon size={16}` on the default (gray) badge. Copy is "requested to
 * close" or, when the event body carries a `closure_reason`, "requested to close
 * as {reason}". An optional note sub-row (shared `EventSubRow`) renders the requester's
 * comment. When the alert has an associated PR, the Rails controller enriches
 * this event with `pull_request_number` / `_title`, so a `PullRequestLink`
 * sub-row appears AND — for the latest review_requested event only — a primary
 * "Review request" button. Live nests that button beside the PR link in a
 * space-between Stack; we surface it via the `Timeline.Actions` right-controls
 * slot (the established template convention).
 *
 * NOTE: the `closure_reason` text shown after "requested to close as …" is
 * produced by the Go OLC service, not the local Rails/React code — its exact
 * format (e.g. "amendment"-style label vs raw value) is unverified here. Confirm
 * via a prod smoke-test; the example label below is illustrative.
 */
export const EventReviewRequested = () => (
  <Examples>
    {/* Requested to close — no reason, no PR, no comment */}
    <VariantSection label="Requested to close">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>requested to close</span>{' '}
            <MutedTime date={new Date('2025-10-21T09:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Requested to close as {reason}, with a requester comment sub-row */}
    <VariantSection label="Requested to close as a specific reason (with comment)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>requested to close as used in tests</span>{' '}
            <MutedTime date={new Date('2025-10-21T09:05:00Z')} />
            <EventSubRow icon={NoteIcon}>This dependency is only pulled in by our test harness.</EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Requested to close with an associated PR — PR link sub-row + the primary
        "Review request" button (latest request only) in Timeline.Actions. */}
    <VariantSection label="Requested to close with a pull request (latest — shows Review request)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>requested to close</span>{' '}
            <MutedTime date={new Date('2025-10-21T09:10:00Z')} />
            <PullRequestLink number={42} title="Replace GPL dependency" />
          </Timeline.Body>
          <Timeline.Actions>
            <Button variant="primary" size="small">
              Review request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Review-approved event group — `AlertEventType.ReviewApproved`
 * (audit § 4).
 *
 * Source: `events/ReviewApprovedEvent.tsx` (`TimelineEventWithActor`):
 * `CheckIcon size={16}` on the default (gray) badge, copy "approved closure
 * request", with an optional note sub-row (shared `EventSubRow`).
 */
export const EventReviewApproved = () => (
  <Examples>
    {/* Approved closure request */}
    <VariantSection label="Approved closure request">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} href="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>approved closure request</span>{' '}
            <MutedTime date={new Date('2025-10-22T10:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Approved closure request — with reviewer comment */}
    <VariantSection label="Approved closure request (with comment)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} href="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>approved closure request</span>{' '}
            <MutedTime date={new Date('2025-10-22T10:05:00Z')} />
            <EventSubRow icon={NoteIcon}>Agreed — test-only usage is within policy.</EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Review-denied event group — `AlertEventType.ReviewDenied` (audit § 5).
 *
 * Source: `events/ReviewDeniedEvent.tsx` (`TimelineEventWithActor`):
 * `XIcon size={16}` on the default (gray) badge, copy "denied closure request",
 * with an optional note sub-row (shared `EventSubRow`).
 */
export const EventReviewDenied = () => (
  <Examples>
    {/* Denied closure request */}
    <VariantSection label="Denied closure request">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} href="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>denied closure request</span>{' '}
            <MutedTime date={new Date('2025-10-22T11:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Denied closure request — with reviewer comment */}
    <VariantSection label="Denied closure request (with comment)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} href="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>denied closure request</span>{' '}
            <MutedTime date={new Date('2025-10-22T11:05:00Z')} />
            <EventSubRow icon={NoteIcon}>
              This package is distributed to customers, so the license still applies.
            </EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Review-expired event group — `AlertEventType.ReviewExpired` (audit § 6).
 *
 * Source: `events/ReviewExpiredEvent.tsx` (`TimelineEventWithActor`):
 * `CircleSlashIcon size={16}` on the default (gray) badge, copy "Request to close
 * expired". Although a misleading test mock omits the actor, Rails sets the
 * license-compliance system bot for these system events (`user_id<=0`), so it
 * renders WITH the bot actor. No comment sub-row. Single variant.
 */
export const EventReviewExpired = () => (
  <Examples>
    {/* Request to close expired — license-compliance system bot, automatic expiry */}
    <VariantSection label="Request to close expired">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CircleSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="github-license-compliance[bot]" src={LICENSE_BOT_AVATAR} />{' '}
            <span className={classes.ActionText}>Request to close expired</span>{' '}
            <MutedTime date={new Date('2025-10-23T10:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Exception-added event group — `AlertEventType.ExceptionAdded`
 * (audit § 7).
 *
 * Source: `events/ExceptionAddedEvent.tsx` (`TimelineEventWithActor`):
 * `LawIcon size={16}` on the default (gray) badge. When the body has
 * `package_manager` + `package_name`, the copy is "added {pm}/{pkg}" + (when a
 * policy path is known) " to {license policy link}" + (when a repo name is
 * known) " for {repo}". Otherwise it falls back to "created exception".
 */
export const EventExceptionAdded = () => (
  <Examples>
    {/* Full shape — package + policy link + repo name */}
    <VariantSection label="Added a package exception to the license policy">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>
              added npm/left-pad to <PolicyLink /> for monalisa/octo-app
            </span>{' '}
            <MutedTime date={new Date('2025-10-23T12:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Fallback shape — body missing package info */}
    <VariantSection label="Created exception (fallback)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>created exception</span>{' '}
            <MutedTime date={new Date('2025-10-23T12:05:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Licenses-added event group — `AlertEventType.LicensesAdded` (audit § 8).
 *
 * Source: `events/LicensesAddedEvent.tsx` (`TimelineEventWithActor`):
 * `LawIcon size={16}` on the default (gray) badge. When the body has a
 * `licenses` array, the copy is "added {licenses joined by ', '}" + (when a
 * policy path is known) " to {license policy link}" + (when a repo name is
 * known) " for {repo}". Otherwise it falls back to "added to approved licenses".
 */
export const EventLicensesAdded = () => (
  <Examples>
    {/* Full shape — licenses list + policy link + repo name */}
    <VariantSection label="Added licenses to the license policy">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>
              added MIT, Apache-2.0 to <PolicyLink /> for monalisa/octo-app
            </span>{' '}
            <MutedTime date={new Date('2025-10-24T12:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Fallback shape — body missing licenses array */}
    <VariantSection label="Added to approved licenses (fallback)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>added to approved licenses</span>{' '}
            <MutedTime date={new Date('2025-10-24T12:05:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Closed event group — `AlertEventType.Closed` (audit § 9).
 *
 * Source: `events/ClosedEvent.tsx` (`TimelineEventWithActor`): `ShieldCheckIcon
 * size={16}` on the `done` (PURPLE) badge — the only colored gray-exempt event
 * besides Opened. The copy comes from `getClosedActionText(closureReason,
 * resolution)`. When a free-text `closureReason` is present it renders "closed as
 * {reason}"; the live label set is `CLOSURE_REASON_TO_LABEL`
 * (`license_compliance_dismissal_options.rb`): amendment, private package,
 * inaccurate license, policy edited, fixed. The two resolution-driven fallbacks
 * are "closed as outdated" (resolution `Outdated`) and "closed this alert"
 * (default). An optional note sub-row (shared `EventSubRow`) renders a closing comment.
 */
export const EventClosed = () => (
  <Examples>
    {/* Closed as amendment — with a closing comment */}
    <VariantSection label="Closed as amendment (with comment)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as amendment</span>{' '}
            <MutedTime date={new Date('2025-10-25T10:00:00Z')} />
            <EventSubRow icon={NoteIcon}>Added a policy exception covering this package.</EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as private package */}
    <VariantSection label="Closed as private package">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as private package</span>{' '}
            <MutedTime date={new Date('2025-10-25T10:05:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as inaccurate license */}
    <VariantSection label="Closed as inaccurate license">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as inaccurate license</span>{' '}
            <MutedTime date={new Date('2025-10-25T10:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as policy edited */}
    <VariantSection label="Closed as policy edited">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as policy edited</span>{' '}
            <MutedTime date={new Date('2025-10-25T10:15:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as fixed */}
    <VariantSection label="Closed as fixed">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as fixed</span>{' '}
            <MutedTime date={new Date('2025-10-25T10:20:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as outdated — resolution Outdated */}
    <VariantSection label="Closed as outdated">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as outdated</span>{' '}
            <MutedTime date={new Date('2025-10-25T10:25:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed this alert — default (no reason / resolution) */}
    <VariantSection label="Closed this alert (default)">
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} href="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed this alert</span>{' '}
            <MutedTime date={new Date('2025-10-25T10:30:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)
