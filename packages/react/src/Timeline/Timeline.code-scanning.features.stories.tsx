import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {
  CheckIcon,
  CommentIcon,
  DotFillIcon,
  GitBranchIcon,
  NoteIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldXIcon,
  XIcon,
} from '@primer/octicons-react'
import {Button} from '../Button'
import Label from '../Label'
import Link from '../Link'
import Octicon from '../Octicon'
import {
  EventSubRow,
  Examples,
  MutedTime,
  RealisticTimeline,
  UserActor,
  VariantSection,
} from './internal/timelineStoryHelpers'
import {CODE_SCANNING_TAXONOMY, actorTypeForLogin, toEventDataAttributes, type CodeScanningEventType} from './taxonomy'
import classes from './Timeline.code-scanning.features.stories.module.css'

/**
 * Code Scanning alert Timeline event examples (Phase 2 of github/primer#6663).
 *
 * These stories recreate GitHub's live code-scanning-alert-timeline events using
 * the Primer `Timeline` compositional slots. They mirror the established Issues
 * (`Timeline.issues.features.stories.tsx`), Dependabot
 * (`Timeline.dependabot.features.stories.tsx`), and Secret Scanning
 * (`Timeline.secret-scanning.features.stories.tsx`) stories, and are sourced
 * from the `timeline-audit` inventory
 * (`code-scanning-timeline-events-for-figma.md`), verified against the live ERB.
 *
 * SOURCE OF TRUTH — Code Scanning is NOT (yet) migrated to React. The alert
 * timeline is entirely SERVER-RENDERED ERB (ViewComponent), exactly like the
 * Dependabot surface. The events are dispatched by
 * `CodeScanning::TimelineComponent` (`app/components/code_scanning/
 * timeline_component.html.erb`), whose `case timeline_event.type` is the
 * authoritative event list. Every row is rendered through the shared
 * `CodeScanning::TimelineItemComponent` (`timeline_item_component.html.erb`),
 * which wraps a `Primer::Beta::TimelineItem` + badge + body and appends optional
 * supplementary sub-rows (commit card, path, workflow-run, resolution/reviewer
 * comment). There is no React equivalent in `github/github-ui`. So each event
 * below is translated faithfully from the live ERB into Primer React, with the
 * ERB source noted inline.
 *
 * SCOPE: These are Storybook-only examples by design. They are intentionally
 * NOT wired into components-json / the primer.style docs page (do NOT add this
 * file to `Timeline.docs.json` or `build.ts`). Individual timeline events are
 * not consumer-facing components — the primer.style Timeline page reflects the
 * base `Timeline` component's own stories, and any docs-site representation is a
 * Phase 3 consideration via base-component story changes, out of scope here.
 *
 * This file ships all six Code Scanning event groups: **Detected** (alert
 * created / appeared / reappeared), **Fixed / Config-deleted**, **Closed by
 * user**, **Reopened**, **Dismissal requested**, and **Dismissal reviewed**.
 * Each renders as its own story export.
 *
 * AUTHORITATIVE EVENT LIST (live `timeline_component.html.erb` dispatch), for
 * planning the remaining groups:
 *  - ALERT_CREATED — shield (default), bold "First detected in commit", no actor
 *  - ALERT_APPEARED_IN_BRANCH — git-branch (default), bold "Appeared in branch
 *    {ref}", no actor
 *  - ALERT_REAPPEARED — shield (default), bold "Reappeared in branch {ref}", no
 *    actor
 *  - ALERT_CLOSED_BECAME_FIXED — shield-check on `done` (SOLID purple) when the
 *    event ref is the selected ref, else `check` (default); bold "Fixed in
 *    branch {ref}", no actor
 *  - ALERT_CLOSED_BECAME_OUTDATED — same conditional shield-check/check badge;
 *    bold "Closed as {category} configuration was deleted in branch {ref}", no
 *    actor
 *  - ALERT_CLOSED_BY_USER — shield-x on `danger` (SOLID red); USER actor;
 *    "closed this as {reason}"
 *  - ALERT_REOPENED_BY_USER — dot-fill on `success` (SOLID green); USER actor;
 *    "reopened this"
 *  - ALERT_DISMISSAL_REQUESTED — comment (default); USER actor; "requested to
 *    dismiss this as {reason}"; carries the Review-request button
 *  - ALERT_DISMISSAL_REVIEWED — check/x (default); USER actor; "approved /
 *    denied dismissal"
 *
 * FEATURE-GATED PATHS: the audit flagged the two delegated-dismissal events
 * (DISMISSAL_REQUESTED / DISMISSAL_REVIEWED) as only rendering when
 * `delegated_dismissal_enabled?`; the Review-request button itself is further
 * gated on `timeline_event.show_dismissal_actions`. These are dormant on most
 * repos — worth confirming the live gating before building those groups.
 *
 * BADGE MODEL (live `timeline_item_component.html.erb` →
 * `item.with_badge(bg: @background, color: @color, icon: @icon)`, defaulting to
 * `background: :subtle, color: :default`): only the events that explicitly pass
 * a `background:` (`done_emphasis` / `danger_emphasis` / `success_emphasis`)
 * render a SOLID-color badge → `Timeline.Badge variant=`. Every other event —
 * including the entire Detected group below — passes only an `icon:`, so it
 * renders as a BARE `<Timeline.Badge>` (default gray circle, NO solid fill). We
 * render those as a bare badge to match exactly — the `--timelineBadge-bgColor`
 * hook is intentionally NOT used.
 *
 * ACTOR TREATMENT: Code Scanning splits cleanly into SYSTEM events (the whole
 * Detected group, Fixed, Config-deleted) which render NO actor — just the bold
 * body text — and USER events (Closed by user, Reopened, both Dismissal events)
 * which render a CIRCLE 20px avatar + bold `display_login` profile link. The
 * Detected group below is system-only, so no actor and no in-text link appears.
 *
 * ACCESSIBILITY NOTE: the SYSTEM events (Detected, Fixed, Config-deleted) render
 * no in-text `<Link>` in the main body (bold text only); their only links are in
 * the workflow sub-row. The USER events (Closed by user, Reopened, both Dismissal
 * events) DO render an in-text profile `<Link>` via `UserActor` — it carries the
 * bold weight as its non-color differentiator, which is what the axe
 * `link-in-text-block` rule (WCAG 1.4.1) requires in high-contrast themes. Any
 * further in-text link added here must likewise use bold or `inline` styling.
 *
 * RIGHT CONTROLS (`Timeline.Actions`): the shared row renders a right-aligned
 * tool-version `Primer::Beta::Label(scheme: :secondary)` whenever the event
 * carries a `tool_version` (the live title is
 * `"Label: #{tool_version_prefix} #{tool_version}"`, e.g. "Label: Tool version
 * 2.15.0" or "Label: Tool upgraded to X"). It is `margin-left: auto` inside the
 * body in the ERB; we map it to the `Timeline.Actions` right-controls slot. The
 * "First detected" variant below demonstrates it.
 */

/**
 * Bold branch ref — live `formatted_ref_name` renders
 * `Primer::Beta::Text.new(font_weight: :bold, classes: "branch-name")`. Dotcom
 * defines no `.branch-name` rule, so it is plain bold text (NOT the monospace
 * `BranchName` pill).
 */
const Ref = ({name}: {name: string}) => <span className={classes.RefName}>{name}</span>

// Muted relative timestamp — the shared `MutedTime` helper (github/primer#6828).
// The live shared `timeline_item_component` renders a plain `time_ago_in_words_js`
// (no link wrapper) — muted text only. A leading space preserves the gap the old
// local `.Timestamp` class provided via `margin-left`.
const Time = ({date}: {date: string}) => (
  <>
    {' '}
    <MutedTime date={new Date(date)} />
  </>
)

/**
 * Subtle gray monospace pill — live `Primer::Beta::Truncate.new(bg: :subtle,
 * font_family: :mono, font_size: 6, border_radius: 1)`. Used both inline mid-copy
 * (the Config-deleted `{category}`) and after "in configuration" (`ConfigPill`).
 */
const MonoPill = ({children}: {children: React.ReactNode}) => <span className={classes.ConfigPill}>{children}</span>

/**
 * "in configuration {category}" inline pill — live `show_analysis_origin?` rows
 * render the `MonoPill` after the literal " in configuration". Only shown when
 * the alert has more than one analysis category (`has_more_than_one_category?`).
 */
const ConfigPill = ({category}: {category: string}) => (
  <>
    {' in configuration'}
    <MonoPill>{category}</MonoPill>
  </>
)

/**
 * Optional supplementary sub-row below a detection event. Live ERB renders these
 * as a condensed `Primer::Beta::TimelineItem(condensed: true, font_size: 6,
 * classes: "tmp-pl-5")`. We mirror the established Dependabot / Secret Scanning
 * precedent and compose the sub-row as a small muted block inside
 * `Timeline.Body` rather than a badge-less Timeline.Item.
 */
const SubRow = ({children}: {children: React.ReactNode}) => <div className={classes.SubRow}>{children}</div>

/**
 * Per-row taxonomy `data-*` attributes (Phase 3 tagging, github/primer#6664,
 * epic #6654). Projects a Code Scanning leaf event type through the shared
 * `toEventDataAttributes` serializer from the taxonomy module (primer/react#8180),
 * mirroring the License Compliance pilot (primer/react#8216). `category` and
 * `visibility` are derived FROM `CODE_SCANNING_TAXONOMY` so the story never
 * hand-maintains them. Pass the row's rendered `UserActor` login for USER events
 * (resolves `data-actor-type` via `actorTypeForLogin`); omit it for SYSTEM rows
 * so `data-actor-type` is left off entirely. Spread the result onto each
 * `Timeline.Item`.
 */
const codeScanningAttrs = (type: CodeScanningEventType, login?: string) =>
  toEventDataAttributes({
    scope: 'code-scanning',
    type,
    category: CODE_SCANNING_TAXONOMY[type].category,
    visibility: CODE_SCANNING_TAXONOMY[type].visibility,
    actorType: login ? actorTypeForLogin(login) : undefined,
  })

export default {
  title: 'Components/Timeline/Events/Code Scanning',
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
 * The Detected event group — `CodeScanTimeline.eventDetected` (audit § 1).
 *
 * Source: the `ALERT_CREATED`, `ALERT_APPEARED_IN_BRANCH`, and `ALERT_REAPPEARED`
 * cases in `timeline_component.html.erb`. All three are SYSTEM events with NO
 * actor — the body is bold text only (`item.with_body(font_weight: :bold)`) —
 * and all three pass only an `icon:` to `with_badge`, so they render as a BARE
 * `<Timeline.Badge>` (default gray circle, no solid fill).
 *
 * Three variants, differing by icon, copy, and supplementary sub-row:
 *  - First detected (CREATED): `shield` icon, "First detected in commit"; the
 *    shared row adds a path sub-row and (when present) a tool-version Label.
 *  - Appeared in branch (APPEARED_IN_BRANCH): `git-branch` icon, "Appeared in
 *    branch {ref}"; adds a workflow-run sub-row (this is the only detection
 *    event with `show_timeline_commit?` false — no commit card).
 *  - Reappeared in branch (REAPPEARED): `shield` icon, "Reappeared in branch
 *    {ref}"; demonstrates the optional "in configuration {category}" pill.
 */
export const EventDetected = () => (
  <Examples>
    {/* First detected — ALERT_CREATED. Bare shield badge, bold body, a path
        sub-row, and a right-aligned tool-version Label (Timeline.Actions). */}
    <VariantSection label="First detected in commit">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('detected')}>
          <Timeline.Badge>
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>First detected in commit</span>
            <Time date="2024-01-08T11:46:07Z" />
            {/* Path sub-row — live `show_path?` (CREATED / REAPPEARED): the dir
                prefix (plain) + bold `{file_name}:{start_line} on branch` + bold
                ref. */}
            <SubRow>
              {'src/components/'}
              <span className={classes.SubRowStrong}>Button.tsx:42 on branch</span> <Ref name="main" />
            </SubRow>
          </Timeline.Body>
          <Timeline.Actions>
            {/* Tool-version Label — `Primer::Beta::Label(scheme: :secondary)`,
                right-aligned. The live ERB sets the title to
                `"Label: #{tool_version_prefix} #{tool_version}"`, so the faithful
                title is "Label: Tool version 2.15.0" (the "Label:" prefix is part
                of dotcom's tooltip text, kept verbatim). */}
            <Label variant="secondary" title="Label: Tool version 2.15.0">
              2.15.0
            </Label>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Appeared in branch — ALERT_APPEARED_IN_BRANCH. Bare git-branch badge,
        bold "Appeared in branch {ref}", and a workflow-run sub-row (no commit
        card — `show_timeline_commit?` is false for this event). */}
    <VariantSection label="Appeared in branch">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('appeared')}>
          <Timeline.Badge>
            <Octicon icon={GitBranchIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>Appeared in branch</span> <Ref name="main" />
            <Time date="2024-01-09T09:30:00Z" />
            {/* Workflow-run sub-row — live `show_path?` is false here, so the
                ERB renders the workflow branch: a conclusion octicon + bold run
                link + a mono commit-SHA link. */}
            <SubRow>
              <Octicon icon={ShieldIcon} className={classes.SubRowIconSuccess} aria-label="Workflow succeeded" />
              <Link href="#" className={classes.WorkflowLink}>
                CodeQL #128:
              </Link>{' '}
              Commit
              <Link href="#" className={classes.CommitSha}>
                adfc29a
              </Link>
            </SubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Reappeared in branch — ALERT_REAPPEARED. Bare shield badge, bold
        "Reappeared in branch {ref}", and the optional "in configuration
        {category}" pill (rendered when the alert has more than one category). */}
    <VariantSection label="Reappeared in branch">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('reappeared')}>
          <Timeline.Badge>
            <Octicon icon={ShieldIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>Reappeared in branch</span> <Ref name="main" />
            <ConfigPill category="rust" />
            <Time date="2024-01-10T14:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Fixed / Config-deleted event group — `CodeScanTimeline.eventFixed`
 * (audit § 2).
 *
 * Source: the `ALERT_CLOSED_BECAME_FIXED` and `ALERT_CLOSED_BECAME_OUTDATED`
 * cases. Both are SYSTEM events (no actor — bold body text only) and both share
 * the SAME conditional badge: when the event's ref is the currently selected ref
 * (`timeline_event.ref_name_bytes == @selected_ref`) the badge is
 * `shield-check` on `done_emphasis` (SOLID purple → `Timeline.Badge
 * variant="done"`); otherwise it is a plain `check` icon on the default badge
 * (BARE gray). Both variants are shown below for each event to demonstrate the
 * conditional.
 *
 * Config-deleted renders the analysis category as an inline subtle mono pill
 * (`MonoPill`); when the category is empty the live ERB substitutes "API
 * Upload".
 *
 * TAXONOMY (github/primer#6664): the two "Fixed in branch" rows are the
 * ALERT_CLOSED_BECAME_FIXED wire event and carry `data-event-type="fixed"`. The
 * two "Configuration deleted" rows are visually grouped under Fixed here, but the
 * taxonomy catalog folds their ALERT_CLOSED_BECAME_OUTDATED wire event into
 * `closed` (a SYSTEM closure), so those rows carry `data-event-type="closed"`.
 * Both are system events with no actor, so neither emits `data-actor-type`.
 */
export const EventFixed = () => (
  <RealisticTimeline>
    {/* Fixed — selected ref → SOLID purple shield-check */}
    <VariantSection label="Fixed in branch (current ref)">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('fixed')}>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>Fixed in branch</span> <Ref name="main" />
            <Time date="2024-01-12T10:15:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Fixed — non-selected ref → bare default check */}
    <VariantSection label="Fixed in branch (other ref)">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('fixed')}>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>Fixed in branch</span> <Ref name="feature-x" />
            <Time date="2024-01-12T10:15:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Config deleted — selected ref → SOLID purple shield-check */}
    {/* Config-deletion is the ALERT_CLOSED_BECAME_OUTDATED wire event, which the
        taxonomy folds into `closed` (system closure), not `fixed` — so this row
        carries data-event-type="closed" despite its visual "Fixed" grouping. */}
    <VariantSection label="Configuration deleted (current ref)">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('closed')}>
          <Timeline.Badge variant="done">
            <Octicon icon={ShieldCheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>Closed as</span> <MonoPill>java</MonoPill>{' '}
            <span className={classes.BoldBody}>configuration was deleted in branch</span> <Ref name="main" />
            <Time date="2024-01-13T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Config deleted — non-selected ref → bare default check */}
    <VariantSection label="Configuration deleted (other ref)">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('closed')}>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>Closed as</span> <MonoPill>java</MonoPill>{' '}
            <span className={classes.BoldBody}>configuration was deleted in branch</span> <Ref name="feature-x" />
            <Time date="2024-01-13T16:40:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </RealisticTimeline>
)

/**
 * The Closed-by-user event group — `CodeScanTimeline.eventClosedByUser`
 * (audit § 3).
 *
 * Source: the `ALERT_CLOSED_BY_USER` case. Badge: `shield-x` on
 * `danger_emphasis` (SOLID red → `Timeline.Badge variant="danger"`). This is a
 * USER event — a circle avatar + bold login profile link. Copy: "closed this"
 * plus, when `resolution != :NO_RESOLUTION`, " as {bold reason}". The reason set
 * (`alert_closure_reasons`, downcased) is exactly three values: "false
 * positive", "used in tests", "won't fix". When `resolution_note` is present the
 * shared row appends a `note` sub-row (`show_resolution_note?`).
 */
export const EventClosedByUser = () => (
  <Examples>
    {/* Closed as false positive — with a resolution-note sub-row */}
    <VariantSection label="Closed as false positive">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="danger">
            <Octicon icon={ShieldXIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <span className={classes.Reason}>false positive</span> <Time date="2024-01-14T08:20:00Z" />
            <EventSubRow icon={NoteIcon}>Verified this pattern only appears in generated fixtures.</EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as used in tests */}
    <VariantSection label="Closed as used in tests">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="danger">
            <Octicon icon={ShieldXIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <span className={classes.Reason}>used in tests</span> <Time date="2024-01-14T08:20:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed as won't fix */}
    <VariantSection label="Closed as won't fix">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="danger">
            <Octicon icon={ShieldXIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as '}
            <span className={classes.Reason}>won&apos;t fix</span> <Time date="2024-01-14T08:20:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Closed with no resolution — ERB omits the " as {reason}" clause when
        `resolution == :NO_RESOLUTION`. */}
    <VariantSection label="Closed (no resolution)">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('closed', 'monalisa')}>
          <Timeline.Badge variant="danger">
            <Octicon icon={ShieldXIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this '}
            <Time date="2024-01-14T08:20:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Reopened event group — `CodeScanTimeline.eventReopened` (audit § 4).
 *
 * Source: the `ALERT_REOPENED_BY_USER` case. Badge: `dot-fill` on
 * `success_emphasis` (SOLID green → `Timeline.Badge variant="success"`). USER
 * event — circle avatar + bold login. Copy is a fixed "reopened this". Single
 * variant.
 */
export const EventReopened = () => (
  <Examples>
    <VariantSection label="Reopened">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('reopened', 'monalisa')}>
          <Timeline.Badge variant="success">
            <Octicon icon={DotFillIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'reopened this '}
            <Time date="2024-01-15T11:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Dismissal-requested event group — `CodeScanTimeline.eventDismissalRequested`
 * (audit § 5).
 *
 * Source: the `ALERT_DISMISSAL_REQUESTED` case. Badge: `comment` icon on the
 * default badge (BARE gray — no `background:` passed). USER event — circle
 * avatar + bold login. Copy: "requested to dismiss this as {reason}" where the
 * reason is plain (NOT bold) `alert_closure_reason_description` text. A
 * `requester_comment` renders as a `note` sub-row (`show_resolution_note?`).
 *
 * FEATURE-GATED: this whole event only renders when `delegated_dismissal_enabled?`
 * is true for the repo, and the Review-request button is further gated on
 * `timeline_event.show_dismissal_actions` (the live button is a
 * `Primer::Alpha::Dialog` show-button, `scheme: :primary, size: :small`, label
 * "Review request"). It is mapped here to the `Timeline.Actions` right slot.
 */
export const EventDismissalRequested = () => (
  <Examples>
    <VariantSection label="Requested to dismiss">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('dismissal_requested', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CommentIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'requested to dismiss this as false positive '}
            <Time date="2024-01-16T09:00:00Z" />
            <EventSubRow icon={NoteIcon}>This finding is a test-only helper, safe to dismiss.</EventSubRow>
          </Timeline.Body>
          <Timeline.Actions>
            <Button size="small" variant="primary">
              Review request
            </Button>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)

/**
 * The Dismissal-reviewed event group — `CodeScanTimeline.eventDismissalReviewed`
 * (audit § 6).
 *
 * Source: the `ALERT_DISMISSAL_REVIEWED` case. Badge icon comes from
 * `exemption_evaluation_icon`: `check` when the request was approved, `x` when
 * denied — both on the default badge (BARE gray). USER event — circle avatar +
 * bold login. Copy comes from `dismissal_resolution_msg`: "approved dismissal"
 * or "denied dismissal". A `reviewer_comment` renders as a `note` sub-row
 * (`show_reviewer_comment?`).
 *
 * FEATURE-GATED: like the request event, this only renders when
 * `delegated_dismissal_enabled?` is true for the repo.
 */
export const EventDismissalReviewed = () => (
  <Examples>
    {/* Approved — check icon + reviewer-comment sub-row */}
    <VariantSection label="Approved dismissal">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('dismissal_reviewed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={CheckIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'approved dismissal '}
            <Time date="2024-01-17T13:30:00Z" />
            <EventSubRow icon={NoteIcon}>Agreed — this rule does not apply to test fixtures.</EventSubRow>
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>

    {/* Denied — x icon */}
    <VariantSection label="Denied dismissal">
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item {...codeScanningAttrs('dismissal_reviewed', 'monalisa')}>
          <Timeline.Badge>
            <Octicon icon={XIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'denied dismissal '}
            <Time date="2024-01-17T13:30:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </VariantSection>
  </Examples>
)
