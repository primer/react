/**
 * Generic Timeline event taxonomy — shared, product-agnostic types.
 *
 * This is the render-free, GitHub-agnostic core of the taxonomy: the shape of a
 * catalog entry, the coarse actor classification, and the visibility facet. A
 * product-specific layer (see `../github`) supplies the concrete surfaces,
 * categories, and event catalogs; this core only describes the schema those
 * values plug into.
 *
 * Not part of the public `@primer/react` export surface — it stays beside the
 * Timeline component for the stories and the planned playground to consume.
 */

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
 * Coarse actor classification, surfaced as the `data-actor-type` attribute on
 * event rows (mirrors the Primer Timeline `data-*` convention from
 * github/primer#6664, alongside `data-event-type` / `data-event-scope`).
 *
 * "bot" covers automated actors; everything else is a human "user". This lets a
 * filtering/grouping pass target automated vs. human activity declaratively. The
 * mapping from a login to a value is product-specific (see `../github`).
 */
export type ActorType = 'user' | 'bot'

/**
 * Placement of one event on the non-identity axes (category + facets). Generic
 * over the category union so a product layer can pin `category` to its own set
 * (e.g. the GitHub `EventCategory`) while the core stays value-agnostic; the
 * default `string` keeps the serializer and factory catalog-shape generic.
 */
export interface EventTaxonomyEntry<TCategory extends string = string> {
  /**
   * Category family — axis L2. Drives `data-event-category` and any grouping the
   * product layer offers.
   */
  category: TCategory
  /**
   * Default density facet — `data-event-visibility`. Omit for `primary` (the
   * common case); set `auditOnly` for events that only ever render in the audit
   * view.
   */
  visibility?: EventVisibility
  /**
   * Whether the event renders through the **actor-capable** path. `false` only
   * for structurally actor-less events — these emit no `data-actor-type`. `true`
   * means the row can carry an actor, but PRESENCE is data-driven, so an
   * actor-capable event still renders actor-less when its payload has no actor.
   * The concrete `user | bot` value is resolved at runtime from the actor login,
   * never fixed by event type; `data-actor-type` is omitted whenever no actor is
   * present.
   */
  hasActor: boolean
}
