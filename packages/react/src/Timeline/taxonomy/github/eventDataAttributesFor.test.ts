/**
 * Tests for the consolidated `data-*` projection `eventDataAttributesFor` — the
 * shared helper the per-surface Storybook stories consume. Covers actor
 * resolution (bot vs user), actor omission, `auditOnly` pass-through, the
 * `hasActor: false` actor suppression, and catalog-derived category.
 */

import {describe, it, expect} from 'vitest'
import {eventDataAttributesFor} from './eventDataAttributesFor'

describe('eventDataAttributesFor', () => {
  it('resolves a bot login to data-actor-type "bot"', () => {
    const attrs = eventDataAttributesFor('dependabot', 'opened', 'dependabot[bot]')
    expect(attrs['data-actor-type']).toBe('bot')
    expect(attrs['data-event-scope']).toBe('dependabot')
    expect(attrs['data-event-type']).toBe('opened')
  })

  it('resolves a plain user login to data-actor-type "user"', () => {
    const attrs = eventDataAttributesFor('issue', 'closed', 'monalisa')
    expect(attrs['data-actor-type']).toBe('user')
  })

  it('omits data-actor-type entirely when no login is passed', () => {
    const attrs = eventDataAttributesFor('issue', 'closed')
    expect('data-actor-type' in attrs).toBe(false)
  })

  it('preserves auditOnly visibility for a metadata leaf', () => {
    const attrs = eventDataAttributesFor('issue', 'labeled', 'monalisa')
    expect(attrs['data-event-visibility']).toBe('auditOnly')
    expect(attrs['data-event-category']).toBe('metadata')
  })

  it('defaults visibility to primary for a non-metadata leaf', () => {
    const attrs = eventDataAttributesFor('license-compliance', 'review_requested', 'monalisa')
    expect(attrs['data-event-visibility']).toBe('primary')
  })

  it('never emits data-actor-type for a hasActor:false leaf, even with a login', () => {
    const attrs = eventDataAttributesFor('license-compliance', 'appeared_in_branch', 'monalisa')
    expect('data-actor-type' in attrs).toBe(false)
  })

  it('derives data-event-category from the catalog entry', () => {
    const attrs = eventDataAttributesFor('license-compliance', 'review_requested')
    expect(attrs['data-event-category']).toBe('reviews')
  })
})
