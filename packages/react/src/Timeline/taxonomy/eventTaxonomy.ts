/**
 * Ported from the Timeline redesign prototype (github/prototyping,
 * src/packages/conversation/timeline). Backs the taxonomy model documented in
 * github/primer docs/timeline-audit/. Related: github/primer#6664 (Phase 3
 * Timeline Playground), github/primer#6654 (data-* event contract),
 * primer/react#8075 (License Compliance stories).
 */

/**
 * Timeline event taxonomy — the single source of truth for the redesigned
 * Primer Timeline event categorization, keyed by the `(scope, type)` composite.
 *
 * The taxonomy has **five axes**. Three are hierarchical (the Figma
 * surface → category → event nesting, and the `data-*` spine):
 *
 *   - **scope** ({@link EventScope}, axis L1) — the owning surface.
 *   - **category** ({@link ToggleableCategory}, axis L2) — the event family that
 *     the Viewing menu toggles.
 *   - **type** (the leaf, axis L3) — the **unscoped** REST `event.type`.
 *
 * Two are orthogonal facets: **visibility** (`primary | auditOnly`) and
 * **actorType** (`user | bot`, resolved at runtime from the actor login).
 *
 * Identity is the `(scope, type)` pair, so the leaf `type` is unscoped
 * (`opened`, not `license_compliance_opened`): `data-event-scope` already
 * carries the surface, and keeping `type` unscoped lets a selector target a
 * lifecycle verb across every surface (`[data-event-type="closed"]`) or one
 * surface (`[data-event-scope="license-compliance"][data-event-type="closed"]`).
 * The prototype's flattened `PullConversationEventType` union is a downstream
 * storage artifact derived via {@link qualifyEventType}, not the canonical form.
 *
 * Every consumer (the `data-*` attributes, the Storybook story grouping, and the
 * prototype registry/union keys) is a **projection** of this one catalog, not a
 * separately hand-maintained list.
 *
 * NOTE (value casing): axis values are currently mixed — scope is kebab
 * (`license-compliance`, from {@link TimelineSurface}), type is snake
 * (`review_requested`), category is a bare word (`reviews`). Normalizing all
 * axis values to snake_case is an open ratification item (see the rollout doc);
 * this module intentionally mirrors the values the running prototype emits today
 * rather than forking casing unilaterally.
 */

import type {EventCategory, EventVisibility, ToggleableCategory} from './eventCategories'
import {SURFACE_CATEGORIES, isToggleableCategory} from './eventCategories'
import type {ActorType} from './actorType'
import type {TimelineSurface} from './surfaces'

/**
 * Owning surface of an event — axis L1. Identical to {@link TimelineSurface}:
 * scope IS the surface. Aliased so taxonomy consumers read intent (`EventScope`)
 * without coupling to the rendering-context type name.
 */
export type EventScope = TimelineSurface

/**
 * License Compliance leaf event types — axis L3, **unscoped** (the real
 * `event.type`). This is the authoritative nine, verified in primer/react#8075
 * against the live github-ui `switch (event.type)` in
 * `packages/license-compliance-alerts/components/timeline/TimelineEventItem.tsx`
 * plus the Rails synthetic-event builder (`opened`, `appeared_in_branch`).
 *
 * The prototype union (`repo-pull-conversation-types.ts`) drifts from this: it
 * shortens `appeared_in_branch` to `appeared`, omits `licenses_added`, and
 * flattens each leaf with a `license_compliance_` prefix. Reconcile to this set.
 */
export type LicenseComplianceEventType =
  | 'opened'
  | 'appeared_in_branch'
  | 'review_requested'
  | 'review_approved'
  | 'review_denied'
  | 'review_expired'
  | 'exception_added'
  | 'licenses_added'
  | 'closed'

/** Placement of one event on the non-identity axes (category + facets). */
export interface EventTaxonomyEntry {
  /**
   * Category family — axis L2. Drives `data-event-category` and the Viewing-menu
   * grouping. A {@link ToggleableCategory} the surface offers (see
   * `SURFACE_CATEGORIES`), OR the always-audit `metadata` family (never
   * toggleable, always `auditOnly` — labels, assignees, project fields). Use
   * {@link taxonomyCategoriesMatchSurface} to assert a catalog only uses
   * categories its surface actually offers.
   */
  category: EventCategory
  /**
   * Default density facet — `data-event-visibility`. Omit for `primary` (the
   * common case; every License Compliance event is primary because the audit-log
   * surface renders one flat list with no curated/audit split).
   */
  visibility?: EventVisibility
  /**
   * Whether the event renders through the **actor-capable** path. `false` only
   * for structurally actor-less events (the synthetic `appeared_in_branch`,
   * which upstream renders through `TimelineEventWithoutActor`) — these emit no
   * `data-actor-type`. `true` means the row can carry an actor, but PRESENCE is
   * data-driven: upstream `TimelineEventWithActor` renders the avatar only when
   * `event.actor` exists, so a time-triggered event like `review_expired` is
   * `true` yet renders actor-less when the payload has no actor. The concrete
   * `user | bot` value is resolved at runtime from the actor login (see
   * `actorTypeForLogin`), never fixed by event type; `data-actor-type` is omitted
   * whenever no actor is present.
   */
  hasActor: boolean
}

/** Convenience handle for the pilot surface. */
export const LICENSE_COMPLIANCE_SCOPE: EventScope = 'license-compliance'

/**
 * The License Compliance catalog — declared ONCE. Categories mirror the running
 * registry (`TimelineEventRegistry.tsx`): lifecycle + branch presence are
 * `findings`, all review governance is `reviews`, and the two policy-change
 * events are `status` (folding `exception_added` + `licenses_added` into one
 * "Status updates" story instead of two singletons). The lifecycle bookends
 * (`opened`, `closed`) are additionally pinned by `computeLifecycleBookendIds`
 * so filtering never empties the record — a guarantee that lives in the renderer,
 * not in this catalog.
 */
export const LICENSE_COMPLIANCE_TAXONOMY: Record<LicenseComplianceEventType, EventTaxonomyEntry> = {
  opened: {category: 'findings', hasActor: true}, // synthetic; system-identity actor, rendered linked (no "bot" Label)
  appeared_in_branch: {category: 'findings', hasActor: false}, // synthetic; system, no actor
  review_requested: {category: 'reviews', hasActor: true},
  review_approved: {category: 'reviews', hasActor: true},
  review_denied: {category: 'reviews', hasActor: true},
  review_expired: {category: 'reviews', hasActor: true}, // actor-capable; renders actor-less when payload has no actor (automatic expiry)
  exception_added: {category: 'status', hasActor: true},
  licenses_added: {category: 'status', hasActor: true},
  closed: {category: 'findings', hasActor: true},
}

/* ------------------------------------------------------------------------- *
 * Secret Scanning — axis L3 leaves.
 *
 * SOURCE OF TRUTH: live github-ui React `packages/secret-scanning-alerts`
 * `components/show/AlertTimeline.tsx` `switch (event.type)` (five cases:
 * Creation, Resolution, Bypass, Report, DelegatedClosureRequestOpened).
 * See `files/story-secret-scanning.diff` (translated 1:1 from the live switch).
 *
 * DELTA — 5 canonical cases → 7 prototype leaves. The prototype fans the switch
 * out to finer wire types: `Resolution` splits into `closed` + `reopened`
 * (the case branches on `resolution.type === 'reopened'`), and the prototype
 * additionally carries `validity_changed` (the Report path) and a distinct
 * `dismissal_reviewed`. Tracked in the cross-surface delta report.
 *
 * ACTOR — `Creation` uses `isGitHubActor` unconditionally: the detection event
 * ALWAYS renders the system "GitHub" actor (like LC `opened`), so `hasActor` is
 * true with a system identity. Every other case carries a user actor.
 * ------------------------------------------------------------------------- */
export type SecretScanningEventType =
  | 'detected'
  | 'validity_changed'
  | 'bypassed'
  | 'dismissal_requested'
  | 'dismissal_reviewed'
  | 'reopened'
  | 'closed'

export const SECRET_SCANNING_TAXONOMY: Record<SecretScanningEventType, EventTaxonomyEntry> = {
  detected: {category: 'findings', hasActor: true}, // `Creation`; system GitHub actor (isGitHubActor), rendered
  validity_changed: {category: 'findings', hasActor: true}, // `Report` path; user actor
  bypassed: {category: 'status', hasActor: true},
  dismissal_requested: {category: 'reviews', hasActor: true}, // `DelegatedClosureRequestOpened`
  dismissal_reviewed: {category: 'reviews', hasActor: true},
  reopened: {category: 'status', hasActor: true}, // `Resolution` (resolution.type === 'reopened')
  closed: {category: 'status', hasActor: true}, // `Resolution` (any other resolution.type)
}

/* ------------------------------------------------------------------------- *
 * Code Scanning — axis L3 leaves.
 *
 * SOURCE OF TRUTH: live dotcom ERB `timeline_component.html.erb` dispatch (Code
 * Scanning is NOT migrated to React — server-rendered ViewComponent). The
 * authoritative nine cases are enumerated in `files/story-code-scanning.diff`:
 * ALERT_CREATED, ALERT_APPEARED_IN_BRANCH, ALERT_REAPPEARED,
 * ALERT_CLOSED_BECAME_FIXED, ALERT_CLOSED_BECAME_OUTDATED, ALERT_CLOSED_BY_USER,
 * ALERT_REOPENED_BY_USER, ALERT_DISMISSAL_REQUESTED, ALERT_DISMISSAL_REVIEWED.
 *
 * DELTA — 9 ERB cases → 8 prototype leaves. The two non-fixed closure paths
 * (`CLOSED_BECAME_OUTDATED`, system/config-deleted, no actor; and
 * `CLOSED_BY_USER`, user actor) are folded into one `closed` leaf, so `closed`
 * is actor-CAPABLE with presence data-driven (like LC `review_expired`).
 * `CLOSED_BECAME_FIXED` maps to `fixed`. The delegated-dismissal pair is
 * feature-gated (`delegated_dismissal_enabled?`) — dormant on most repos.
 *
 * ACTOR — the whole detection group (`detected`, `appeared`, `reappeared`) and
 * `fixed` are SYSTEM events with no actor. `closed`/`reopened`/`dismissal_*`
 * carry user actors.
 * ------------------------------------------------------------------------- */
export type CodeScanningEventType =
  | 'detected'
  | 'appeared'
  | 'reappeared'
  | 'fixed'
  | 'closed'
  | 'reopened'
  | 'dismissal_requested'
  | 'dismissal_reviewed'

export const CODE_SCANNING_TAXONOMY: Record<CodeScanningEventType, EventTaxonomyEntry> = {
  detected: {category: 'findings', hasActor: false}, // ALERT_CREATED; system, no actor
  appeared: {category: 'findings', hasActor: false}, // ALERT_APPEARED_IN_BRANCH; system, no actor
  reappeared: {category: 'findings', hasActor: false}, // ALERT_REAPPEARED; system, no actor
  fixed: {category: 'findings', hasActor: false}, // ALERT_CLOSED_BECAME_FIXED; system, no actor
  closed: {category: 'status', hasActor: true}, // folds BECAME_OUTDATED (system) + CLOSED_BY_USER (user)
  reopened: {category: 'status', hasActor: true}, // ALERT_REOPENED_BY_USER; user actor
  dismissal_requested: {category: 'reviews', hasActor: true}, // feature-gated (delegated_dismissal_enabled?)
  dismissal_reviewed: {category: 'reviews', hasActor: true}, // feature-gated
}

/* ------------------------------------------------------------------------- *
 * Dependabot — axis L3 leaves.
 *
 * SOURCE OF TRUTH: primer/react Storybook `Components/Timeline/Events/Dependabot`
 * (`Timeline.dependabot.features.stories.tsx`), cross-checked against the
 * github/primer audit `docs/timeline-audit/dependabot-timeline-events-for-figma.md`
 * and the dotcom ERB it documents. The Storybook exports five Dependabot-specific
 * event groups (EventOpened, EventFixed, EventDismissed, EventReopened,
 * EventDismissalRequest) plus two SHARED groups (EventAssignment, EventCopilotWork)
 * that are out of per-surface catalog scope (same treatment as the other surfaces).
 *
 * LEAF GRANULARITY: the Storybook groups consolidate rendering variants — `opened`
 * covers Opened / OpenedFromPR / OpenedFromPush; `dismissed` folds manual (user)
 * and auto/rule-based (Dependabot) dismissals; `reopened` folds manual reopen,
 * Reintroduced, and Auto-Reopened. The delegated-dismissal group splits into three
 * leaves for cross-surface parity with secret/code scanning (`dismissal_requested`,
 * `dismissal_reviewed` [approved|denied], `dismissal_cancelled`).
 *
 * ACTOR (VERIFIED): every Dependabot leaf renders an actor — there are NO
 * structurally actor-less events here. Dependabot renders ITSELF as a bot actor
 * (square avatar + linked `dependabot` + `bot` Label) for opened/fixed/auto paths;
 * user-initiated paths render a user actor. This is the key delta from code
 * scanning, whose detection group is truly actor-less — the security surfaces do
 * NOT share a "system detection has no actor" trait. (Corrects a prior inference
 * that marked opened/fixed/reintroduced/auto_dismissed as `hasActor: false` and
 * invented `severity_changed`/`advisory_updated` leaves that no source carries.)
 * ------------------------------------------------------------------------- */
export type DependabotEventType =
  | 'opened'
  | 'fixed'
  | 'dismissed'
  | 'reopened'
  | 'dismissal_requested'
  | 'dismissal_reviewed'
  | 'dismissal_cancelled'

export const DEPENDABOT_TAXONOMY: Record<DependabotEventType, EventTaxonomyEntry> = {
  opened: {category: 'findings', hasActor: true}, // Dependabot bot actor (source/PR/push variants)
  fixed: {category: 'findings', hasActor: true}, // Dependabot bot actor
  dismissed: {category: 'status', hasActor: true}, // folds manual (user) + auto/rule-based (Dependabot bot)
  reopened: {category: 'status', hasActor: true}, // folds manual reopen (user) + Reintroduced + Auto-Reopened (Dependabot bot)
  dismissal_requested: {category: 'reviews', hasActor: true}, // delegated closures; user actor
  dismissal_reviewed: {category: 'reviews', hasActor: true}, // Approved | Denied; user actor
  dismissal_cancelled: {category: 'reviews', hasActor: true}, // user actor
}

/* ------------------------------------------------------------------------- *
 * Issues — axis L3 leaves (the ISSUE-SCOPED subset of the classic
 * issue/PR timeline).
 *
 * SOURCE OF TRUTH: dotcom (Rails) issue timeline. The running prototype stores
 * issue and PR events in one flattened 56-entry registry map with no scope
 * prefix; this catalog is the issue-applicable slice, excluding PR-only families
 * (commits, merging, reviews) and PR-only lifecycle verbs (`convert_to_draft`,
 * `ready_for_review`, `converted_from_draft`, `deployed`).
 *
 * CATEGORY FIT: `SURFACE_CATEGORIES.issue` offers `status`, `references`,
 * `moderation` (toggleable) plus the always-audit `metadata` family. Every leaf
 * here uses one of those — verified by `taxonomyCategoriesMatchSurface`.
 *
 * VISIBILITY: `metadata` leaves are `auditOnly` (labels, assignees, projects,
 * type, rename, milestone — the audit-log detail that the curated timeline hides
 * by default). The rest default to `primary`.
 *
 * OUTLIER: Issues just GA'd INLINE avatars (moving off the large left-gutter
 * avatar), so its actor rendering diverges from the security surfaces — a
 * per-surface rendering delta, not a taxonomy delta (see `isInlineAvatarSurface`).
 * ------------------------------------------------------------------------- */
export type IssueEventType =
  | 'closed'
  | 'reopened'
  | 'pinned'
  | 'unpinned'
  | 'transferred'
  | 'converted_to_discussion'
  | 'marked_as_duplicate'
  | 'referenced'
  | 'cross_referenced'
  | 'connected'
  | 'disconnected'
  | 'sub_issue_added'
  | 'sub_issue_removed'
  | 'parent_added'
  | 'parent_removed'
  | 'blocked_by_added'
  | 'blocked_by_removed'
  | 'blocking_added'
  | 'blocking_removed'
  | 'locked'
  | 'unlocked'
  | 'comment_deleted'
  | 'comment_pinned'
  | 'comment_unpinned'
  | 'user_blocked'
  | 'labeled'
  | 'unlabeled'
  | 'assigned'
  | 'unassigned'
  | 'renamed'
  | 'milestoned'
  | 'demilestoned'
  | 'issue_type_added'
  | 'issue_type_removed'
  | 'issue_type_changed'
  | 'added_to_project'
  | 'removed_from_project'
  | 'project_field_changed'

export const ISSUE_TAXONOMY: Record<IssueEventType, EventTaxonomyEntry> = {
  closed: {category: 'status', hasActor: true},
  reopened: {category: 'status', hasActor: true},
  pinned: {category: 'status', hasActor: true},
  unpinned: {category: 'status', hasActor: true},
  transferred: {category: 'status', hasActor: true},
  converted_to_discussion: {category: 'status', hasActor: true},
  marked_as_duplicate: {category: 'status', hasActor: true},
  referenced: {category: 'references', hasActor: true},
  cross_referenced: {category: 'references', hasActor: true},
  connected: {category: 'references', hasActor: true},
  disconnected: {category: 'references', hasActor: true},
  sub_issue_added: {category: 'references', hasActor: true},
  sub_issue_removed: {category: 'references', hasActor: true},
  parent_added: {category: 'references', hasActor: true},
  parent_removed: {category: 'references', hasActor: true},
  blocked_by_added: {category: 'references', hasActor: true},
  blocked_by_removed: {category: 'references', hasActor: true},
  blocking_added: {category: 'references', hasActor: true},
  blocking_removed: {category: 'references', hasActor: true},
  locked: {category: 'moderation', hasActor: true},
  unlocked: {category: 'moderation', hasActor: true},
  comment_deleted: {category: 'moderation', hasActor: true},
  comment_pinned: {category: 'moderation', hasActor: true},
  comment_unpinned: {category: 'moderation', hasActor: true},
  user_blocked: {category: 'moderation', hasActor: true},
  labeled: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  unlabeled: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  assigned: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  unassigned: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  renamed: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  milestoned: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  demilestoned: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  issue_type_added: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  issue_type_removed: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  issue_type_changed: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  added_to_project: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  removed_from_project: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
  project_field_changed: {category: 'metadata', visibility: 'auditOnly', hasActor: true},
}

/**
 * Every surface catalog in one place — the combined taxonomy. Keyed by
 * {@link EventScope}, so `SURFACE_TAXONOMIES['secret-scanning']['detected']`
 * resolves a leaf's category + facets. `pull` is intentionally absent: PR events
 * are out of scope for this pass and still live in the flattened registry only.
 *
 * This is the "all surfaces, one model" view the extrapolation targets — the
 * validation test asserts every leaf's category is one the surface actually
 * offers (`SURFACE_CATEGORIES`), so the model provably works across surfaces.
 */
export const SURFACE_TAXONOMIES = {
  'license-compliance': LICENSE_COMPLIANCE_TAXONOMY,
  'secret-scanning': SECRET_SCANNING_TAXONOMY,
  'code-scanning': CODE_SCANNING_TAXONOMY,
  dependabot: DEPENDABOT_TAXONOMY,
  issue: ISSUE_TAXONOMY,
} satisfies Partial<Record<EventScope, Record<string, EventTaxonomyEntry>>>

/** Surfaces that have a formalized catalog in {@link SURFACE_TAXONOMIES}. */
export type CatalogedScope = keyof typeof SURFACE_TAXONOMIES

/**
 * Derive the prototype's flattened union/registry key from the canonical
 * `(scope, type)` pair. Snake-cases the (kebab) scope and joins with `_`, so
 * `('license-compliance', 'opened')` → `license_compliance_opened`, matching the
 * existing `PullConversationEventType` keys. This is the prototype storage
 * projection — the emitted `data-event-type` stays the unscoped leaf.
 */
export function qualifyEventType(scope: EventScope, type: string): string {
  return `${scope.replace(/-/g, '_')}_${type}`
}

/**
 * Inverse of {@link qualifyEventType}: recover the unscoped leaf `type` from a
 * flattened union/registry key. Strips the snake-cased scope prefix when present
 * (`('license-compliance', 'license_compliance_appeared_in_branch')` →
 * `appeared_in_branch`); leaves an already-unscoped key untouched
 * (`('pull', 'labeled')` → `labeled`, since pull/issue events carry no prefix).
 * This is the projection `EventRow` uses to emit the unscoped `data-event-type`
 * while `data-event-scope` carries the surface.
 */
export function unqualifyEventType(scope: EventScope, flattenedType: string): string {
  const prefix = `${scope.replace(/-/g, '_')}_`
  return flattenedType.startsWith(prefix) ? flattenedType.slice(prefix.length) : flattenedType
}

/** Input for the `data-*` projection. */
export interface EventDataAttributeInput {
  scope: EventScope
  /** Unscoped leaf type (e.g. `opened`). */
  type: string
  category: EventCategory
  visibility?: EventVisibility
  /** Omit for actor-less events. */
  actorType?: ActorType
}

/** The `data-*` attribute set emitted on a timeline event row. */
export interface EventDataAttributes {
  'data-event-scope': string
  'data-event-type': string
  'data-event-category': string
  'data-event-visibility': EventVisibility
  'data-actor-type'?: ActorType
}

/**
 * Canonical serializer for the event `data-*` contract (primer#6654). The single
 * place that turns the five axes into attribute strings — `EventRow` can delegate
 * here so the contract has exactly one implementation. `data-event-type` is the
 * **unscoped** leaf; the surface travels in `data-event-scope`. `data-actor-type`
 * is omitted entirely for actor-less events rather than emitted empty.
 */
export function toEventDataAttributes({
  scope,
  type,
  category,
  visibility,
  actorType,
}: EventDataAttributeInput): EventDataAttributes {
  const attributes: EventDataAttributes = {
    'data-event-scope': scope,
    'data-event-type': type,
    'data-event-category': category,
    'data-event-visibility': visibility ?? 'primary',
  }
  if (actorType) {
    attributes['data-actor-type'] = actorType
  }
  return attributes
}

/**
 * Group a catalog's leaf types by category, preserving catalog order. This is
 * the projection that regroups the surface-level Storybook stories by category
 * (so `exception_added` + `licenses_added` share one "Status updates" story
 * instead of shipping singletons) and can order the Viewing menu. Generated from
 * the catalog, never hand-maintained.
 */
export function eventTypesByCategory<T extends string>(
  taxonomy: Record<T, EventTaxonomyEntry>,
): Partial<Record<EventCategory, T[]>> {
  const groups: Partial<Record<EventCategory, T[]>> = {}
  for (const type of Object.keys(taxonomy) as T[]) {
    const {category} = taxonomy[type]
    ;(groups[category] ??= []).push(type)
  }
  return groups
}

/**
 * Cross-surface guarantee: every leaf's category is one the surface actually
 * offers. A category is valid for a surface when it is a {@link ToggleableCategory}
 * listed in `SURFACE_CATEGORIES[scope]`, or the always-audit `metadata` /
 * `conversation` families (which are never toggleable and apply everywhere).
 * Returns the offending `type`s (empty ⇒ the catalog fits the surface). This is
 * the check that proves the one categorization model works cleanly across every
 * surface in {@link SURFACE_TAXONOMIES}.
 */
export function taxonomyCategoriesMatchSurface(
  scope: CatalogedScope,
  taxonomy: Record<string, EventTaxonomyEntry>,
): string[] {
  const offered = new Set<ToggleableCategory>(SURFACE_CATEGORIES[scope])
  const mismatches: string[] = []
  for (const [type, entry] of Object.entries(taxonomy)) {
    const {category} = entry
    const alwaysAudit = !isToggleableCategory(category) // metadata | conversation
    if (!alwaysAudit && !offered.has(category)) {
      mismatches.push(type)
    }
  }
  return mismatches
}
