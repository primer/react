/**
 * Ported from the Timeline redesign prototype (github/prototyping,
 * src/packages/conversation/timeline). Backs the taxonomy model documented in
 * github/primer docs/timeline-audit/. Related: github/primer#6664 (Phase 3:
 * Timeline Playground, taxonomy, and data-* tagging), parent epic
 * github/primer#6654, primer/react#8075 (License Compliance stories).
 */

/**
 * Timeline event categorization model (canonical v1).
 *
 * Single source of truth for the redesigned Primer Timeline category system.
 * Replaces the earlier internal vocabulary (`review | commit | metadata |
 * automation | discussion` + `primary | secondary` + density presets).
 *
 * Two axes describe every event:
 *
 *  1. **Category** — which family the event belongs to. Seven categories exist
 *     in the taxonomy; the Viewing menu offers each as a toggle on the surfaces
 *     where it applies (scoped per surface). Two categories are internal and
 *     never appear in the menu:
 *       - `conversation` — comments and reviews. Always shown; uncheckable.
 *       - `metadata`     — labels, assignments, projects, milestones, fields,
 *                          types. Always audit-only; never in the main timeline.
 *
 *     The never-empty guarantee is *not* carried by any category. It is a
 *     property of the lifecycle: the opening event and the terminal closing
 *     event are pinned by the renderer as lifecycle bookends, so filtering can
 *     never collapse a record to nothing — regardless of which categories are
 *     toggled off.
 *
 *  2. **Visibility** — `primary` events render in the main timeline when their
 *     category is toggled on; `auditOnly` events render exclusively in the
 *     audit ("full activity") view. Conversation items render regardless.
 *
 * See github/primer docs/timeline-audit/ for the full model.
 */

import type {TimelineSurface} from './surfaces'

/**
 * Categories the user can toggle on/off in the Viewing menu.
 *
 * This is the proposed canonical set (primer#6665): seven families. `findings`
 * is the security set (alerts detected / remediated / license changes) and is a
 * real, toggleable category on alert surfaces — its detection and remediation
 * events (`dependabot_opened`, `dependabot_fixed`)
 * can be hidden like any other. The record still never empties, because the
 * opening + terminal-close events are pinned by the renderer as lifecycle
 * bookends, independent of the Findings toggle.
 * See {@link SURFACE_CATEGORIES} and {@link EventCategory}.
 */
export type ToggleableCategory = 'reviews' | 'merging' | 'status' | 'findings' | 'commits' | 'references' | 'moderation'

/**
 * Full category union. `conversation` and `metadata` are internal (not in the
 * Viewing menu):
 *   - `conversation` — comments/reviews. Always shown; uncheckable.
 *   - `metadata`     — labels/assignments/etc. Always audit-only.
 *
 * The security alert lifecycle now maps across the toggleable categories:
 * detection + remediation (opened, fixed) are `findings`; the remaining state
 * changes (dismissed, reopened) are `status`; dismissal governance (requested /
 * reviewed / cancelled) is `reviews`. Dependabot's Reintroduced folds into
 * reopened and Auto-dismissed folds into dismissed, so both stay in `status`.
 * The opening and terminal-close events are additionally pinned as lifecycle
 * bookends so the record never empties regardless of toggles.
 */
export type EventCategory = ToggleableCategory | 'conversation' | 'metadata'

/**
 * How prominently an event surfaces by default.
 *
 * - `primary`   — renders in the main timeline when its category is toggled on
 * - `auditOnly` — never in the main timeline; only in the audit view
 *
 * (Conversation items are implicitly "always" — shown regardless of toggles.)
 */
export type EventVisibility = 'primary' | 'auditOnly'

/**
 * Which toggleable categories apply to each surface, in menu display order.
 * The Viewing menu only renders categories applicable to the current surface
 * (6 for PRs, 3 for issues, 3 for Dependabot). Every listed category is a real
 * toggle; the never-empty guarantee is handled separately by lifecycle-bookend
 * pinning in the renderer, not by forcing any category on.
 */
export const SURFACE_CATEGORIES: Record<TimelineSurface, readonly ToggleableCategory[]> = {
  pull: ['reviews', 'merging', 'status', 'commits', 'references', 'moderation'],
  issue: ['status', 'references', 'moderation'],
  dependabot: ['findings', 'status', 'reviews'],
  'code-scanning': ['findings', 'status', 'reviews'],
  'secret-scanning': ['findings', 'status', 'reviews'],
  'license-compliance': ['findings', 'status', 'reviews'],
}

/** Every toggleable category (surface-agnostic), in canonical order. */
export const ALL_TOGGLEABLE_CATEGORIES: readonly ToggleableCategory[] = [
  'reviews',
  'merging',
  'status',
  'findings',
  'commits',
  'references',
  'moderation',
]

/** Canonical display order of surfaces. */
const SURFACE_ORDER: readonly TimelineSurface[] = [
  'pull',
  'issue',
  'dependabot',
  'code-scanning',
  'secret-scanning',
  'license-compliance',
]

/** Which surfaces a category applies to (inverse of {@link SURFACE_CATEGORIES}). */
export function surfacesForCategory(category: ToggleableCategory): TimelineSurface[] {
  return SURFACE_ORDER.filter(surface => SURFACE_CATEGORIES[surface].includes(category))
}

/** Whether a category is user-toggleable (appears in the Viewing menu). */
export function isToggleableCategory(category: EventCategory): category is ToggleableCategory {
  return category !== 'conversation' && category !== 'metadata'
}
