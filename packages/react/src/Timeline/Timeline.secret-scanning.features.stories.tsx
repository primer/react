import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {MarkGithubIcon, ShieldIcon} from '@primer/octicons-react'
import Octicon from '../Octicon'
import RelativeTime from '../RelativeTime'
import classes from './Timeline.secret-scanning.features.stories.module.css'

/**
 * Secret Scanning alert Timeline event examples (Phase 2 of github/primer#6663).
 *
 * These stories recreate GitHub's live secret-scanning-alert-timeline events
 * using the Primer `Timeline` compositional slots. They mirror the established
 * Issues (`Timeline.issues.features.stories.tsx`) and Dependabot
 * (`Timeline.dependabot.features.stories.tsx`) stories and are sourced from the
 * `timeline-audit` inventory (`secret-scanning-timeline-events-for-figma.md`),
 * verified against the live React implementation.
 *
 * SOURCE OF TRUTH — Secret Scanning is FULLY React (NOT ERB). The alert show
 * page is a React SPA in `github/github-ui`, package
 * `packages/secret-scanning-alerts/`. The timeline is rendered by
 * `components/show/AlertTimeline.tsx`, whose `switch (event.type)` is the
 * authoritative dispatch for every event's badge variant + octicon + copy. It
 * already composes Primer React `Timeline` + `Timeline.Badge variant=`, so the
 * badge colors map directly. The actor is rendered by
 * `components/shared/UserComponent.tsx` (16px circle avatar + bold login); the
 * system actor is `MarkGithubIcon` + bold "GitHub". (No ERB secret-scanning
 * timeline exists — the migration to React is complete.)
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
 * SLOT USAGE (Phase 1 slots — same convention as the Issues / Dependabot groups):
 * - `Timeline.Avatar` (gutter slot, #6677): the 40px LEFT-GUTTER avatar.
 *   Reserved for comment-style events. Badge-row events like Created do NOT use
 *   it — the live `AlertTimeline.tsx` renders the actor INLINE in the body
 *   (`UserComponent`, or the system `MarkGithubIcon` + "GitHub"), not in the
 *   gutter. We mirror that: actor inline in `Timeline.Body`.
 * - `Timeline.Actions` (right-controls slot, #6678): for buttons on the right
 *   edge (e.g. the delegated-closure "Review request" / "Cancel request"
 *   buttons). Created has no right controls, so it is omitted here.
 *
 * BADGE COLORS (live `Timeline.Badge variant=`): success (green) — Creation,
 * Reopened; done (purple) — Closed as revoked; danger (red) — Validity active;
 * attention (amber) — Validity unknown; default (gray) — everything else. Where
 * the live code uses a default (gray) badge with no solid background, downstream
 * groups should drive `--timelineBadge-bgColor` inline (as the Issues "not
 * planned" variant does) rather than relying on a non-existent `neutral` variant.
 */

/**
 * System "GitHub" actor — live `TimelineItemBody` (`AlertTimeline.tsx`) in
 * `isGitHubActor` mode renders `<MarkGithubIcon /> <span class="ml-1
 * text-bold">GitHub</span>` (no avatar). Used by the Created event and by
 * automated validity changes.
 */
const GitHubActor = () => (
  <>
    <Octicon icon={MarkGithubIcon} className={classes.ActorIcon} />
    <span className={classes.ActorName}>GitHub</span>
  </>
)

// Muted relative timestamp. The live secret-scanning `TimelineItemBody` renders
// a plain `RelativeTime` with no link wrapper — muted text only (matching the
// Dependabot timeline, unlike the Issues `Ago` deep-link).
const Time = ({date}: {date: string}) => (
  <span className={classes.Timestamp}>
    <RelativeTime date={new Date(date)} format="relative" />
  </span>
)

export default {
  title: 'Components/Timeline/Events/Secret Scanning',
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
 * The Created event group — `SecretScanTimeline.eventCreated` (audit § 1).
 *
 * Source: `case TimelineEventType.Creation` in `AlertTimeline.tsx` — the only
 * event that uses `isGitHubActor` unconditionally. The actor is ALWAYS the
 * GitHub system actor. Badge: `ShieldIcon` on `success` (green) — the live code
 * renders `<Timeline.Badge variant="success" icon={<ShieldIcon />}>`. Copy is a
 * fixed `"opened this alert"` + the relative time.
 *
 * Single variant — the live `Creation` case has exactly one rendering (no
 * source / from-PR / from-push branches like Dependabot's Opened).
 */
export const EventCreated = () => (
  <div className={classes.RealisticTimeline}>
    {/* Created — GitHub system actor, ShieldIcon on success (green) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Created</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} aria-label="Created" />
          </Timeline.Badge>
          <Timeline.Body>
            <GitHubActor />
            {'opened this alert '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)
