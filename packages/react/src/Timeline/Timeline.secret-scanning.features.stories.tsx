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
import {Button} from '../Button'
import Octicon from '../Octicon'
import {EventSubRow, MutedTime, RealisticTimeline, UserActor, VariantSection} from './internal/timelineStoryHelpers'

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
 *
 * The badge octicons are DECORATIVE — they are rendered bare (no `aria-label`,
 * so Primer defaults them to `aria-hidden`), exactly as the live
 * `AlertTimeline.tsx` renders them. The adjacent `Timeline.Body` sentence is the
 * sole accessible description of each event, so the badge icon must NOT restate
 * it (a labelled badge would make screen readers announce the event twice).
 */

// Demo assignee avatars for the Assignment group. All other actors fall back to
// the shared `UserActor` default avatar (monalisa).
const SIX7_AVATAR = 'https://avatars.githubusercontent.com/u/4548309?v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/u/480938?v=4'

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
  <RealisticTimeline>
    {/* Created — GitHub system actor, ShieldIcon on success (green) */}
    <VariantSection label="Created">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="GitHub" icon={MarkGithubIcon} />
            {'opened this alert '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
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
  <RealisticTimeline>
    {/* Closed as revoked — the only reason with the purple `done` / ShieldCheck
        badge. Shown WITH an optional resolution-comment sub-row. */}
    <VariantSection label="Closed as revoked">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>revoked</strong> <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
            <EventSubRow icon={CommentIcon} iconSize={12}>
              Rotated the leaked token and confirmed the provider revoked it.
            </EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as false positive — gray (default) ShieldSlash badge. */}
    <VariantSection label="Closed as false positive">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>false positive</strong> <MutedTime date={new Date('2022-07-25T09:12:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as won't fix */}
    <VariantSection label="Closed as won't fix">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>won&apos;t fix</strong> <MutedTime date={new Date('2022-07-24T16:40:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as used in tests */}
    <VariantSection label="Closed as used in tests">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>used in tests</strong> <MutedTime date={new Date('2022-07-23T11:05:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as pattern deleted */}
    <VariantSection label="Closed as pattern deleted">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>pattern deleted</strong> <MutedTime date={new Date('2022-07-22T14:18:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as pattern edited */}
    <VariantSection label="Closed as pattern edited">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>pattern edited</strong> <MutedTime date={new Date('2022-07-21T08:02:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as ignored by configuration (resolution type `hidden_by_config`) */}
    <VariantSection label="Closed as ignored by configuration">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>ignored by configuration</strong> <MutedTime date={new Date('2022-07-20T10:33:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Reopened — SyncIcon on success (green), preceded by a Timeline.Break.
        The live code emits the Break as a sibling immediately BEFORE the
        reopened Item so the sibling-selector CSS applies. We include the
        preceding (closed) Item here so the Break renders BETWEEN two items, as
        it does in product — mirroring the live "break between events"
        placement rather than leaving the Break as a stray first child. */}
    <VariantSection label="Reopened">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldSlashIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'closed this as '}
            <strong>false positive</strong> <MutedTime date={new Date('2022-07-26T18:20:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
        <Timeline.Break />
        <Timeline.Item>
          <Timeline.Badge variant="success">
            <Octicon icon={SyncIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'reopened this '}
            <MutedTime date={new Date('2022-07-27T12:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
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
  <RealisticTimeline>
    {/* Bypassed — AlertIcon, default (gray) badge */}
    <VariantSection label="Bypassed push protection">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={AlertIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'bypassed push protection '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Bypass requested — CommentIcon. Delegated bypass: only renders when the
        repo has delegated bypass enabled. */}
    <VariantSection label="Bypass requested (delegated bypass enabled)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'requested bypass privileges '}
            <MutedTime date={new Date('2022-07-26T11:50:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Bypass approved — CheckCircleIcon. Delegated bypass: gated as above. */}
    <VariantSection label="Bypass approved (delegated bypass enabled)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckCircleIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'approved a bypass '}
            <MutedTime date={new Date('2022-07-26T12:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
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
  <RealisticTimeline>
    {/* Active — automated (GitHub), AlertIcon on danger (red) */}
    <VariantSection label="Validity: active (automated)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="danger">
            <Octicon icon={AlertIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="GitHub" icon={MarkGithubIcon} />
            {'verified this secret is active '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Active — manual (user), same danger badge */}
    <VariantSection label="Validity: active (manual)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="danger">
            <Octicon icon={AlertIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'set validity to active '}
            <MutedTime date={new Date('2022-07-26T13:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Inactive — automated (GitHub), SkipIcon on default (gray) */}
    <VariantSection label="Validity: inactive (automated)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SkipIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="GitHub" icon={MarkGithubIcon} />
            {'verified this secret is inactive '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Inactive — manual (user) */}
    <VariantSection label="Validity: inactive (manual)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SkipIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'set validity to inactive '}
            <MutedTime date={new Date('2022-07-26T13:05:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unknown — automated (GitHub), AlertIcon on attention (amber) */}
    <VariantSection label="Validity: unknown (automated)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="attention">
            <Octicon icon={AlertIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="GitHub" icon={MarkGithubIcon} />
            {'is unable to determine the validity of this secret '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unknown — manual (user) */}
    <VariantSection label="Validity: unknown (manual)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge variant="attention">
            <Octicon icon={AlertIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'set validity to unknown '}
            <MutedTime date={new Date('2022-07-26T13:10:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
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
  <RealisticTimeline>
    {/* Reported — ShieldCheckIcon, default (gray) badge, user actor */}
    <VariantSection label="Reported">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'reported this secret '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
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
  <RealisticTimeline>
    {/* Requested — with the reviewer-facing "Review request" primary button and
        a requester comment sub-row. The `[ as {reason}]` clause is the
        un-bolded `resolutionText(exemption_request.reason)`. */}
    <VariantSection label="Dismissal requested (reviewer view)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'requested to dismiss this as false positive '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
            <EventSubRow icon={CommentIcon} iconSize={12}>
              This token only ever pointed at our throwaway sandbox.
            </EventSubRow>
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small" variant="primary">
              Review request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Requested — requester view: the invisible "Cancel request" button. */}
    <VariantSection label="Dismissal requested (requester view)">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'requested to dismiss this as false positive '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small" variant="invisible">
              Cancel request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Approved — CheckCircleIcon, with a reviewer comment sub-row. */}
    <VariantSection label="Dismissal approved">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={CheckCircleIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="six7" src={SIX7_AVATAR} size={16} />
            {'approved dismissal '}
            <MutedTime date={new Date('2022-07-26T12:30:00Z')} />
            <EventSubRow icon={CommentIcon} iconSize={12}>
              Confirmed — safe to dismiss.
            </EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Denied — XIcon */}
    <VariantSection label="Dismissal denied">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={XIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor login="six7" src={SIX7_AVATAR} size={16} />
            {'denied dismissal '}
            <MutedTime date={new Date('2022-07-26T12:35:00Z')} />
            <EventSubRow icon={CommentIcon} iconSize={12}>
              Please rotate the secret before dismissing.
            </EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Cancelled — SkipIcon */}
    <VariantSection label="Dismissal request cancelled">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={SkipIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'cancelled request to dismiss '}
            <MutedTime date={new Date('2022-07-26T12:40:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
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
  <RealisticTimeline>
    {/* Self-assigned — actor === assignee */}
    <VariantSection label="Self-assigned">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'self-assigned this '}
            <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Assigned someone else — both actor + assignee avatars */}
    <VariantSection label="Assigned another user">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'assigned '}
            <UserActor login="six7" src={SIX7_AVATAR} size={16} /> <MutedTime date={new Date('2022-07-26T11:50:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Self-unassigned — actor removed their own assignment */}
    <VariantSection label="Removed own assignment">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'removed their assignment '}
            <MutedTime date={new Date('2022-07-26T11:55:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Unassigned someone else */}
    <VariantSection label="Unassigned another user">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'unassigned '}
            <UserActor login="six7" src={SIX7_AVATAR} size={16} /> <MutedTime date={new Date('2022-07-26T12:00:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Assigned one user and unassigned another in a single event */}
    <VariantSection label="Assigned and unassigned">
      <Timeline aria-label="Secret scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={PersonIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor size={16} />
            {'assigned '}
            <UserActor login="six7" src={SIX7_AVATAR} size={16} />
            {' and unassigned '}
            <UserActor login="hubot" src={HUBOT_AVATAR} size={16} />{' '}
            <MutedTime date={new Date('2022-07-26T12:05:00Z')} />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
)
