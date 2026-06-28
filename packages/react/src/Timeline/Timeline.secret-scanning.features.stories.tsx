import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {
  AlertIcon,
  CheckCircleIcon,
  CommentIcon,
  MarkGithubIcon,
  PersonIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldSlashIcon,
  SkipIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react'
import type React from 'react'
import Avatar from '../Avatar'
import {Button} from '../Button'
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
 * timeline exists — the migration to React is complete.) The exact event list
 * built below is the full set of cases the live `switch` actually renders; the
 * defined-but-never-dispatched `REVOCATION` event type (no `case`) renders
 * nothing and is intentionally NOT built.
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
 *   Reserved for comment-style events. The badge-row events here do NOT use it —
 *   the live `AlertTimeline.tsx` renders the actor INLINE in the body
 *   (`UserComponent`, or the system `MarkGithubIcon` + "GitHub"), not in the
 *   gutter. We mirror that: actor inline in `Timeline.Body`.
 * - `Timeline.Actions` (right-controls slot, #6678): for buttons on the right
 *   edge. Only the delegated-closure "requested to dismiss" event has right
 *   controls (a "Review request" / "Cancel request" button), so it is the only
 *   group that uses this slot.
 *
 * BADGE COLORS (live `Timeline.Badge variant=`): success (green) — Creation,
 * Reopened; done (purple) — Closed as revoked; danger (red) — Validity active;
 * attention (amber) — Validity unknown; default (gray) — everything else. The
 * live code passes `variant={undefined}` for the gray events, which renders the
 * DEFAULT `Timeline.Badge` (a muted icon on a subtle/borderless circle, NO solid
 * fill). We render those as a BARE `<Timeline.Badge>` to match exactly — none of
 * the secret-scanning gray events is a solid-gray badge, so (unlike the Issues
 * "not planned" variant) the `--timelineBadge-bgColor` hook is not used here.
 *
 * ACCESSIBILITY NOTE: none of the secret-scanning events render an in-text
 * `<Link>` — actors and resolution reasons are BOLD TEXT (the live
 * `UserComponent` uses a `text-bold` span, not a profile link, and reasons are
 * bolded plain text). So the axe `link-in-text-block` rule (which failed the
 * Dependabot CI for underline-less in-text links) is never exercised by this
 * surface. Any future in-text link added here must use `inline`/bold.
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'
const SIX7_AVATAR = 'https://avatars.githubusercontent.com/six7'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/hubot'

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

/**
 * User actor — live `UserComponent` (`components/shared/UserComponent.tsx`):
 * a 16px CIRCLE `GitHubAvatar` + bold `display_login` (`<span class="ml-1
 * text-bold">`). Note the login is bold TEXT, not a link (hovercard attrs only),
 * so there is no in-text-link a11y concern. Used by every non-system event.
 */
const UserActor = ({login = 'monalisa', src = MONALISA_AVATAR}: {login?: string; src?: string}) => (
  <>
    <Avatar src={src} size={16} alt="" className={classes.InlineAvatar} />
    <span className={classes.ActorName}>{login}</span>
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

/**
 * Optional comment sub-row — live `TimelineItemBody` renders a
 * `<div class="… mt-1"><CommentIcon size={12} class="fgColor-muted" /> <span
 * class="f6">{comment}</span></div>` below the body whenever any of
 * `resolution.comment` / `exemption_request.requester_comment` /
 * `exemption_response.reviewer_comment` is present. Shared by the Resolution
 * closures and the delegated-closure request/approve/deny events.
 */
const CommentSubRow = ({children}: {children: React.ReactNode}) => (
  <div className={classes.CommentRow}>
    <Octicon icon={CommentIcon} size={12} className={classes.CommentRowIcon} />
    <span>{children}</span>
  </div>
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

/**
 * The Resolution event group — `SecretScanTimeline.eventResolution` (audit § 2).
 *
 * Source: `case TimelineEventType.Resolution` in `AlertTimeline.tsx`. Two
 * shapes share this event type:
 * - REOPENED (`resolution.type === 'reopened'`): `SyncIcon` on `success`
 *   (green), copy "reopened this". The live code renders a `Timeline.Break`
 *   immediately BEFORE this item (sibling-selector CSS) — reproduced here.
 * - CLOSED (any other `resolution.type`): copy "closed this as {reason}", where
 *   `{reason}` is `resolutionText(resolution.type)` rendered as BOLD TEXT (not a
 *   link). Only `revoked` gets the special `ShieldCheckIcon` on `done` (purple);
 *   every other reason uses `ShieldSlashIcon` on the default (gray) badge.
 *
 * The seven closed reasons are exactly the `resolutionText()` outputs (live
 * `helper.ts`): revoked, false positive, won't fix, used in tests, pattern
 * deleted, pattern edited, ignored by configuration. Each may carry an optional
 * `(comment)` sub-row from `resolution.comment` — demonstrated on the revoked
 * variant. Actor is always the user.
 */
export const EventResolution = () => (
  <div className={classes.RealisticTimeline}>
    {/* Closed as revoked — the only reason with the purple `done` / ShieldCheck
        badge. Shown WITH an optional resolution-comment sub-row. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as revoked</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} aria-label="Closed as revoked" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'closed this as '}
            <strong>revoked</strong> <Time date="2022-07-26T11:46:07Z" />
            <CommentSubRow>Rotated the leaked token and confirmed the provider revoked it.</CommentSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as false positive — gray (default) ShieldSlash badge. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as false positive</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Closed as false positive" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'closed this as '}
            <strong>false positive</strong> <Time date="2022-07-25T09:12:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as won't fix */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as won&apos;t fix</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Closed as won't fix" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'closed this as '}
            <strong>won&apos;t fix</strong> <Time date="2022-07-24T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as used in tests */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as used in tests</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Closed as used in tests" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'closed this as '}
            <strong>used in tests</strong> <Time date="2022-07-23T11:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as pattern deleted */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as pattern deleted</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Closed as pattern deleted" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'closed this as '}
            <strong>pattern deleted</strong> <Time date="2022-07-22T14:18:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as pattern edited */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as pattern edited</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Closed as pattern edited" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'closed this as '}
            <strong>pattern edited</strong> <Time date="2022-07-21T08:02:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Closed as ignored by configuration (resolution type `hidden_by_config`) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Closed as ignored by configuration</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} aria-label="Closed as ignored by configuration" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'closed this as '}
            <strong>ignored by configuration</strong> <Time date="2022-07-20T10:33:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Reopened — SyncIcon on success (green), preceded by a Timeline.Break.
        The live code emits the Break as a sibling immediately BEFORE the
        reopened Item so the sibling-selector CSS applies. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reopened</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Break />
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} aria-label="Reopened" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'reopened this '}
            <Time date="2022-07-27T12:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Push-protection / bypass event group —
 * `SecretScanTimeline.eventPushProtection` (audit § 3).
 *
 * Source: `case TimelineEventType.Bypass`,
 * `DelegatedBypassRequestOpened`, `DelegatedBypassRequestApproved` in
 * `AlertTimeline.tsx`. All three use the user actor and the default (gray)
 * badge; only the icon + copy differ. The two delegated variants render only
 * for repos with delegated bypass enabled (backend-gated org feature).
 */
export const EventBypass = () => (
  <div className={classes.RealisticTimeline}>
    {/* Bypassed — AlertIcon, default (gray) badge */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Bypassed push protection</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={AlertIcon} aria-label="Bypassed push protection" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'bypassed push protection '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Bypass requested — CommentIcon. Delegated bypass: only renders when the
        repo has delegated bypass enabled. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Bypass requested (delegated bypass enabled)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} aria-label="Requested bypass privileges" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'requested bypass privileges '}
            <Time date="2022-07-26T11:50:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Bypass approved — CheckCircleIcon. Delegated bypass: gated as above. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Bypass approved (delegated bypass enabled)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckCircleIcon} aria-label="Approved a bypass" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'approved a bypass '}
            <Time date="2022-07-26T12:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Validity-change event group — `SecretScanTimeline.eventValidity`
 * (audit § 4).
 *
 * Source: `ValidityChangeTimelineEvent` in `AlertTimeline.tsx`. The validity
 * bucket drives the badge + icon: active -> `AlertIcon` on `danger` (red);
 * inactive -> `SkipIcon` on default (gray); unknown -> `AlertIcon` on
 * `attention` (amber). Whether the change is AUTOMATED (no `event.actor` ->
 * GitHub system actor + "verified this secret is …" / "is unable to determine
 * …") or MANUAL (`event.actor` present -> user actor + "set validity to …") is
 * decided purely by `!event.actor`. Both forms are shown per bucket.
 */
export const EventValidityChange = () => (
  <div className={classes.RealisticTimeline}>
    {/* Active — automated (GitHub), AlertIcon on danger (red) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Validity: active (automated)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="danger">
            <Octicon icon={AlertIcon} aria-label="Validity active" />
          </Timeline.Badge>
          <Timeline.Body>
            <GitHubActor />
            {'verified this secret is active '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Active — manual (user), same danger badge */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Validity: active (manual)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="danger">
            <Octicon icon={AlertIcon} aria-label="Validity active" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'set validity to active '}
            <Time date="2022-07-26T13:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Inactive — automated (GitHub), SkipIcon on default (gray) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Validity: inactive (automated)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SkipIcon} aria-label="Validity inactive" />
          </Timeline.Badge>
          <Timeline.Body>
            <GitHubActor />
            {'verified this secret is inactive '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Inactive — manual (user) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Validity: inactive (manual)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SkipIcon} aria-label="Validity inactive" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'set validity to inactive '}
            <Time date="2022-07-26T13:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unknown — automated (GitHub), AlertIcon on attention (amber) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Validity: unknown (automated)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="attention">
            <Octicon icon={AlertIcon} aria-label="Validity unknown" />
          </Timeline.Badge>
          <Timeline.Body>
            <GitHubActor />
            {'is unable to determine the validity of this secret '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unknown — manual (user) */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Validity: unknown (manual)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="attention">
            <Octicon icon={AlertIcon} aria-label="Validity unknown" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'set validity to unknown '}
            <Time date="2022-07-26T13:10:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Report event group — `SecretScanTimeline.eventReport` (audit § 5).
 *
 * Source: `case TimelineEventType.Report` in `AlertTimeline.tsx`. Badge:
 * `ShieldCheckIcon` on the default (gray) badge. Copy: "reported this secret".
 * The case does NOT pass `isGitHubActor`, so the actor is the USER (not the
 * GitHub system actor) — confirmed against the live switch.
 */
export const EventReport = () => (
  <div className={classes.RealisticTimeline}>
    {/* Reported — ShieldCheckIcon, default (gray) badge, user actor */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reported</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldCheckIcon} aria-label="Reported" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'reported this secret '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The delegated-closure (dismissal) event group —
 * `SecretScanTimeline.eventClosureRequest` (audit § 6).
 *
 * Source: `case TimelineEventType.DelegatedClosureRequestOpened` /
 * `…Approved` / `…Rejected` / `…Cancelled` in `AlertTimeline.tsx`. This is the
 * org-level delegated-dismissal feature (backend-gated). All four use the user
 * actor and the default (gray) badge; icon + copy differ:
 * - Opened -> `CommentIcon`, "requested to dismiss this[ as {reason}]"
 * - Approved -> `CheckCircleIcon`, "approved dismissal"
 * - Rejected -> `XIcon`, "denied dismissal"
 * - Cancelled -> `SkipIcon`, "cancelled request to dismiss"
 *
 * RIGHT CONTROLS (`Timeline.Actions`): the Opened event shows, while the request
 * is pending & not expired, EITHER a small primary "Review request" button
 * (shown to reviewers via the `show_closure_request_review_buttons` payload
 * flag, which opens `ClosureRequestReviewButtons`' review dialog) OR a small
 * invisible "Cancel request" button (shown to the requester via
 * `show_closure_request_cancel_button`). They are driven by two independent,
 * viewer-specific payload flags — mutually exclusive per viewer — so both
 * variants are shown below. The optional `(comment)` sub-row carries the
 * requester comment (Opened) or reviewer comment (Approved / Denied).
 */
export const EventClosureRequest = () => (
  <div className={classes.RealisticTimeline}>
    {/* Requested — with the reviewer-facing "Review request" primary button and
        a requester comment sub-row. The `[ as {reason}]` clause is the
        un-bolded `resolutionText(exemption_request.reason)`. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal requested (reviewer view)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} aria-label="Requested to dismiss" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'requested to dismiss this as false positive '}
            <Time date="2022-07-26T11:46:07Z" />
            <CommentSubRow>This token only ever pointed at our throwaway sandbox.</CommentSubRow>
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small" variant="primary">
              Review request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Requested — requester view: the invisible "Cancel request" button. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal requested (requester view)</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} aria-label="Requested to dismiss" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'requested to dismiss this as false positive '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small" variant="invisible">
              Cancel request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Approved — CheckCircleIcon, with a reviewer comment sub-row. */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal approved</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckCircleIcon} aria-label="Approved dismissal" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="six7" src={SIX7_AVATAR} />
            {'approved dismissal '}
            <Time date="2022-07-26T12:30:00Z" />
            <CommentSubRow>Confirmed — safe to dismiss.</CommentSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Denied — XIcon */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal denied</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} aria-label="Denied dismissal" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="six7" src={SIX7_AVATAR} />
            {'denied dismissal '}
            <Time date="2022-07-26T12:35:00Z" />
            <CommentSubRow>Please rotate the secret before dismissing.</CommentSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Cancelled — SkipIcon */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Dismissal request cancelled</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SkipIcon} aria-label="Cancelled request to dismiss" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'cancelled request to dismiss '}
            <Time date="2022-07-26T12:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

/**
 * The Assignment event group — `SecretScanTimeline.eventAssignments`
 * (audit § 7).
 *
 * Source: `AssignmentChangeTimelineEvent` in `AlertTimeline.tsx`. Badge:
 * `PersonIcon` on the default (gray) badge. Unlike the avatar-less PR/Issue
 * assignment pattern, the actor AND the assignee/unassignee are each rendered
 * with an avatar via `UserComponent` (matching Dependabot). The five shapes are
 * derived from which of `assigned_user` / `unassigned_user` is present and
 * whether the actor equals the (un)assignee (self vs other).
 */
export const EventAssignment = () => (
  <div className={classes.RealisticTimeline}>
    {/* Self-assigned — actor === assignee */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Self-assigned</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Assignment changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'self-assigned this '}
            <Time date="2022-07-26T11:46:07Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Assigned someone else — both actor + assignee avatars */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Assigned another user</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Assignment changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'assigned '}
            <UserActor login="six7" src={SIX7_AVATAR} /> <Time date="2022-07-26T11:50:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Self-unassigned — actor removed their own assignment */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Removed own assignment</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Assignment changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'removed their assignment '}
            <Time date="2022-07-26T11:55:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Unassigned someone else */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Unassigned another user</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Assignment changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'unassigned '}
            <UserActor login="six7" src={SIX7_AVATAR} /> <Time date="2022-07-26T12:00:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Assigned one user and unassigned another in a single event */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Assigned and unassigned</h3>
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} aria-label="Assignment changed" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor />
            {'assigned '}
            <UserActor login="six7" src={SIX7_AVATAR} />
            {' and unassigned '}
            <UserActor login="hubot" src={HUBOT_AVATAR} /> <Time date="2022-07-26T12:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)
