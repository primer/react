import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {GitBranchIcon, ShieldIcon} from '@primer/octicons-react'
import Label from '../Label'
import Link from '../Link'
import Octicon from '../Octicon'
import RelativeTime from '../RelativeTime'
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
 * THIS FILE IS A PROOF-OF-PATTERN: it ships only the **Detected** event group
 * (alert created / appeared / reappeared) plus the file scaffold + helpers. The
 * remaining groups (Fixed / Config-deleted, Closed by user, Reopened, Dismissal
 * requested, Dismissal reviewed) are deliberately deferred to a follow-up so the
 * conventions below can be reviewed first.
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
 * ACCESSIBILITY NOTE: the Detected group renders no in-text `<Link>` in the main
 * body (system events are bold text only). The only links are in the workflow
 * sub-row, where the bold weight is the non-color differentiator required by the
 * axe `link-in-text-block` rule. Any in-text link added when the USER-actor
 * groups are built must likewise use `inline`/bold styling.
 *
 * RIGHT CONTROLS (`Timeline.Actions`): the shared row renders a right-aligned
 * tool-version `Primer::Beta::Label(scheme: :secondary)` whenever the event
 * carries a `tool_version` (the title reads "Tool version X" or "Tool upgraded
 * to X"). It is `margin-left: auto` inside the body in the ERB; we map it to the
 * `Timeline.Actions` right-controls slot. The "First detected" variant below
 * demonstrates it.
 */

/**
 * Bold branch ref — live `formatted_ref_name` renders
 * `Primer::Beta::Text.new(font_weight: :bold, classes: "branch-name")`. Dotcom
 * defines no `.branch-name` rule, so it is plain bold text (NOT the monospace
 * `BranchName` pill).
 */
const Ref = ({name}: {name: string}) => <span className={classes.RefName}>{name}</span>

// Muted relative timestamp. The shared `timeline_item_component` renders a plain
// `time_ago_in_words_js` (no link wrapper) — muted text only.
const Time = ({date}: {date: string}) => (
  <span className={classes.Timestamp}>
    <RelativeTime date={new Date(date)} format="relative" />
  </span>
)

/**
 * "in configuration {category}" inline pill — live `show_analysis_origin?` rows
 * render `Primer::Beta::Truncate.new(bg: :subtle, font_family: :mono,
 * font_size: 6, border_radius: 1)`: a subtle gray monospace rounded pill. Only
 * shown when the alert has more than one analysis category
 * (`has_more_than_one_category?`).
 */
const ConfigPill = ({category}: {category: string}) => (
  <>
    {' in configuration'}
    <span className={classes.ConfigPill}>{category}</span>
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
  <div
    className={classes.RealisticTimeline}
    // Prevent the placeholder `href="#"` links from navigating inside Storybook.
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    {/* First detected — ALERT_CREATED. Bare shield badge, bold body, a path
        sub-row, and a right-aligned tool-version Label (Timeline.Actions). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>First detected in commit</h3>
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldIcon} aria-label="Detected" />
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
                right-aligned, title "Tool version 2.15.0". */}
            <Label variant="secondary" title="Label: Tool version 2.15.0">
              2.15.0
            </Label>
          </Timeline.Actions>
        </Timeline.Item>
      </Timeline>
    </section>

    {/* Appeared in branch — ALERT_APPEARED_IN_BRANCH. Bare git-branch badge,
        bold "Appeared in branch {ref}", and a workflow-run sub-row (no commit
        card — `show_timeline_commit?` is false for this event). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Appeared in branch</h3>
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={GitBranchIcon} aria-label="Appeared in branch" />
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
    </section>

    {/* Reappeared in branch — ALERT_REAPPEARED. Bare shield badge, bold
        "Reappeared in branch {ref}", and the optional "in configuration
        {category}" pill (rendered when the alert has more than one category). */}
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Reappeared in branch</h3>
      <Timeline aria-label="Code scanning alert timeline">
        <Timeline.Item>
          <Timeline.Badge>
            <Octicon icon={ShieldIcon} aria-label="Reappeared" />
          </Timeline.Badge>
          <Timeline.Body>
            <span className={classes.BoldBody}>Reappeared in branch</span> <Ref name="main" />
            <ConfigPill category="rust" />
            <Time date="2024-01-10T14:05:00Z" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)
