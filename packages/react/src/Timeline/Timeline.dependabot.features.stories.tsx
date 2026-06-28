import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {ShieldIcon} from '@primer/octicons-react'
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
 * the `(bot)` identifier tag, and the blue `(push-pill: SHA)` are composed from
 * Primer primitives (`Avatar square`, `Label variant="secondary"`, and a
 * `<code>`-wrapped styled `Link`) to match the live ERB.
 */

// Live ERB uses the bundled `modules/site/dependabot-icon.png`; this is the
// public dependabot[bot] avatar (square Dependabot logo) for Storybook.
const DEPENDABOT_AVATAR = 'https://avatars.githubusercontent.com/u/27347476?v=4'

/**
 * Dependabot actor — `DependabotAlerts::TimelineItems::ActorComponent` in
 * `:dependabot` mode (`actor_component.html.erb`):
 *   square avatar + bold `dependabot` docs link + `(bot)` identifier tag.
 * (`bot_identifier_tag` → `<span class="Label Label--secondary">bot</span>`.)
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
 * (`bg: :accent, px: 2, py: 1, border_radius: 3`) → blue rounded pill with the
 * 7-char `after` SHA (single commit) or a `before..after` range (multi-commit).
 */
const PushPill = ({sha}: {sha: string}) => (
  <code className={classes.PushPill}>
    <Link href="#" className={classes.PushPillLink}>
      {sha}
    </Link>
  </code>
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
