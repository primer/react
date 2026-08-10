/**
 * Generic `data-*` serializer for the Timeline event contract (github/primer#6664).
 *
 * This is the product-agnostic core: it serializes an already-projected event
 * input into the `data-*` attribute set, and offers a factory that binds a
 * concrete catalog (and an optional login → actor resolver) into a per-catalog
 * projection. The GitHub-specific values live in `../github`; nothing here knows
 * about GitHub surfaces, categories, or bot logins.
 *
 * Not part of the public `@primer/react` export surface.
 */

import type {ActorType, EventTaxonomyEntry, EventVisibility} from './types'

/** Input for the `data-*` projection. Generic: `scope` and `category` are free strings. */
export interface EventDataAttributeInput {
  /** Owning surface — free-form so the core stays product-agnostic. */
  scope: string
  /** Unscoped leaf type (e.g. `opened`). */
  type: string
  /** Category family — free-form so the core stays product-agnostic. */
  category: string
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
 * Canonical serializer for the event `data-*` contract (primer#6664). The single
 * place that turns an already-projected input object into the attribute set; a
 * row renderer can delegate here so the contract has exactly one implementation.
 * `data-event-type` is the **unscoped** leaf; the surface travels in
 * `data-event-scope`. `data-actor-type` is omitted entirely for actor-less events
 * rather than emitted empty.
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
 * Build a per-catalog `data-*` projection. Given a `catalog` of
 * `scope → type → {@link EventTaxonomyEntry}` (and an optional `resolveActor`
 * that maps a login to an {@link ActorType}), returns a
 * `(scope, type, login?) => EventDataAttributes` function that:
 *
 *  - reads `category` and `visibility` from the catalog entry, so a consumer
 *    never re-declares the taxonomy (`auditOnly` leaves keep their visibility);
 *  - emits `data-actor-type` only when the leaf is actor-capable
 *    (`hasActor: true`) AND a `login` is supplied AND a `resolveActor` was
 *    provided — a structurally actor-less leaf (`hasActor: false`) never emits
 *    `data-actor-type`, regardless of any login passed.
 *
 * The returned function keeps per-scope compile-time safety via mapped types: a
 * `type` must be a real leaf of the given `scope`'s catalog.
 */
export function createEventDataAttributesFor<Catalog extends Record<string, Record<string, EventTaxonomyEntry>>>(
  catalog: Catalog,
  resolveActor?: (login: string | undefined) => ActorType,
) {
  return <S extends keyof Catalog & string>(
    scope: S,
    type: keyof Catalog[S] & string,
    login?: string,
  ): EventDataAttributes => {
    const entry = catalog[scope][type]
    return toEventDataAttributes({
      scope,
      type,
      category: entry.category,
      visibility: entry.visibility,
      actorType: resolveActor && entry.hasActor && login ? resolveActor(login) : undefined,
    })
  }
}
