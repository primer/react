/**
 * Ported from the Timeline redesign prototype (github/prototyping,
 * src/packages/conversation/timeline). Backs the taxonomy model documented in
 * github/primer docs/timeline-audit/. Related: github/primer#6664 (Phase 3
 * Timeline Playground), github/primer#6654 (data-* event contract),
 * primer/react#8075 (License Compliance stories).
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
 *     event are pinned in the renderer (see `computeLifecycleBookendIds` in
 *     `timelineVisibility.ts`), so filtering can never collapse a record to
 *     nothing — regardless of which categories are toggled off.
 *
 *  2. **Visibility** — `primary` events render in the main timeline when their
 *     category is toggled on; `auditOnly` events render exclusively in the
 *     audit ("full activity") view. Conversation items render regardless.
 *
 * See the project context doc §4 (categorization model) and §5 (events catalog).
 */

import {
  CheckCircleIcon,
  CommentIcon,
  CrossReferenceIcon,
  EyeIcon,
  FoldIcon,
  GitBranchIcon,
  GitMergeIcon,
  ReportIcon,
  ShieldIcon,
  type Icon,
} from '@primer/octicons-react'
import {SECURITY_ALERT_SURFACES, type TimelineSurface} from './surfaces'

/**
 * Categories the user can toggle on/off in the Viewing menu.
 *
 * This is the proposed canonical set (primer#6665): seven families. `findings`
 * is the security set (alerts detected / remediated / license changes) and is a
 * real, toggleable category on alert surfaces — its detection and remediation
 * events (`dependabot_opened`, `dependabot_fixed`)
 * can be hidden like any other. The record still never empties, because the
 * opening + terminal-close events are pinned as lifecycle bookends (see
 * `computeLifecycleBookendIds`), independent of the Findings toggle.
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

export interface CategoryMeta {
  /** Title-cased label shown in the Viewing menu. */
  label: string
  /** One-line description shown under the label in the Viewing menu. */
  description: string
  /** Leading visual for the menu item. */
  icon: Icon
}

/** Display metadata for each toggleable category (Viewing menu). */
export const CATEGORY_META: Record<ToggleableCategory, CategoryMeta> = {
  reviews: {
    label: 'Reviews',
    description: 'Review requests, approvals, dismissals',
    icon: EyeIcon,
  },
  merging: {
    label: 'Merging',
    description: 'Merge events, queue, auto-merge',
    icon: GitMergeIcon,
  },
  status: {
    label: 'Status updates',
    description: 'Opened, closed, reopened, dismissed',
    icon: CheckCircleIcon,
  },
  findings: {
    label: 'Findings',
    description: 'Alerts detected, remediated, licenses',
    icon: ShieldIcon,
  },
  commits: {
    label: 'Commits and branches',
    description: 'Pushes, branch changes',
    icon: GitBranchIcon,
  },
  references: {
    label: 'References',
    description: 'Cross-references, mentions, relationships',
    icon: CrossReferenceIcon,
  },
  moderation: {
    label: 'Moderation',
    description: 'Locks, deleted comments, blocks',
    icon: ReportIcon,
  },
}

/**
 * Per-surface description overrides for the Viewing menu.
 *
 * {@link CATEGORY_META} descriptions are the generic, cross-surface captions
 * (used by the preferences page, which lists every category without scoping to a
 * surface). The Viewing menu is always scoped to one surface, so it should
 * describe a category in terms that are true *there* — e.g. a Dependabot alert
 * never has "licenses" (that's a separate License-compliance surface), and its
 * `reviews`
 * are dismissal governance, not PR approvals. Only categories whose meaning
 * differs by surface need an entry; anything unlisted falls back to the generic
 * {@link CATEGORY_META} description via {@link categoryDescription}.
 */
const SURFACE_CATEGORY_DESCRIPTIONS: Partial<Record<TimelineSurface, Partial<Record<ToggleableCategory, string>>>> = {
  pull: {
    status: 'Opened, closed, reopened',
  },
  issue: {
    status: 'Opened, closed, reopened',
  },
  dependabot: {
    findings: 'Vulnerabilities detected, reintroduced, remediated',
    status: 'Dismissed, reopened, auto-dismissed',
    reviews: 'Dismissal requests and reviews',
  },
  'code-scanning': {
    findings: 'Alerts detected, appeared in branches, and fixed',
    status: 'Alerts closed and reopened',
    reviews: 'Dismissal requests and reviews',
  },
  'secret-scanning': {
    findings: 'Secrets detected and validity changes',
    status: 'Closed, reopened, and push-protection bypasses',
    reviews: 'Dismissal requests and reviews',
  },
  'license-compliance': {
    findings: 'Violations opened, appeared in branches, and closed',
    status: 'Policy exceptions and approved-license changes',
    reviews: 'Close requests and reviews',
  },
}

/**
 * Description shown under a category in the Viewing menu for a given surface.
 * Prefers the surface-specific override; falls back to the generic
 * {@link CATEGORY_META} caption.
 */
export function categoryDescription(category: ToggleableCategory, surface: TimelineSurface): string {
  return SURFACE_CATEGORY_DESCRIPTIONS[surface]?.[category] ?? CATEGORY_META[category].description
}

/**
 * Which toggleable categories apply to each surface, in menu display order.
 * The Viewing menu only renders categories applicable to the current surface
 * (6 for PRs, 3 for issues, 3 for Dependabot). Every listed category is a real
 * toggle; the never-empty guarantee is handled separately by lifecycle-bookend
 * pinning (see `computeLifecycleBookendIds`), not by forcing any category on.
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

/**
 * Display order of surfaces (used when listing which surfaces a setting hits).
 */
const SURFACE_ORDER: readonly TimelineSurface[] = [
  'pull',
  'issue',
  'dependabot',
  'code-scanning',
  'secret-scanning',
  'license-compliance',
]

/** Human label for a surface, used in settings copy. */
export const SURFACE_LABEL: Record<TimelineSurface, string> = {
  pull: 'Pull requests',
  issue: 'Issues',
  dependabot: 'Alerts',
  'code-scanning': 'Code scanning',
  'secret-scanning': 'Secret scanning',
  'license-compliance': 'License compliance',
}

/** Which surfaces a category applies to (inverse of {@link SURFACE_CATEGORIES}). */
export function surfacesForCategory(category: ToggleableCategory): TimelineSurface[] {
  return SURFACE_ORDER.filter(surface => SURFACE_CATEGORIES[surface].includes(category))
}

/**
 * Short "applies to" label for a category, e.g. "Pull requests", "Issues", or
 * "All surfaces" when it spans every surface. Used by the preferences page to
 * delimit which surface each setting affects.
 */
export function appliesToLabel(category: ToggleableCategory): string {
  const surfaces = surfacesForCategory(category)
  if (surfaces.length === SURFACE_ORDER.length) return 'All surfaces'
  // Collapse the security-alert surfaces (Dependabot, code/secret scanning,
  // license compliance) into one label — they share the security taxonomy.
  const securitySet = new Set<TimelineSurface>(SECURITY_ALERT_SURFACES)
  const security = surfaces.filter(s => securitySet.has(s))
  const nonSecurity = surfaces.filter(s => !securitySet.has(s))
  const parts = nonSecurity.map(s => SURFACE_LABEL[s])
  if (security.length === securitySet.size) {
    parts.push('Security alerts')
  } else {
    parts.push(...security.map(s => SURFACE_LABEL[s]))
  }
  return parts.join(', ')
}

/**
 * Refinements are PR-only toggles, separate from categories. They narrow the
 * curated main timeline without removing a whole category. Audit view ignores
 * them (it shows everything).
 */
export type Refinement = 'hideResolved' | 'hideOutdated'

export interface RefinementMeta {
  label: string
  /** Leading visual for the menu item. */
  icon: Icon
  /** Surfaces where this refinement is offered. */
  surfaces: readonly TimelineSurface[]
}

export const REFINEMENT_META: Record<Refinement, RefinementMeta> = {
  hideResolved: {
    label: 'Hide resolved review comments',
    icon: CommentIcon,
    surfaces: ['pull'],
  },
  hideOutdated: {
    label: 'Hide outdated comments',
    icon: FoldIcon,
    surfaces: ['pull'],
  },
}

/** Refinements offered on a given surface, in display order. */
export function refinementsForSurface(surface: TimelineSurface): Refinement[] {
  return (Object.keys(REFINEMENT_META) as Refinement[]).filter(r => REFINEMENT_META[r].surfaces.includes(surface))
}

/** Whether a category is user-toggleable (appears in the Viewing menu). */
export function isToggleableCategory(category: EventCategory): category is ToggleableCategory {
  return category !== 'conversation' && category !== 'metadata'
}
