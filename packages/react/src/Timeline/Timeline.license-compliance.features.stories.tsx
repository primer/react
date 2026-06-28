import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {ShieldIcon} from '@primer/octicons-react'
import Avatar from '../Avatar'
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
 * PROOF-OF-PATTERN SCOPE (this file, for now): only the `opened` group is built
 * below, to validate the template before scaling to the remaining eight groups.
 * Helpers to add as those groups land: an `EventComment` sub-row (live
 * `shared.tsx` renders `<NoteIcon size={16} className="fgColor-muted" /> +
 * <span className="f6 color-fg-muted">{comment}</span>` for review / exception /
 * licenses-added comments — note it uses `NoteIcon`, not the secret-scanning
 * `CommentIcon`), a `PullRequestLink` sub-row, and a `Timeline.Actions`
 * "Review request" button on the latest `review_requested` event (live
 * `AlertTimeline.tsx` only passes `onReviewRequest` to the LAST
 * review_requested event).
 *
 * BADGE COLORS (live per-event components): success (green) `ShieldIcon` —
 * `opened`; done (purple) `ShieldCheckIcon` — `closed`. Per the audit, every
 * other group renders a gray DEFAULT badge (`badgeVariant` undefined →
 * `<Timeline.Badge>` with a muted icon, no solid fill). We render those bare,
 * matching the secret-scanning / Dependabot convention (NOT the Issues
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
