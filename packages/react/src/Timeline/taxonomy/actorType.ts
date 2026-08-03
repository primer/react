/**
 * Ported from the Timeline redesign prototype (github/prototyping,
 * src/packages/conversation/timeline). Backs the taxonomy model documented in
 * github/primer docs/timeline-audit/. Related: github/primer#6664 (Phase 3:
 * Timeline Playground, taxonomy, and data-* tagging), parent epic
 * github/primer#6654, primer/react#8075 (License Compliance stories).
 */

/**
 * Coarse actor classification, surfaced as the `data-actor-type` attribute on
 * event rows (mirrors the Primer Timeline `data-*` convention from
 * github/primer#6664, alongside `data-event-type` / `data-event-scope`).
 *
 * "bot" covers GitHub apps and first-party automation (Dependabot, Actions,
 * Copilot, Hubot) plus any `…[bot]` login; everything else is a human "user".
 * This lets a filtering/grouping pass target automated vs. human activity
 * declaratively — e.g. collapsing the system lifecycle on a security alert.
 */

export type ActorType = 'user' | 'bot'

const BOT_LOGINS: ReadonlySet<string> = new Set([
  'dependabot',
  'dependabot-preview',
  'github-actions',
  'github-license-compliance',
  'copilot',
  'hubot',
])

export function actorTypeForLogin(login: string | undefined): ActorType {
  if (!login) return 'user'
  const normalized = login.toLowerCase()
  if (normalized.endsWith('[bot]')) return 'bot'
  return BOT_LOGINS.has(normalized) ? 'bot' : 'user'
}
