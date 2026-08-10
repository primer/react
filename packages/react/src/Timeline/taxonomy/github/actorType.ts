/**
 * Ported from the Timeline redesign prototype (github/prototyping,
 * src/packages/conversation/timeline). Backs the taxonomy model documented in
 * github/primer docs/timeline-audit/. Related: github/primer#6664 (Phase 3:
 * Timeline Playground, taxonomy, and data-* tagging), parent epic
 * github/primer#6654, primer/react#8075 (License Compliance stories).
 */

import type {ActorType} from '../core'

/**
 * GitHub's login → {@link ActorType} mapping. "bot" covers GitHub apps and
 * first-party automation (Dependabot, Actions, Copilot, Hubot) plus any
 * `…[bot]` login; everything else is a human "user". This lets a
 * filtering/grouping pass target automated vs. human activity declaratively,
 * e.g. collapsing the system lifecycle on a security alert.
 */
const BOT_LOGINS: ReadonlySet<string> = new Set([
  'dependabot',
  'dependabot-preview',
  'github-actions',
  'github-license-compliance',
  // `github` is the platform system identity (e.g. Secret Scanning's automated
  // detection/validity events). Classified as a bot so automated-vs-human
  // filtering treats system activity like other automation; a distinct
  // 'system' actor type is a possible future refinement.
  'github',
  'copilot',
  'hubot',
])

export function actorTypeForLogin(login: string | undefined): ActorType {
  if (!login) return 'user'
  const normalized = login.toLowerCase()
  if (normalized.endsWith('[bot]')) return 'bot'
  return BOT_LOGINS.has(normalized) ? 'bot' : 'user'
}
