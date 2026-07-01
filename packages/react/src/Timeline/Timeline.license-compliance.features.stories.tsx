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
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/hubot'
// The license-compliance system bot — Rails attributes every system event
// (Opened, Review-expired) to `github-license-compliance[bot]` when user_id<=0.
const LICENSE_BOT_AVATAR = 'https://avatars.githubusercontent.com/u/9919?s=40&v=4'

/**
 * User actor — live `TimelineEventWithActor` (`events/shared.tsx`). Renders a
 * 20px CIRCLE `GitHubAvatar` followed by the login. Rendered as PLAIN INLINE
 * elements (avatar with `vertical-align: middle` immediately followed by an
 * inline `<Link>`/span) — NO `inline-flex` wrapper — so the avatar, login, badge
 * and trailing summary all sit on one cleanly vertically-centered line, exactly
 * like the working Issues (#8070) / Dependabot (#8071) rows. The shape is derived
 * from the login, matching live `shared.tsx`:
 * - login ends with `[bot]` → the suffix is stripped and the (UNLINKED) display
 *   login renders bold + a secondary "bot" `Label` (live ignores `url` for bots).
 * - otherwise `url` present → inline `<Link>` login, semibold + `fgColor-default`
 *   (the bold weight is the non-color differentiator that satisfies
 *   `link-in-text-block`).
 * - otherwise → bold login text.
 */
const UserActor = ({login = 'monalisa', src = MONALISA_AVATAR, url}: {login?: string; src?: string; url?: string}) => {
  // Derive the bot shape from the login itself, exactly like live `shared.tsx`
  // (`isBot = login.endsWith('[bot]')`, with the suffix stripped for display).
  const isBot = login.endsWith('[bot]')
  const displayLogin = isBot ? login.replace(/\[bot\]$/i, '') : login
  const avatar = <Avatar src={src} size={20} alt="" className={classes.InlineAvatar} />
  if (isBot) {
    // Live renders bots UNLINKED (the bot branch ignores `actor.url`): avatar +
    // bold display login + a secondary "bot" Label.
    return (
      <>
        {avatar}
        <span className={classes.ActorName}>{displayLogin}</span>
        <Label variant="secondary" className={classes.BotLabel}>
          bot
        </Label>
      </>
    )
  }
  if (url) {
    return (
      <>
        {avatar}
        <Link href={url} className={classes.ActorName}>
          {displayLogin}
        </Link>
      </>
    )
  }
  return (
    <>
      {avatar}
      <span className={classes.ActorName}>{displayLogin}</span>
    </>
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

/**
 * Story-only wrapper around each group's examples. Besides constraining the
 * width (`.RealisticTimeline`), it:
 * - sets `data-a11y-link-underlines="true"` so Primer's inline-link underline
 *   (gated on this ancestor attribute, which GitHub sets from the default-on
 *   "Show link underlines" preference but Storybook never sets) renders for the
 *   in-text `<Link inline>` links (policy / PR) — reproducing production and
 *   satisfying WCAG 1.4.1. Actor-name links have no `inline` prop, so they stay
 *   un-underlined (avatar + semibold cue only).
 * - swallows clicks on the demo links (actor profile, PR, license-policy) so
 *   navigating one of these placeholder `href`s doesn't kick the viewer out of
 *   the Storybook UI — the same guard the base `Timeline.features.stories.tsx`
 *   `WithActions` story uses. The `e.target instanceof Element` check keeps it
 *   safe when the click originates on an SVG/octicon.
 */
const Examples = ({children}: {children: React.ReactNode}) => (
  <div
    className={classes.RealisticTimeline}
    data-a11y-link-underlines="true"
    onClick={e => {
      if (e.target instanceof Element && e.target.closest('a')) e.preventDefault()
    }}
  >
    {children}
  </div>
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
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Opened</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="github-license-compliance[bot]" src={LICENSE_BOT_AVATAR} />{' '}
            <span className={classes.ActionText}>opened this alert</span> <Time date="2025-10-20T10:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Appeared in branch</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitBranchIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.ActionText}>Appeared in branch</span>{' '}
            <BranchName href="../../tree/feature-branch">feature-branch</BranchName>{' '}
            <Time date="2025-10-20T10:01:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </Examples>
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
 *
 * NOTE: the `closure_reason` text shown after "requested to close as …" is
 * produced by the Go OLC service, not the local Rails/React code — its exact
 * format (e.g. "amendment"-style label vs raw value) is unverified here. Confirm
 * via a prod smoke-test; the example label below is illustrative.
 */
export const EventReviewRequested = () => (
  <Examples>
    {/* Requested to close — no reason, no PR, no comment */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Requested to close</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
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
            <Octicon icon={CommentIcon} />
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
            <Octicon icon={CommentIcon} />
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
  </Examples>
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
  <Examples>
    {/* Approved closure request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Approved closure request</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} />
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
            <Octicon icon={CheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} url="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>approved closure request</span> <Time date="2025-10-22T10:05:00Z" />
            <EventComment>Agreed — test-only usage is within policy.</EventComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </Examples>
)

/**
 * The Review-denied event group — `AlertEventType.ReviewDenied` (audit § 5).
 *
 * Source: `events/ReviewDeniedEvent.tsx` (`TimelineEventWithActor`):
 * `XIcon size={16}` on the default (gray) badge, copy "denied closure request",
 * with an optional `EventComment` sub-row.
 */
export const EventReviewDenied = () => (
  <Examples>
    {/* Denied closure request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Denied closure request</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} />
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
            <Octicon icon={XIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="hubot" src={HUBOT_AVATAR} url="https://github.com/hubot" />{' '}
            <span className={classes.ActionText}>denied closure request</span> <Time date="2025-10-22T11:05:00Z" />
            <EventComment>This package is distributed to customers, so the license still applies.</EventComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Request to close expired</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CircleSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="github-license-compliance[bot]" src={LICENSE_BOT_AVATAR} />{' '}
            <span className={classes.ActionText}>Request to close expired</span> <Time date="2025-10-23T10:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Added a package exception to the license policy</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} />
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
            <Octicon icon={LawIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>created exception</span> <Time date="2025-10-23T12:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Added licenses to the license policy</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={LawIcon} />
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
            <Octicon icon={LawIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>added to approved licenses</span> <Time date="2025-10-24T12:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
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
 * (default). An optional `EventComment` sub-row renders a closing comment.
 */
export const EventClosed = () => (
  <Examples>
    {/* Closed as amendment — with a closing comment */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as amendment (with comment)</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as amendment</span> <Time date="2025-10-25T10:00:00Z" />
            <EventComment>Added a policy exception covering this package.</EventComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as private package */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as private package</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as private package</span> <Time date="2025-10-25T10:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as inaccurate license */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as inaccurate license</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as inaccurate license</span>{' '}
            <Time date="2025-10-25T10:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as policy edited */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as policy edited</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as policy edited</span> <Time date="2025-10-25T10:15:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as fixed */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as fixed</h3>
      <Timeline aria-label="License compliance alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as fixed</span> <Time date="2025-10-25T10:20:00Z" />
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
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed as outdated</span> <Time date="2025-10-25T10:25:00Z" />
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
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="monalisa" src={MONALISA_AVATAR} url="https://github.com/monalisa" />{' '}
            <span className={classes.ActionText}>closed this alert</span> <Time date="2025-10-25T10:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </Examples>
)
