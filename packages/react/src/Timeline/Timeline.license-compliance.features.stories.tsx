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
import type React from 'react'
import Avatar from '../Avatar'
import BranchName from '../BranchName'
import {Button} from '../Button'
import Label from '../Label'
import Link from '../Link'
import Octicon from '../Octicon'
import RelativeTime from '../RelativeTime'
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
const DEPENDABOT_AVATAR = 'https://avatars.githubusercontent.com/in/29110?v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/hubot'

/**
 * User actor — live `TimelineEventWithActor` (`events/shared.tsx`). Renders a
 * 20px CIRCLE `GitHubAvatar` followed by the login. Three shapes, all reproduced
 * here so every future group can reuse this helper:
 * - `url` present → a `<Link>` wrapping avatar + login, forced semibold +
 *   default color (`actorLink`); bold weight satisfies `link-in-text-block`.
 * - no `url` → avatar + bold login text (`<strong className="ml-1">`).
 * - `bot` (live: `login.endsWith('[bot]')`) → avatar + bold display login (the
 *   `[bot]` suffix stripped) + a secondary "bot" `Label`.
 */
const UserActor = ({
  login = 'monalisa',
  src = MONALISA_AVATAR,
  url,
  bot = false,
}: {
  login?: string
  src?: string
  url?: string
  bot?: boolean
}) => {
  const avatar = <Avatar src={src} size={20} alt="" className={classes.InlineAvatar} />
  if (bot) {
    return (
      <span className={classes.ActorLink}>
        {avatar}
        <span className={classes.ActorName}>{login}</span>
        <Label variant="secondary" className={classes.BotLabel}>
          bot
        </Label>
      </span>
    )
  }
  if (url) {
    return (
      <Link href={url} className={classes.ActorLink}>
        {avatar}
        {login}
      </Link>
    )
  }
  return (
    <span className={classes.ActorLink}>
      {avatar}
      <span className={classes.ActorName}>{login}</span>
    </span>
  )
}

// Muted relative timestamp. Live `shared.tsx` renders a plain `RelativeTime`
// with no link wrapper — muted text only (matching the secret-scanning and
// Dependabot timelines, unlike the Issues `Ago` deep-link).
const Time = ({date}: {date: string}) => (
  <span className={classes.Timestamp}>
    <RelativeTime date={new Date(date)} format="relative" />
  </span>
)

/**
 * Optional comment sub-row — live `EventComment` (`events/shared.tsx`) renders a
 * `<Stack direction="horizontal" gap="condensed" className="mt-1">` containing a
 * 16px muted `NoteIcon` + an `f6` muted comment span. Shared by the review
 * request / approve / deny events and the closed event. (Note this surface uses
 * `NoteIcon`, NOT the secret-scanning `CommentIcon`.)
 */
const EventComment = ({children}: {children: React.ReactNode}) => (
  <div className={classes.CommentRow}>
    <Octicon icon={NoteIcon} size={16} className={classes.CommentRowIcon} />
    <span>{children}</span>
  </div>
)

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
 * ACTOR (audit UNCERTAIN resolved): the Opened event is NOT attributed to a
 * GitHub-system actor. `OpenedEvent` uses `TimelineEventWithActor`, so the actor
 * is whatever user/bot Rails enriched onto the event — rendered as a 20px avatar
 * + login (a `<Link>` when `actor.url` is present, otherwise bold text; bots get
 * a "bot" Label). Both shapes are shown below.
 *
 * The live `OpenedEvent` has exactly one rendering shape (no source / from-PR /
 * from-push branches); the two variants here differ ONLY by actor type to
 * document the resolved actor question.
 */
export const EventOpened = () => (
  <div className={classes.RealisticTimeline}>
    {/* Opened by a user — linked actor (20px avatar + semibold login), ShieldIcon
        on success (green). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Opened by a user</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} aria-label="Opened" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>opened this alert</span> <Time date="2025-10-20T10:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Opened by a bot — automated dependency detection. Live `shared.tsx`
        strips the `[bot]` suffix from the login and appends a secondary "bot"
        Label. Same success badge + copy. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Opened by a bot</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} aria-label="Opened" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="dependabot" src={DEPENDABOT_AVATAR} bot />{' '}
            <span className={classes.ActionText}>opened this alert</span> <Time date="2025-10-20T09:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
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
  <div className={classes.RealisticTimeline}>
    {/* Appeared in branch — actor-less, GitBranchIcon on the default (gray)
        badge, with a BranchName pill. PR sub-row is dormant (see group doc). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Appeared in branch</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitBranchIcon} aria-label="Appeared in branch" />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.ActionText}>Appeared in branch</span>{' '}
            <BranchName href="../../tree/feature-branch">feature-branch</BranchName>{' '}
            <Time date="2025-10-20T10:01:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Review-requested event group — `AlertEventType.ReviewRequested`
 * (audit § 3).
 *
 * Source: `events/ReviewRequestedEvent.tsx` (`TimelineEventWithActor`):
 * `CommentIcon size={16}` on the default (gray) badge. Copy is "requested to
 * close" or, when the event body carries a `closure_reason`, "requested to close
 * as {reason}". An optional `EventComment` sub-row renders the requester's
 * comment. When the alert has an associated PR, the Rails controller enriches
 * this event with `pull_request_number` / `_title`, so a `PullRequestLink`
 * sub-row appears AND — for the latest review_requested event only — a primary
 * "Review request" button. Live nests that button beside the PR link in a
 * space-between Stack; we surface it via the `Timeline.Actions` right-controls
 * slot (the established template convention).
 */
export const EventReviewRequested = () => (
  <div className={classes.RealisticTimeline}>
    {/* Requested to close — no reason, no PR, no comment */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Requested to close</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} aria-label="Requested to close" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>requested to close</span> <Time date="2025-10-21T09:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Requested to close as {reason}, with a requester comment sub-row */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Requested to close as a specific reason (with comment)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} aria-label="Requested to close" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>requested to close as used in tests</span>{' '}
            <Time date="2025-10-21T09:05:00Z" />
            <EventComment>This dependency is only pulled in by our test harness.</EventComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Requested to close with an associated PR — PR link sub-row + the primary
        "Review request" button (latest request only) in Timeline.Actions. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Requested to close with a pull request (latest — shows Review request)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} aria-label="Requested to close" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>requested to close</span> <Time date="2025-10-21T09:10:00Z" />
            <PullRequestLink number={42} title="Replace GPL dependency" />
          </Timeline.Body>
          <Timeline.Actions>
            <Button variant="primary" size="small">
              Review request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Review-approved event group — `AlertEventType.ReviewApproved`
 * (audit § 4).
 *
 * Source: `events/ReviewApprovedEvent.tsx` (`TimelineEventWithActor`):
 * `CheckIcon size={16}` on the default (gray) badge, copy "approved closure
 * request", with an optional `EventComment` sub-row.
 */
export const EventReviewApproved = () => (
  <div className={classes.RealisticTimeline}>
    {/* Approved closure request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Approved closure request</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} aria-label="Approved closure request" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} url="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>approved closure request</span> <Time date="2025-10-22T10:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Approved closure request — with reviewer comment */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Approved closure request (with comment)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} aria-label="Approved closure request" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} url="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>approved closure request</span> <Time date="2025-10-22T10:05:00Z" />
            <EventComment>Agreed — test-only usage is within policy.</EventComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Review-denied event group — `AlertEventType.ReviewDenied` (audit § 5).
 *
 * Source: `events/ReviewDeniedEvent.tsx` (`TimelineEventWithActor`):
 * `XIcon size={16}` on the default (gray) badge, copy "denied closure request",
 * with an optional `EventComment` sub-row.
 */
export const EventReviewDenied = () => (
  <div className={classes.RealisticTimeline}>
    {/* Denied closure request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Denied closure request</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} aria-label="Denied closure request" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} url="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>denied closure request</span> <Time date="2025-10-22T11:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Denied closure request — with reviewer comment */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Denied closure request (with comment)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} aria-label="Denied closure request" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} url="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>denied closure request</span> <Time date="2025-10-22T11:05:00Z" />
            <EventComment>This package is distributed to customers, so the license still applies.</EventComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Review-expired event group — `AlertEventType.ReviewExpired` (audit § 6).
 *
 * Source: `events/ReviewExpiredEvent.tsx`. Although it uses
 * `TimelineEventWithActor`, expiry is automatic and Rails attaches no actor, so
 * it renders ACTOR-LESS (verified: the `review_expired` test fixture has no
 * actor, and the copy "Request to close expired" is a standalone capitalized
 * sentence). `CircleSlashIcon size={16}` on the default (gray) badge. No comment
 * sub-row. Single variant.
 */
export const EventReviewExpired = () => (
  <div className={classes.RealisticTimeline}>
    {/* Request to close expired — actor-less (automatic expiry) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Request to close expired</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CircleSlashIcon} aria-label="Request to close expired" />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.ActionText}>Request to close expired</span> <Time date="2025-10-23T10:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
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
  <div className={classes.RealisticTimeline}>
    {/* Full shape — package + policy link + repo name */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Added a package exception to the license policy</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} aria-label="Exception added" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>
              added npm/left-pad to <PolicyLink /> for monalisa/octo-app
            </span>{' '}
            <Time date="2025-10-23T12:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Fallback shape — body missing package info */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Created exception (fallback)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} aria-label="Exception created" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>created exception</span> <Time date="2025-10-23T12:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
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
  <div className={classes.RealisticTimeline}>
    {/* Full shape — licenses list + policy link + repo name */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Added licenses to the license policy</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} aria-label="Licenses added" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>
              added MIT, Apache-2.0 to <PolicyLink /> for monalisa/octo-app
            </span>{' '}
            <Time date="2025-10-24T12:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Fallback shape — body missing licenses array */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Added to approved licenses (fallback)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} aria-label="Added to approved licenses" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>added to approved licenses</span> <Time date="2025-10-24T12:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Closed event group — `AlertEventType.Closed` (audit § 9).
 *
 * Source: `events/ClosedEvent.tsx` (`TimelineEventWithActor`): `ShieldCheckIcon
 * size={16}` on the `done` (PURPLE) badge — the only colored gray-exempt event
 * besides Opened. The copy comes from `getClosedActionText(closureReason,
 * resolution)`, which renders exactly one of:
 * - "closed as {closureReason}" — when a free-text `closureReason` is present
 *   (e.g. "used in tests", carried over from the review flow);
 * - "closed as outdated" — resolution `Outdated`;
 * - "closed as amendment" — resolution `ExceptionAdded` or `LicensesAdded`;
 * - "closed this alert" — the default.
 * An optional `EventComment` sub-row renders a closing comment.
 */
export const EventClosed = () => (
  <div className={classes.RealisticTimeline}>
    {/* Closed as {free-text reason}, with a closing comment */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as a specific reason (with comment)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Closed" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as used in tests</span> <Time date="2025-10-25T10:00:00Z" />
            <EventComment>Confirmed this dependency only ships in the test bundle.</EventComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as outdated — resolution Outdated */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as outdated</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Closed as outdated" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as outdated</span> <Time date="2025-10-25T10:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as amendment — resolution ExceptionAdded / LicensesAdded */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as amendment</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Closed as amendment" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as amendment</span> <Time date="2025-10-25T10:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed this alert — default (no reason / resolution) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed this alert (default)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Closed" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed this alert</span> <Time date="2025-10-25T10:15:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)
