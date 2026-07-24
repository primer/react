/**
 * Consolidated `data-*` projection for cataloged Timeline surfaces.
 *
 * One type-safe generic that replaces the per-surface inline wrappers the
 * Storybook stories used to declare (`lcAttrs`, `codeScanningAttrs`,
 * `dependabotAttrs`, `secretScanningAttrs`, `issueAttrs`). Given a cataloged
 * `scope` and one of that scope's leaf `type`s, it reads the catalog entry from
 * {@link SURFACE_TAXONOMIES} and serializes the event `data-*` contract via
 * {@link toEventDataAttributes} (github/primer#6664). `category` and
 * `visibility` come from the catalog, so a consumer never re-declares the
 * taxonomy; `data-actor-type` resolves at runtime from the row's actor `login`.
 *
 * Not part of the public `@primer/react` export surface — this stays beside the
 * Timeline component for stories and the planned playground to consume.
 */

import {SURFACE_TAXONOMIES, toEventDataAttributes} from './eventTaxonomy'
import type {CatalogedScope, EventDataAttributes, EventTaxonomyEntry} from './eventTaxonomy'
import {actorTypeForLogin} from './actorType'

/**
 * Project a cataloged `(scope, type)` pair (plus the row's optional actor
 * `login`) into the event `data-*` attribute set.
 *
 * `category` and `visibility` are read from the catalog entry, so `auditOnly`
 * metadata leaves keep their visibility automatically. `data-actor-type` is
 * emitted only when the leaf is actor-capable (`hasActor: true`) AND a `login`
 * is supplied; a structurally actor-less leaf (`hasActor: false`) never emits
 * `data-actor-type`, regardless of any login passed.
 */
export function eventDataAttributesFor<S extends CatalogedScope>(
  scope: S,
  type: keyof (typeof SURFACE_TAXONOMIES)[S] & string,
  login?: string,
): EventDataAttributes {
  const entry = SURFACE_TAXONOMIES[scope][type] as EventTaxonomyEntry
  return toEventDataAttributes({
    scope,
    type,
    category: entry.category,
    visibility: entry.visibility,
    actorType: entry.hasActor && login ? actorTypeForLogin(login) : undefined,
  })
}
