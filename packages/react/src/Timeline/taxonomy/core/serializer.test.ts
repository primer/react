/**
 * Tests for the generic `data-*` serializer and the `createEventDataAttributesFor`
 * factory. Uses a small product-agnostic fixture catalog so the core stays
 * decoupled from the GitHub-specific values. Covers actor resolution (bot / user
 * / no-login), the `hasActor: false` suppression, `auditOnly` pass-through, and
 * catalog-derived category.
 */

import {describe, it, expect} from 'vitest'
import {toEventDataAttributes, createEventDataAttributesFor} from './serializer'
import type {ActorType, EventTaxonomyEntry} from './types'

const FIXTURE_CATALOG = {
  alpha: {
    created: {category: 'lifecycle', hasActor: true},
    noted: {category: 'lifecycle', hasActor: false},
    archived: {category: 'housekeeping', visibility: 'auditOnly', hasActor: true},
  },
} satisfies Record<string, Record<string, EventTaxonomyEntry>>

const resolveActor = (login: string | undefined): ActorType =>
  login && login.toLowerCase().endsWith('[bot]') ? 'bot' : 'user'

describe('toEventDataAttributes', () => {
  it('serializes the axes with the unscoped type and defaults visibility to primary', () => {
    const attrs = toEventDataAttributes({scope: 'alpha', type: 'created', category: 'lifecycle', actorType: 'user'})
    expect(attrs).toEqual({
      'data-event-scope': 'alpha',
      'data-event-type': 'created',
      'data-event-category': 'lifecycle',
      'data-event-visibility': 'primary',
      'data-actor-type': 'user',
    })
  })

  it('respects an explicit auditOnly visibility', () => {
    const attrs = toEventDataAttributes({
      scope: 'alpha',
      type: 'archived',
      category: 'housekeeping',
      visibility: 'auditOnly',
    })
    expect(attrs['data-event-visibility']).toBe('auditOnly')
  })

  it('omits data-actor-type for actor-less events rather than emitting empty', () => {
    const attrs = toEventDataAttributes({scope: 'alpha', type: 'noted', category: 'lifecycle'})
    expect('data-actor-type' in attrs).toBe(false)
  })
})

describe('createEventDataAttributesFor', () => {
  const attributesFor = createEventDataAttributesFor(FIXTURE_CATALOG, resolveActor)

  it('resolves a bot login to data-actor-type "bot"', () => {
    const attrs = attributesFor('alpha', 'created', 'some-app[bot]')
    expect(attrs['data-actor-type']).toBe('bot')
    expect(attrs['data-event-scope']).toBe('alpha')
    expect(attrs['data-event-type']).toBe('created')
  })

  it('resolves a plain user login to data-actor-type "user"', () => {
    const attrs = attributesFor('alpha', 'created', 'monalisa')
    expect(attrs['data-actor-type']).toBe('user')
  })

  it('omits data-actor-type entirely when no login is passed', () => {
    const attrs = attributesFor('alpha', 'created')
    expect('data-actor-type' in attrs).toBe(false)
  })

  it('never emits data-actor-type for a hasActor:false leaf, even with a login', () => {
    const attrs = attributesFor('alpha', 'noted', 'monalisa')
    expect('data-actor-type' in attrs).toBe(false)
  })

  it('passes through auditOnly visibility from the catalog entry', () => {
    const attrs = attributesFor('alpha', 'archived', 'monalisa')
    expect(attrs['data-event-visibility']).toBe('auditOnly')
  })

  it('derives data-event-category from the catalog entry', () => {
    const attrs = attributesFor('alpha', 'archived')
    expect(attrs['data-event-category']).toBe('housekeeping')
  })

  it('emits no data-actor-type when no resolveActor is provided', () => {
    const attributesWithoutResolver = createEventDataAttributesFor(FIXTURE_CATALOG)
    const attrs = attributesWithoutResolver('alpha', 'created', 'some-app[bot]')
    expect('data-actor-type' in attrs).toBe(false)
  })
})
