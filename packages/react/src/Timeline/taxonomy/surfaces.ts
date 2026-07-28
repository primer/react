/**
 * Timeline surfaces — the owning-surface axis of the event taxonomy.
 *
 * This is the pure, render-free subset of the prototype's
 * `TimelineSurfaceContext`: just the {@link TimelineSurface} union, the
 * security-alert membership set, and its predicate. The prototype's React
 * context and the surface-specific rendering predicates (avatar placement,
 * gutterless layout, audit-log affordances) are intentionally left behind — the
 * taxonomy only needs to name surfaces and know which ones are security alerts.
 *
 * Provenance: ported from the Timeline redesign prototype
 * (github/prototyping, `src/packages/conversation/timeline`). See the Phase 3
 * Timeline Playground issue and the `data-*` event contract (both
 * github/primer#6664).
 */

/**
 * Which conversation surface a timeline is rendered inside. This is axis L1 of
 * the event taxonomy ({@link EventScope} aliases it).
 */
export type TimelineSurface =
  | 'pull'
  | 'issue'
  | 'dependabot'
  | 'code-scanning'
  | 'secret-scanning'
  | 'license-compliance'

/**
 * The security-alert surfaces — Dependabot alerts and the three scanning
 * surfaces (code scanning, secret scanning, license compliance). They share a
 * family of behaviours (no audit split, flat single-list record) that
 * distinguish them from conversational PR/Issue timelines. Centralized so the
 * predicate below and every taxonomy consumer agree on the same membership set.
 */
export const SECURITY_ALERT_SURFACES = [
  'dependabot',
  'code-scanning',
  'secret-scanning',
  'license-compliance',
] as const satisfies readonly TimelineSurface[]

const SECURITY_ALERT_SURFACE_SET: ReadonlySet<TimelineSurface> = new Set(SECURITY_ALERT_SURFACES)

/** Whether a surface is one of the security-alert surfaces. */
export function isSecurityAlertSurface(surface: TimelineSurface): boolean {
  return SECURITY_ALERT_SURFACE_SET.has(surface)
}
