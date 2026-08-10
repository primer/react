/**
 * GitHub `data-*` projection for cataloged Timeline surfaces.
 *
 * One type-safe helper that replaces the per-surface inline wrappers the
 * Storybook stories used to declare (`lcAttrs`, `codeScanningAttrs`,
 * `dependabotAttrs`, `secretScanningAttrs`, `issueAttrs`). It is the generic
 * {@link createEventDataAttributesFor} factory from the core, bound to the
 * GitHub {@link SURFACE_TAXONOMIES} catalog and the GitHub
 * {@link actorTypeForLogin} actor rule. Given a cataloged `scope` and one of
 * that scope's leaf `type`s, it reads the catalog entry and serializes the event
 * `data-*` contract (github/primer#6664); `category` and `visibility` come from
 * the catalog, and `data-actor-type` resolves at runtime from the row's actor
 * `login`.
 *
 * Signature: `eventDataAttributesFor(scope, type, login?)`.
 *
 * Not part of the public `@primer/react` export surface — this stays beside the
 * Timeline component for stories and the planned playground to consume.
 */

import {createEventDataAttributesFor} from '../core'
import {SURFACE_TAXONOMIES} from './catalogs'
import {actorTypeForLogin} from './actorType'

export const eventDataAttributesFor = createEventDataAttributesFor(SURFACE_TAXONOMIES, actorTypeForLogin)
