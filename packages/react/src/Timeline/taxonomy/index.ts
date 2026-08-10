/**
 * Timeline event taxonomy — public entry point.
 *
 * The single categorization model for the redesigned Primer Timeline, ported
 * from the Timeline redesign prototype (github/prototyping,
 * `src/packages/conversation/timeline`). Every consumer — the `data-*` event
 * contract, the Storybook per-surface stories, and the
 * planned Timeline Playground (all github/primer#6664) — is a projection of this one
 * catalog, not a separately maintained list.
 *
 * Not yet part of the public `@primer/react` export surface: this lands the
 * source beside the Timeline component so stories and the playground can consume
 * it. Promoting the projections (`toEventDataAttributes`, the catalogs) to the
 * package's public API is deferred until the model is ratified.
 *
 * The module is split into a generic, product-agnostic `./core` (the `data-*`
 * schema, serializer, and factory) and a GitHub-specific `./github` (surfaces,
 * categories, catalogs, actor rules, and the bound `eventDataAttributesFor`
 * helper). This barrel re-exports both, so the full symbol set — including
 * `eventDataAttributesFor` — stays available from `./taxonomy`.
 */

export * from './core'
export * from './github'
