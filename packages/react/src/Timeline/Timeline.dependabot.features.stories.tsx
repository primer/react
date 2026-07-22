import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {
  CheckIcon,
  CommentIcon,
  GitBranchIcon,
  NoteIcon,
  PersonIcon,
  RepoPushIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldSlashIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react'
import {Button} from '../Button'
import Label from '../Label'
import Link from '../Link'
import Octicon from '../Octicon'
import classes from './Timeline.dependabot.features.stories.module.css'
import {
  BoldLink,
  EventSubRow,
  Examples,
  InlineAvatar,
  MutedTime,
  UserActor,
  VariantSection,
} from './internal/timelineStoryHelpers'
import {actorTypeForLogin, DEPENDABOT_TAXONOMY, toEventDataAttributes, type DependabotEventType} from './taxonomy'

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
 * TAXONOMY `data-*` CONTRACT: every cataloged `Timeline.Item` below carries the
 * event `data-*` attributes projected from the merged taxonomy module
 * (`./taxonomy`, primer/react#8180) — the single source of truth for Timeline
 * event categorization (github/primer#6664, docs github/primer#6888). Each row
 * spreads the output of `toEventDataAttributes` via the local `dependabotAttrs`
 * helper, which derives `category` / `visibility` FROM the catalog entry
 * (`DEPENDABOT_TAXONOMY`) so the stories stay in sync with the catalog, and
 * resolves `data-actor-type` at runtime from each row's rendered actor login
 * (`actorTypeForLogin`): Dependabot-authored rows resolve to `bot`, user-driven
 * rows to `user`. The contract per rendered `<li>`: `data-event-scope`,
 * `data-event-type` (the UNSCOPED leaf), `data-event-category`,
 * `data-event-visibility` (defaults `primary`), and `data-actor-type`. This
 * applies the same contract proven by the License Compliance pilot
 * (primer/react#8216).
 *
 * SHARED / PARKED EVENTS (left untagged): the Assignment and Copilot-work groups
 * are cross-surface SHARED events, deliberately kept OUT of the per-surface
 * Dependabot catalog (github/primer#6888), so they intentionally carry NO
 * `data-*` attributes. See the code comments above `EventAssignment` and
 * `EventCopilotWork`.
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

// User avatars for the assignment actor + assignee examples. `six7` / `hubot`
// are the same public fixtures the Secret scanning assignment story uses, so the
// two surfaces read consistently.
const SIX7_AVATAR = 'https://avatars.githubusercontent.com/u/4548309?v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/u/480938?v=4'

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
    <InlineAvatar src={DEPENDABOT_AVATAR} square />
    <BoldLink href="#" muted>
      dependabot
    </BoldLink>
    <Label variant="secondary" className={classes.BotLabel}>
      bot
    </Label>
  </>
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
 * Local projection of the taxonomy `data-*` contract for this surface. Given a
 * Dependabot leaf `type` (and, when the row renders an actor, that actor's
 * `login`), it returns the `data-*` attribute set to spread on the
 * `Timeline.Item`. `category` and `visibility` come FROM the catalog entry so
 * the stories track `DEPENDABOT_TAXONOMY`; `data-actor-type` is resolved at
 * runtime from the login (Dependabot-authored rows pass a `…[bot]` login so they
 * resolve to `bot`; user-driven rows pass the rendered user login). See
 * github/primer#6664 and the taxonomy docs (github/primer#6888).
 */
const dependabotAttrs = (type: DependabotEventType, login?: string) =>
  toEventDataAttributes({
    scope: 'dependabot',
    type,
    category: DEPENDABOT_TAXONOMY[type].category,
    visibility: DEPENDABOT_TAXONOMY[type].visibility,
    actorType: login ? actorTypeForLogin(login) : undefined,
  })

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
  <Examples>
    {/* Opened — no source */}
    <VariantSection label="Opened">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('opened', 'dependabot[bot]')}>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'opened this '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* OpenedFromPR — bold `#123` pull-request link (scheme: primary, bold) */}
    <VariantSection label="Opened from pull request">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('opened', 'dependabot[bot]')}>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'opened this from '}
            <BoldLink href="#">#123</BoldLink> <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* OpenedFromPush — blue push-pill with the 7-char `after` SHA */}
    <VariantSection label="Opened from push">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('opened', 'dependabot[bot]')}>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'opened this from '}
            <PushPill sha="adfc29a" /> <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Fixed — no source */}
    <VariantSection label="Fixed">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('fixed', 'dependabot[bot]')}>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'closed this as completed '}
            <MutedTime date={new Date('2022-08-01T09:30:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* FixedViaPR — bold `#123` pull-request link */}
    <VariantSection label="Fixed via pull request">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('fixed', 'dependabot[bot]')}>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'closed this as completed in '}
            <BoldLink href="#">#123</BoldLink> <MutedTime date={new Date('2022-08-01T09:30:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* FixedViaPush — blue push-pill */}
    <VariantSection label="Fixed via push">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('fixed', 'dependabot[bot]')}>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'closed this as completed in '}
            <PushPill sha="adfc29a" /> <MutedTime date={new Date('2022-08-01T09:30:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
 * The optional comment renders as a small sub-row (note octicon + text).
 */
export const EventDismissed = () => (
  <Examples>
    {/* Manual — risk is tolerable (with an optional dismissal note) */}
    <VariantSection label="Dismissed as risk is tolerable">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'dismissed this as risk is tolerable '}
            <MutedTime date={new Date('2022-08-02T14:10:00Z')} />
            <EventSubRow icon={NoteIcon}>
              This dependency is only used in our test tooling, so the risk is acceptable.
            </EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Manual — fix started */}
    <VariantSection label="Dismissed as fix started">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'dismissed this as fix started '}
            <MutedTime date={new Date('2022-08-02T14:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Manual — no bandwidth to fix this */}
    <VariantSection label="Dismissed as no bandwidth">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'dismissed this as no bandwidth to fix this '}
            <MutedTime date={new Date('2022-08-02T14:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Manual — vulnerable code is not actually used */}
    <VariantSection label="Dismissed as not used">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'dismissed this as vulnerable code is not actually used '}
            <MutedTime date={new Date('2022-08-02T14:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Manual — inaccurate */}
    <VariantSection label="Dismissed as inaccurate">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'dismissed this as inaccurate '}
            <MutedTime date={new Date('2022-08-02T14:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Auto — rule-based, no source (with optional rule comment) */}
    <VariantSection label="Auto-dismissed by alert rule">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'dependabot[bot]')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'dismissed this due to an alert rule '}
            <MutedTime date={new Date('2022-08-03T08:00:00Z')} />
            <EventSubRow icon={NoteIcon}>
              {'Rule created and '}
              <Link href="#" inline>
                low-severity-dev-deps
              </Link>
              {' was applied'}
            </EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Auto — from a pull request */}
    <VariantSection label="Auto-dismissed from pull request">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'dependabot[bot]')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'dismissed this due to an alert rule from '}
            <BoldLink href="#">#123</BoldLink> <MutedTime date={new Date('2022-08-03T08:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Auto — from a push */}
    <VariantSection label="Auto-dismissed from push">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissed', 'dependabot[bot]')}>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'dismissed this due to an alert rule from '}
            <PushPill sha="adfc29a" /> <MutedTime date={new Date('2022-08-03T08:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
  <Examples>
    {/* Manual reopen — user actor */}
    <VariantSection label="Reopened">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('reopened', 'monalisa')}>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'reopened this '}
            <MutedTime date={new Date('2022-08-04T10:15:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Reintroduced — no source */}
    <VariantSection label="Reintroduced">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('reopened', 'dependabot[bot]')}>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this '}
            <MutedTime date={new Date('2022-08-05T11:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Reintroduced — from a pull request */}
    <VariantSection label="Reintroduced from pull request">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('reopened', 'dependabot[bot]')}>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this from '}
            <BoldLink href="#">#123</BoldLink> <MutedTime date={new Date('2022-08-05T11:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Reintroduced — from a push */}
    <VariantSection label="Reintroduced from push">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('reopened', 'dependabot[bot]')}>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this from '}
            <PushPill sha="adfc29a" /> <MutedTime date={new Date('2022-08-05T11:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Auto-reopened — rule change (with optional rule comment) */}
    <VariantSection label="Auto-reopened by rule change">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('reopened', 'dependabot[bot]')}>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <DependabotActor />
            {'reopened this '}
            <MutedTime date={new Date('2022-08-06T09:45:00Z')} />
            <EventSubRow icon={NoteIcon}>
              {'Rule disabled: '}
              <Link href="#" inline>
                low-severity-dev-deps
              </Link>
            </EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
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
 * - Requested  (`DismissalRequestedComponent`): `comment` icon, attention color.
 * - Approved   (`DismissalReviewedComponent`, status approved): `check`, success.
 * - Denied     (`DismissalReviewedComponent`, status rejected): `x`, danger.
 * - Cancelled  (`DismissalCancelledComponent`): `x`, subtle color.
 *
 * BADGE MECHANIC: the ERB uses `with_badge(color: :X, icon: Y)` with NO `bg:`.
 * In Primer that tints the ICON on the DEFAULT badge background — it does NOT
 * produce a solid-color badge (unlike Opened/Fixed/Reopened, which DO set
 * `bg: :X_emphasis` and so use solid `variant`s). So these four render as a bare
 * `<Timeline.Badge>` (default gray circle) with the icon color set via a
 * `.BadgeIcon*` class — the same structure as the muted Dismissed badge.
 * Optional review/resolution notes render via the shared `EventSubRow` sub-row.
 */
export const EventDismissalRequest = () => (
  <Examples>
    {/* Dismissal requested — circle user actor, attention/comment badge. When
        `show_dismissal_actions` is true, the live inline template
        (`dismissal_requested_component.rb`) renders a `<span class="float-right">`
        holding `DismissalReviewDialogComponent` — whose visible control is a
        SINGLE small primary "Review request" button that opens a review dialog
        (the approve/deny choice lives inside the dialog, not on the row). We
        place that right-aligned control in the `Timeline.Actions` slot. */}
    <VariantSection label="Dismissal requested">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissal_requested', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} className={classes.BadgeIconAttention} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'requested to dismiss this as '}
            <strong>Tolerable risk</strong> <MutedTime date={new Date('2022-08-07T13:20:00Z')} />
            <EventSubRow icon={NoteIcon}>
              This dependency is only used in our test tooling, so the risk is acceptable.
            </EventSubRow>
          </Timeline.Body>
          <Timeline.Actions>
            <Button variant="primary" size="small">
              Review request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Dismissal approved — circle user actor, success/check badge */}
    <VariantSection label="Dismissal approved">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissal_reviewed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} className={classes.BadgeIconSuccess} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'approved dismissal '}
            <MutedTime date={new Date('2022-08-08T10:05:00Z')} />
            <EventSubRow icon={NoteIcon}>Confirmed this dependency is dev-only — approving the dismissal.</EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Dismissal denied — circle user actor, danger/x badge */}
    <VariantSection label="Dismissal denied">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissal_reviewed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={XIcon} className={classes.BadgeIconDanger} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'denied dismissal '}
            <MutedTime date={new Date('2022-08-08T15:40:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Dismissal cancelled — circle user actor, plain default (subtle) x badge.
        `DismissalCancelledComponent` renders `with_badge(color: :subtle, icon:
        "x")` (no bg) → a bare default badge, not a danger/emphasis one. */}
    <VariantSection label="Dismissal cancelled">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item {...dependabotAttrs('dismissal_cancelled', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={XIcon} className={classes.BadgeIconMuted} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'cancelled their dismissal request '}
            <MutedTime date={new Date('2022-08-09T09:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Assignment event group — `AssignmentComponent`
 * (`timeline_items/assignment_component.{rb,html.erb}`).
 *
 * Source: `DependabotAlerts::TimelineItems::AssignmentComponent`. Badge:
 * `person` icon on the PLAIN DEFAULT badge (subtle gray circle) — the ERB
 * renders `with_badge(icon: :person)` with NO `bg:`/`color:` override. The actor
 * AND the assignee are each rendered with an avatar via `ActorComponent` (our
 * `UserActor`), matching the rest of this Dependabot surface (linked + muted).
 *
 * COPY: `action_text` keys off `self_assignment?` (`actor.id == assignee.id`):
 * a self-action collapses to `self-assigned this` (assigned) / `removed their
 * assignment` (unassigned) with NO trailing assignee; otherwise the body is the
 * bare action word (`assigned` / `unassigned`) followed by the assignee actor.
 * The five variants mirror the Secret scanning assignment story: self-assign,
 * assign another, self-unassign, unassign another, and a combined assign +
 * unassign example.
 *
 * SHARED / PARKED — NO `data-*` TAXONOMY: assignment is a cross-surface SHARED
 * event, deliberately kept OUT of the per-surface Dependabot catalog
 * (`DEPENDABOT_TAXONOMY` has no assignment leaf), per the taxonomy docs
 * (github/primer#6888). It has no per-surface taxonomy leaf yet, so these rows
 * intentionally carry NO `data-*` attributes.
 */
export const EventAssignment = () => (
  <Examples>
    {/* Self-assigned — actor === assignee (`self_assignment?`) */}
    <VariantSection label="Self-assigned">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'self-assigned this '}
            <MutedTime date={new Date('2022-08-10T09:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Assigned someone else — both actor + assignee avatars */}
    <VariantSection label="Assigned another user">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'assigned '}
            <UserActor login="six7" src={SIX7_AVATAR} href="#" muted />{' '}
            <MutedTime date={new Date('2022-08-10T09:05:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Self-unassigned — actor removed their own assignment */}
    <VariantSection label="Removed own assignment">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'removed their assignment '}
            <MutedTime date={new Date('2022-08-10T09:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unassigned someone else */}
    <VariantSection label="Unassigned another user">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'unassigned '}
            <UserActor login="six7" src={SIX7_AVATAR} href="#" muted />{' '}
            <MutedTime date={new Date('2022-08-10T09:15:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Assigned one user and unassigned another in a single event */}
    <VariantSection label="Assigned and unassigned">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'assigned '}
            <UserActor login="six7" src={SIX7_AVATAR} href="#" muted />
            {' and unassigned '}
            <UserActor login="hubot" src={HUBOT_AVATAR} href="#" muted />{' '}
            <MutedTime date={new Date('2022-08-10T09:20:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Copilot work event group — `CopilotWorkStartedComponent` /
 * `CopilotWorkFinishedComponent` (`copilot_work_started_component.{rb,html.erb}`
 * and `copilot_work_finished_component.{rb,html.erb}`).
 *
 * These events surface when a Dependabot alert is assigned to Copilot. In both,
 * `Copilot` is BOLD PLAIN TEXT (a `<strong>`, NOT a link or avatar), followed by
 * `started`/`finished` `work on behalf of` the human {actor} (an `ActorComponent`
 * → our linked + muted `UserActor`) and the past `RelativeTime`.
 *
 * - Work started (`with_badge(icon: "git-branch")`): default (gray) badge. When
 *   `session_url` is present the ERB also renders a right-floated small anchor
 *   `Button` ("View session"). We place that in the `Timeline.Actions` slot —
 *   the same right-controls convention as the Dismissal request "Review request"
 *   button above.
 * - Work finished (`with_badge(icon: "repo-push")`): default (gray) badge, no
 *   right control.
 *
 * SHARED / PARKED — NO `data-*` TAXONOMY: Copilot-agent work is a cross-surface
 * SHARED event, deliberately kept OUT of the per-surface Dependabot catalog
 * (`DEPENDABOT_TAXONOMY` has no copilot leaf), per the taxonomy docs
 * (github/primer#6888). It has no per-surface taxonomy leaf yet, so these rows
 * intentionally carry NO `data-*` attributes.
 */
export const EventCopilotWork = () => (
  <Examples>
    {/* Work started — git-branch badge + optional "View session" right control */}
    <VariantSection label="Work started">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitBranchIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <strong>Copilot</strong>
            {' started work on behalf of '}
            <UserActor href="#" muted /> <MutedTime date={new Date('2022-08-11T10:00:00Z')} />
          </Timeline.Body>
          <Timeline.Actions>
            <Button as="a" href="#" size="small">
              View session
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Work finished — repo-push badge, no right control */}
    <VariantSection label="Work finished">
      <Timeline aria-label="Dependabot alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={RepoPushIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <strong>Copilot</strong>
            {' finished work on behalf of '}
            <UserActor href="#" muted /> <MutedTime date={new Date('2022-08-11T10:45:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)
