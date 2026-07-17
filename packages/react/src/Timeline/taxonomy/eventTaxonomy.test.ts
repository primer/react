/**
 * Tests for the event taxonomy source of truth — the License Compliance catalog
 * and the three projections derived from it (flattened keys, `data-*`
 * attributes, by-category grouping).
 */

import {describe, it, expect} from 'vitest'
import {
  LICENSE_COMPLIANCE_SCOPE,
  LICENSE_COMPLIANCE_TAXONOMY,
  SURFACE_TAXONOMIES,
  ISSUE_TAXONOMY,
  taxonomyCategoriesMatchSurface,
  qualifyEventType,
  unqualifyEventType,
  toEventDataAttributes,
  eventTypesByCategory,
  type LicenseComplianceEventType,
  type CodeScanningEventType,
  type CatalogedScope,
} from './eventTaxonomy'
import {
  SURFACE_CATEGORIES,
  ALL_TOGGLEABLE_CATEGORIES,
  isToggleableCategory,
  surfacesForCategory,
} from './eventCategories'
import {actorTypeForLogin} from './actorType'
import {SECURITY_ALERT_SURFACES, isSecurityAlertSurface} from './surfaces'

const LC_TYPES = Object.keys(LICENSE_COMPLIANCE_TAXONOMY) as LicenseComplianceEventType[]

describe('LICENSE_COMPLIANCE_TAXONOMY', () => {
  it('is the authoritative nine unscoped leaf types (primer/react#8075)', () => {
    expect(LC_TYPES).toEqual([
      'opened',
      'appeared_in_branch',
      'review_requested',
      'review_approved',
      'review_denied',
      'review_expired',
      'exception_added',
      'licenses_added',
      'closed',
    ])
  })

  it('uses unscoped leaves (no redundant license_compliance_ prefix)', () => {
    for (const type of LC_TYPES) {
      expect(type.startsWith('license_compliance')).toBe(false)
    }
  })

  it('only uses categories the License Compliance surface offers, and covers all three', () => {
    const surfaceCategories = SURFACE_CATEGORIES[LICENSE_COMPLIANCE_SCOPE]
    const used = new Set(LC_TYPES.map(type => LICENSE_COMPLIANCE_TAXONOMY[type].category))
    for (const category of used) {
      expect(surfaceCategories).toContain(category)
      expect(isToggleableCategory(category)).toBe(true)
    }
    expect([...used].sort()).toEqual([...surfaceCategories].sort())
  })

  it('marks only the structurally actor-less synthetic event as actor-less', () => {
    const withoutActor = LC_TYPES.filter(type => !LICENSE_COMPLIANCE_TAXONOMY[type].hasActor)
    expect(withoutActor).toEqual(['appeared_in_branch'])
  })
})

describe('qualifyEventType', () => {
  it('snake-cases the scope and matches the flattened snake_case key convention', () => {
    expect(qualifyEventType('license-compliance', 'opened')).toBe('license_compliance_opened')
    expect(qualifyEventType('license-compliance', 'review_requested')).toBe('license_compliance_review_requested')
  })

  it('produces the corrected key for the drifted branch event', () => {
    // The real leaf is `appeared_in_branch` (not the shortened `appeared`), so
    // the qualified key carries the full suffix.
    expect(qualifyEventType('license-compliance', 'appeared_in_branch')).toBe('license_compliance_appeared_in_branch')
  })
})

describe('unqualifyEventType', () => {
  it('recovers the unscoped leaf from a flattened security-surface key', () => {
    expect(unqualifyEventType('license-compliance', 'license_compliance_appeared_in_branch')).toBe('appeared_in_branch')
    expect(unqualifyEventType('license-compliance', 'license_compliance_opened')).toBe('opened')
  })

  it('leaves an already-unscoped key untouched (pull/issue carry no prefix)', () => {
    expect(unqualifyEventType('pull', 'labeled')).toBe('labeled')
    expect(unqualifyEventType('pull', 'review')).toBe('review')
  })

  it('round-trips with qualifyEventType for every License Compliance leaf', () => {
    for (const type of LC_TYPES) {
      const flattened = qualifyEventType(LICENSE_COMPLIANCE_SCOPE, type)
      expect(unqualifyEventType(LICENSE_COMPLIANCE_SCOPE, flattened)).toBe(type)
    }
  })

  it('leaves raw issue leaves that start with the scope token untouched', () => {
    // Regression: the `issue` scope prefix (`issue_`) collides with three real
    // unscoped leaves. A naive prefix strip corrupts them to `type_added` etc.;
    // they must pass through unchanged because they are already unscoped.
    for (const leaf of ['issue_type_added', 'issue_type_removed', 'issue_type_changed'] as const) {
      expect(unqualifyEventType('issue', leaf)).toBe(leaf)
      // …while a genuinely qualified key still reverses cleanly.
      expect(unqualifyEventType('issue', qualifyEventType('issue', leaf))).toBe(leaf)
    }
  })

  it('round-trips with qualifyEventType for every Issue leaf', () => {
    for (const type of Object.keys(ISSUE_TAXONOMY)) {
      expect(unqualifyEventType('issue', qualifyEventType('issue', type))).toBe(type)
    }
  })
})

describe('toEventDataAttributes', () => {
  it('emits the unscoped type with the surface carried separately in scope', () => {
    const attrs = toEventDataAttributes({
      scope: 'license-compliance',
      type: 'opened',
      category: 'findings',
      actorType: 'user',
    })
    expect(attrs).toEqual({
      'data-event-scope': 'license-compliance',
      'data-event-type': 'opened',
      'data-event-category': 'findings',
      'data-event-visibility': 'primary',
      'data-actor-type': 'user',
    })
  })

  it('defaults visibility to primary', () => {
    const attrs = toEventDataAttributes({
      scope: 'license-compliance',
      type: 'closed',
      category: 'findings',
    })
    expect(attrs['data-event-visibility']).toBe('primary')
  })

  it('respects an explicit visibility', () => {
    const attrs = toEventDataAttributes({
      scope: 'pull',
      type: 'labeled',
      category: 'references',
      visibility: 'auditOnly',
    })
    expect(attrs['data-event-visibility']).toBe('auditOnly')
  })

  it('omits data-actor-type for actor-less events rather than emitting empty', () => {
    const attrs = toEventDataAttributes({
      scope: 'license-compliance',
      type: 'appeared_in_branch',
      category: 'findings',
    })
    expect('data-actor-type' in attrs).toBe(false)
  })
})

describe('eventTypesByCategory', () => {
  it('groups leaves by category, folding the two policy events into one status group', () => {
    const groups = eventTypesByCategory(LICENSE_COMPLIANCE_TAXONOMY)
    expect(groups.findings).toEqual(['opened', 'appeared_in_branch', 'closed'])
    expect(groups.reviews).toEqual(['review_requested', 'review_approved', 'review_denied', 'review_expired'])
    expect(groups.status).toEqual(['exception_added', 'licenses_added'])
  })

  it('preserves catalog declaration order within each group', () => {
    const groups = eventTypesByCategory(LICENSE_COMPLIANCE_TAXONOMY)
    // `exception_added` is declared before `licenses_added`.
    expect(groups.status?.indexOf('exception_added')).toBeLessThan(groups.status?.indexOf('licenses_added') ?? -1)
  })
})

describe('SURFACE_TAXONOMIES (cross-surface model)', () => {
  const scopes = Object.keys(SURFACE_TAXONOMIES) as CatalogedScope[]

  it('formalizes the five in-scope surfaces (PR out of scope this pass)', () => {
    expect(scopes.sort()).toEqual(
      ['code-scanning', 'dependabot', 'issue', 'license-compliance', 'secret-scanning'].sort(),
    )
  })

  it('every catalog only uses categories its surface offers (metadata always allowed)', () => {
    for (const scope of scopes) {
      const mismatches = taxonomyCategoriesMatchSurface(scope, SURFACE_TAXONOMIES[scope])
      expect({scope, mismatches}).toEqual({scope, mismatches: []})
    }
  })

  it('uses unscoped leaves for multi-word scopes (no redundant surface prefix)', () => {
    // Only kebab (multi-word) scopes can carry an unambiguous redundant prefix;
    // single-token scopes legitimately own leaves like `issue_type_added`.
    for (const scope of scopes.filter(s => s.includes('-'))) {
      const snakeScope = scope.replace(/-/g, '_')
      for (const type of Object.keys(SURFACE_TAXONOMIES[scope])) {
        expect(type.startsWith(`${snakeScope}_`)).toBe(false)
      }
    }
  })

  it('marks every issue metadata leaf auditOnly and leaves toggleable leaves unset', () => {
    // Raw `visibility` field: metadata leaves must explicitly carry 'auditOnly';
    // every other leaf omits the facet and defaults to primary at projection time.
    const actual = Object.fromEntries(Object.entries(ISSUE_TAXONOMY).map(([type, entry]) => [type, entry.visibility]))
    const expected = Object.fromEntries(
      Object.entries(ISSUE_TAXONOMY).map(([type, entry]) => [
        type,
        entry.category === 'metadata' ? 'auditOnly' : undefined,
      ]),
    )
    expect(actual).toEqual(expected)
  })

  it('excludes PR-only families from the issue catalog', () => {
    const issueCategories = new Set(Object.values(ISSUE_TAXONOMY).map(entry => entry.category))
    // Issues never offer commits, merging, or reviews (see SURFACE_CATEGORIES.issue).
    expect(issueCategories.has('commits')).toBe(false)
    expect(issueCategories.has('merging')).toBe(false)
    expect(issueCategories.has('reviews')).toBe(false)
  })

  it('models the whole security-alert detection group as no-actor on code scanning', () => {
    const codeScanning = SURFACE_TAXONOMIES['code-scanning']
    const detectionGroup: CodeScanningEventType[] = ['detected', 'appeared', 'reappeared', 'fixed']
    const actorFlags = Object.fromEntries(detectionGroup.map(type => [type, codeScanning[type].hasActor]))
    const expected = Object.fromEntries(detectionGroup.map(type => [type, false]))
    expect(actorFlags).toEqual(expected)
    // The folded closure leaf stays actor-capable (BECAME_OUTDATED is system,
    // CLOSED_BY_USER carries an actor), so presence is data-driven.
    expect(codeScanning.closed.hasActor).toBe(true)
  })

  it('models every dependabot leaf as actor-ful (Dependabot renders itself as a bot actor)', () => {
    const dependabot = SURFACE_TAXONOMIES['dependabot']
    // Verified against the primer/react Dependabot Storybook: seven leaves, and
    // unlike code scanning there are NO structurally actor-less events — the
    // detection/auto paths render the Dependabot bot actor.
    expect(Object.keys(dependabot).sort()).toEqual(
      [
        'opened',
        'fixed',
        'dismissed',
        'reopened',
        'dismissal_requested',
        'dismissal_reviewed',
        'dismissal_cancelled',
      ].sort(),
    )
    const actorFlags = Object.fromEntries(Object.entries(dependabot).map(([type, entry]) => [type, entry.hasActor]))
    const everyLeafHasActor = Object.fromEntries(Object.keys(dependabot).map(type => [type, true]))
    expect(actorFlags).toEqual(everyLeafHasActor)
  })
})

describe('actorTypeForLogin', () => {
  it('treats a missing login as a human user', () => {
    expect(actorTypeForLogin(undefined)).toBe('user')
    expect(actorTypeForLogin('')).toBe('user')
  })

  it('classifies any `[bot]`-suffixed login as a bot, case-insensitively', () => {
    expect(actorTypeForLogin('renovate[bot]')).toBe('bot')
    expect(actorTypeForLogin('Some-App[BOT]')).toBe('bot')
  })

  it('classifies known first-party automation logins as bots', () => {
    for (const login of ['dependabot', 'github-actions', 'github-license-compliance', 'copilot', 'hubot']) {
      expect(actorTypeForLogin(login)).toBe('bot')
      expect(actorTypeForLogin(login.toUpperCase())).toBe('bot')
    }
  })

  it('classifies an ordinary login as a human user', () => {
    expect(actorTypeForLogin('octocat')).toBe('user')
    // A human whose name merely contains "bot" is not a bot.
    expect(actorTypeForLogin('robotta')).toBe('user')
  })
})

describe('surfacesForCategory', () => {
  it('is the inverse of SURFACE_CATEGORIES and returns surfaces in canonical order', () => {
    // `merging` is a pull-only category.
    expect(surfacesForCategory('merging')).toEqual(['pull'])
    // `findings` is shared by exactly the four security-alert surfaces.
    expect(surfacesForCategory('findings')).toEqual([
      'dependabot',
      'code-scanning',
      'secret-scanning',
      'license-compliance',
    ])
  })

  it('agrees with SURFACE_CATEGORIES for every surface/category pair', () => {
    for (const category of ALL_TOGGLEABLE_CATEGORIES) {
      for (const surface of surfacesForCategory(category)) {
        expect(SURFACE_CATEGORIES[surface]).toContain(category)
      }
    }
  })
})

describe('isSecurityAlertSurface', () => {
  it('is true for exactly the four security-alert surfaces', () => {
    for (const surface of SECURITY_ALERT_SURFACES) {
      expect(isSecurityAlertSurface(surface)).toBe(true)
    }
  })

  it('is false for the conversational surfaces', () => {
    expect(isSecurityAlertSurface('pull')).toBe(false)
    expect(isSecurityAlertSurface('issue')).toBe(false)
  })
})
