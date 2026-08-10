/**
 * GitHub-specific Timeline taxonomy — entry point.
 *
 * The GitHub product knowledge layer: the concrete surfaces, category model,
 * per-surface event catalogs, actor-classification rule, and the bound
 * `data-*` projection helper. Builds on the generic `../core`.
 */

export * from './surfaces'
export * from './eventCategories'
export * from './catalogs'
export * from './actorType'
export * from './eventDataAttributesFor'
