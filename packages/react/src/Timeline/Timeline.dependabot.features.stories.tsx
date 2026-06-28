import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {
  CheckIcon,
  CommentIcon,
  NoteIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldSlashIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react'
import Avatar from '../Avatar'
import Label from '../Label'
import Link from '../Link'
import Octicon from '../Octicon'
import RelativeTime from '../RelativeTime'
import classes from './Timeline.dependabot.features.stories.module.css'

/**
 * Dependabot alert Timeline event examples (Phase 2 of github/primer#6663).
 *
 * These stories recreate GitHub's live Dependabot-alert-timeline events using
 * the Primer `Timeline` compositional slots. They mirror the established Issues
 * stories (`Timeline.issues.features.stories.tsx`) and are sourced from the
 * `timeline-audit` Figma audit (`dependabot-timeline-events-for-figma.md`).
 *
 * SOURCE OF TRUTH — Dependabot is NOT (yet) migrated to React. The Dependabot
 * alert timeline is entirely SERVER-RENDERED ERB (ViewComponent). The events
 * are rendered by `DependabotAlerts::TimelineComponent`, which dispatches to
 * per-event components in `app/components/dependabot_alerts/timeline_items/`
 * (e.g. `OpenedComponent`) in the `github/github` Rails monorepo. There is no
 * React equivalent in `github/github-ui` — that repo only ships Catalyst
 * custom-element controllers (`dependabot-alert-*-element.ts`) for table-row /
 * load-all / dismissal interactions, not the timeline event rows. So each event
 * below is translated faithfully from the live ERB into Primer React, with the
 * ERB source file commented inline.
 *
 * SCOPE: These are Storybook-only examples by design. They are intentionally
 * NOT wired into components-json / the primer.style docs page (do NOT add this
 * file to `Timeline.docs.json` or `build.ts`). Individual timeline events are
 * not consumer-facing components — the primer.style Timeline page reflects the
 * base `Timeline` component's own stories, and any docs-site representation is a
 * Phase 3 consideration via base-component story changes, out of scope here.
 *
 * FUTURE FILTERING (taxonomy still open — github/primer#6663): category
 * `data-*` attributes (e.g. `data-event-category="opened"`) will attach to each
 * `Timeline.Item` below so stories can be filtered/grouped by event family. We
 * intentionally do NOT add them yet to avoid baking in a taxonomy.
 *
 * SLOT USAGE (Phase 1 slots — same convention as the Issues group):
 * - `Timeline.Avatar` (gutter slot, #6677): the 40px LEFT-GUTTER avatar.
 *   Reserved for comment-style events. Badge-row events like Opened do NOT use
 *   it — the live ERB renders the actor's small SQUARE avatar INLINE in the body
 *   (`ActorComponent`), not in the gutter. We mirror that: avatar inline in
 *   `Timeline.Body`.
 * - `Timeline.Actions` (right-controls slot, #6678): for buttons / SHAs / status
 *   pills on the right edge. Opened has no right controls, so it is omitted here.
 *
 * DEPENDABOT-SPECIFIC COMPOSITION (see helpers below): the square bot avatar,
 * the `(bot)` identifier tag, and the SUBTLE light-blue `(push-pill: SHA)` are
 * composed from Primer primitives (`Avatar square`, `Label variant="secondary"`,
 * and a `<code>`-wrapped styled `Link`) to match the live ERB.
 */

// Live ERB uses the bundled `modules/site/dependabot-icon.png`; this is the
// public dependabot[bot] avatar (square Dependabot logo) for Storybook.
const DEPENDABOT_AVATAR = 'https://avatars.githubusercontent.com/u/27347476?v=4'
const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'

/**
 * Dependabot actor — `DependabotAlerts::TimelineItems::ActorComponent` in
 * `:dependabot` mode (`actor_component.html.erb`):
 *   square avatar + bold `dependabot` docs link + `(bot)` identifier tag.
 * (`bot_identifier_tag` → `<span class="Label Label--secondary">bot</span>`.)
 * Used by Dependabot-authored events (Opened / Fixed / Reintroduced /
 * Auto-dismissed / Auto-reopened).
 */
const DependabotActor = () => (
  <>
    <Avatar src={DEPENDABOT_AVATAR} size={20} square alt="" className={classes.InlineAvatar} />
    <Link href="#" className={classes.LinkWithBoldStyle} muted>
      dependabot
    </Link>
    <Label variant="secondary" className={classes.BotLabel}>
      bot
    </Label>
  </>
)

/**
 * User actor — `ActorComponent` regular-user branch (`linked_avatar_for(actor,
 * 20)` + `profile_link(... "text-bold")`): a CIRCLE 20px avatar + bold profile
 * link, no `(bot)` tag. Used by user-authored events (manual Dismissed, manual
 * Reopened, Dismissal Cancelled).
 */
const UserActor = () => (
  <>
    <Avatar src={MONALISA_AVATAR} size={20} alt="" className={classes.InlineAvatar} />
    <Link href="#" className={classes.LinkWithBoldStyle} muted>
      monalisa
    </Link>
  </>
)

// Muted relative timestamp. The Dependabot ERB renders a plain
// `Primer::Beta::RelativeTime` (no link wrapper) — muted text only, which is a
// deliberate difference from the Issues `Ago` deep-link.
const Time = ({date}: {date: string}) => (
  <span className={classes.Timestamp}>
    <RelativeTime date={new Date(date)} format="relative" />
  </span>
)

/**
 * Push-pill — `PushLinkComponent`: a `<code>` wrapping a `Primer::Beta::Link`
 * (`bg: :accent, px: 2, py: 1, border_radius: 3`) → SUBTLE light-blue rounded
 * pill with accent-blue monospace text (the standard GitHub SHA pill), showing
 * the 7-char `after` SHA (single commit) or a `before..after` range (multi).
 */
const PushPill = ({sha}: {sha: string}) => (
  <code className={classes.PushPill}>
    <Link href="#" className={classes.PushPillLink}>
      {sha}
    </Link>
  </code>
)

/**
 * Optional sub-content row rendered below a dismissal/auto event — the live ERB
 * renders a `<div class="TimelineItem tmp-pl-5 pt-0 f6 d-block">` with a `note`
 * octicon and the comment text. Rendered here as a small muted block inside the
 * event body.
 */
const NoteComment = ({children}: {children: React.ReactNode}) => (
  <div className={classes.NoteComment}>
    <Octicon icon={NoteIcon} size={16} className={classes.NoteIcon} />
    {children}
  </div>
)

export default {
  title: 'Components/Timeline/Events/Dependabot',
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
 * The Opened event group — `DepTimeline.eventOpened` (audit § 1).
 *
 * Source: `OpenedComponent` (`opened_component.html.erb`). The actor is ALWAYS
 * Dependabot. Badge: `shield` icon on `success` (green) — the ERB renders
 * `with_badge(bg: :success_emphasis, color: :on_emphasis, icon: :shield)`,
 * which maps exactly to `Timeline.Badge variant="success"`.
 *
 * Three source variants (`Opened` / `OpenedFromPR` / `OpenedFromPush`) differ
 * only by the optional "from …" clause: no source, a bold `#123` PR link, or a
 * blue push-pill.
 */
export const EventOpened = () => (
  <div
    className={classes.RealisticTimeline}
    // Prevent the placeholder `href="#"` links from navigating inside Storybook.
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Opened — no source */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Opened</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} aria-label="Opened" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'opened this '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* OpenedFromPR — bold `#123` pull-request link (scheme: primary, bold) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Opened from pull request</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} aria-label="Opened from pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'opened this from '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              #123
            </Link>{' '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* OpenedFromPush — blue push-pill with the 7-char `after` SHA */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Opened from push</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} aria-label="Opened from push" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'opened this from '}
            <PushPill sha="adfc29a" /> <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Fixed event group — `DepTimeline.eventFixed` (audit § 2).
 *
 * Source: `FixedComponent` (`fixed_component.html.erb`). Actor is ALWAYS
 * Dependabot. Badge: `shield-check` on `done` (purple) — the ERB renders
 * `with_badge(bg: :done_emphasis, color: :on_emphasis, icon: "shield-check")`,
 * mapping to `Timeline.Badge variant="done"`. Three source variants differ only
 * by the optional "in …" clause (no source / bold `#123` PR link / push-pill).
 *
 * NOTE: the live ERB renders a `TimelineItem-break` separator after this event
 * (unless it is the last). In these stacked, single-event stories we omit the
 * runtime separator — it is a list-position concern, not part of the event.
 */
export const EventFixed = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Fixed — no source */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Fixed</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Fixed" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'closed this as completed '}
            <Time date="2022-08-01T09:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* FixedViaPR — bold `#123` pull-request link */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Fixed via pull request</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Fixed via pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'closed this as completed in '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              #123
            </Link>{' '}
            <Time date="2022-08-01T09:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* FixedViaPush — blue push-pill */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Fixed via push</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Fixed via push" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'closed this as completed in '}
            <PushPill sha="adfc29a" /> <Time date="2022-08-01T09:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Dismissed event group — `DepTimeline.eventDismissed` (audit § 3).
 *
 * Consolidates MANUAL user dismissals (`DismissedComponent`, circle user actor)
 * and rule-based AUTO dismissals (`AutoDismissedComponent`, square Dependabot
 * actor). Badge: `shield-slash` on the PLAIN DEFAULT badge (subtle gray circle,
 * muted icon) — the live ERB renders `with_badge(color: :muted, ...)` /
 * `with_badge(icon: "shield-slash")` with NO `bg:` override, so we use a bare
 * `Timeline.Badge` (no variant), NOT the neutral-emphasis hook.
 *
 * Manual reasons are `RepositoryVulnerabilityAlert::DISMISS_REASONS` downcased.
 * The optional comment renders as a small indented sub-row (note octicon + text).
 */
export const EventDismissed = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Manual — risk is tolerable (with an optional dismissal note) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissed as risk is tolerable</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Dismissed as risk is tolerable" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'dismissed this as risk is tolerable '}
            <Time date="2022-08-02T14:10:00Z" />
            <NoteComment>This dependency is only used in our test tooling, so the risk is acceptable.</NoteComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Manual — fix started */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissed as fix started</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Dismissed as fix started" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'dismissed this as fix started '}
            <Time date="2022-08-02T14:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Manual — no bandwidth to fix this */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissed as no bandwidth</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Dismissed as no bandwidth to fix this" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'dismissed this as no bandwidth to fix this '}
            <Time date="2022-08-02T14:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Manual — vulnerable code is not actually used */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissed as not used</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Dismissed as vulnerable code is not actually used" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'dismissed this as vulnerable code is not actually used '}
            <Time date="2022-08-02T14:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Manual — inaccurate */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissed as inaccurate</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Dismissed as inaccurate" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'dismissed this as inaccurate '}
            <Time date="2022-08-02T14:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Auto — rule-based, no source (with optional rule comment) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Auto-dismissed by alert rule</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Auto-dismissed due to an alert rule" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'dismissed this due to an alert rule '}
            <Time date="2022-08-03T08:00:00Z" />
            <NoteComment>
              {'Rule created and '}
              <Link href="#">low-severity-dev-deps</Link>
              {' was applied'}
            </NoteComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Auto — from a pull request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Auto-dismissed from pull request</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Auto-dismissed due to an alert rule from pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'dismissed this due to an alert rule from '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              #123
            </Link>{' '}
            <Time date="2022-08-03T08:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Auto — from a push */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Auto-dismissed from push</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Auto-dismissed due to an alert rule from push" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'dismissed this due to an alert rule from '}
            <PushPill sha="adfc29a" /> <Time date="2022-08-03T08:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Reopened event group — `DepTimeline.eventReopened` (audit § 4).
 *
 * Consolidates MANUAL reopens (`ReopenedComponent`, circle user actor),
 * REINTRODUCTIONS (`ReintroducedComponent`, square Dependabot actor, × source)
 * and rule-based AUTO reopens (`AutoReopenedComponent`, square Dependabot
 * actor). Badge: `sync` on `success` (green) for all — the ERB renders
 * `with_badge(bg: :success_emphasis, color: :on_emphasis, icon: :sync)`.
 */
export const EventReopened = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Manual reopen — user actor */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reopened</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} aria-label="Reopened" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'reopened this '}
            <Time date="2022-08-04T10:15:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Reintroduced — no source */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reintroduced</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} aria-label="Reintroduced" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this '}
            <Time date="2022-08-05T11:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Reintroduced — from a pull request */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reintroduced from pull request</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} aria-label="Reintroduced from pull request" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this from '}
            <Link href="#" className={classes.LinkWithBoldStyle}>
              #123
            </Link>{' '}
            <Time date="2022-08-05T11:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Reintroduced — from a push */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reintroduced from push</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} aria-label="Reintroduced from push" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this from '}
            <PushPill sha="adfc29a" /> <Time date="2022-08-05T11:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Auto-reopened — rule change (with optional rule comment) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Auto-reopened by rule change</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} aria-label="Auto-reopened" />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this '}
            <Time date="2022-08-06T09:45:00Z" />
            <NoteComment>
              {'Rule disabled: '}
              <Link href="#">low-severity-dev-deps</Link>
            </NoteComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Dismissal Request event group — `DepTimeline.eventDismissalRequest`
 * (audit § 5). Part of the org-level delegated-closures system.
 *
 * SOURCE OF TRUTH — inline `erb_template` (NOT the dormant sidecar): each
 * `dismissal_*_component.rb` does `include ViewComponent::InlineTemplate` and
 * defines an `erb_template`, which is the ACTIVE render; the sibling
 * `*.html.erb` sidecar is dead code left in the tree. So every variant here
 * renders the actor via `ActorComponent` (a USER → circle avatar + bold link,
 * our `UserActor`), with status-driven badges:
 * - Requested  (`DismissalRequestedComponent`): `comment` icon / `attention`.
 * - Approved   (`DismissalReviewedComponent`, status approved): `check` / `success`.
 * - Denied     (`DismissalReviewedComponent`, status rejected): `x` / `danger`.
 * - Cancelled  (`DismissalCancelledComponent`): `x` / `subtle` (plain default badge).
 *
 * `attention`, `success`, and `danger` are named `TimelineBadgeVariants`, so we
 * use `variant="…"` directly (no inline `--timelineBadge-bgColor` hook needed).
 * Optional review/resolution notes render via the shared `NoteComment` sub-row
 * (the ERB's `note`-octicon `TimelineItem tmp-pl-5 …` block).
 */
export const EventDismissalRequest = () => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* Dismissal requested — circle user actor, attention/comment badge.
        (The live ERB also renders optional float-right Review/Deny actions via
        `DismissalReviewDialogComponent` when `show_dismissal_actions` — those
        would live in `Timeline.Actions`; omitted here as interactive controls.) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal requested</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="attention">
            <Octicon icon={CommentIcon} aria-label="Dismissal requested" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'requested to dismiss this as '}
            <strong>Tolerable risk</strong> <Time date="2022-08-07T13:20:00Z" />
            <NoteComment>This dependency is only used in our test tooling, so the risk is acceptable.</NoteComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Dismissal approved — circle user actor, success/check badge */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal approved</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={CheckIcon} aria-label="Dismissal approved" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'approved dismissal '}
            <Time date="2022-08-08T10:05:00Z" />
            <NoteComment>Confirmed this dependency is dev-only — approving the dismissal.</NoteComment>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Dismissal denied — circle user actor, danger/x badge */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal denied</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="danger">
            <Octicon icon={XIcon} aria-label="Dismissal denied" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'denied dismissal '}
            <Time date="2022-08-08T15:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Dismissal cancelled — circle user actor, plain default (subtle) x badge.
        `DismissalCancelledComponent` renders `with_badge(color: :subtle, icon:
        "x")` (no bg) → a bare default badge, not a danger/emphasis one. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal cancelled</h3>
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} aria-label="Dismissal cancelled" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'cancelled their dismissal request '}
            <Time date="2022-08-09T09:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)
