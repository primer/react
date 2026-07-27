'use client'

import React from 'react'
import {flattenChildren} from './children'

/**
 * Describes how a parent recognizes one of its named regions among its children.
 *
 * `multiple` regions collect every match in authored order; singular regions keep only the
 * first match so a stray duplicate falls through to `rest` rather than silently rendering
 * twice. `keep` leaves matches in `rest` for parents that render children in place and only
 * need to know which regions are present.
 */
export interface RegionSpec<Props = unknown> {
  match: RegionMatcher<Props>
  multiple?: boolean
  keep?: boolean
}

export type RegionMatcher<Props = unknown> = (child: React.ReactElement) => child is React.ReactElement<Props>

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each region carries its own part props
type AnySpecs = Record<string, RegionSpec<any>>

type SpecProps<Spec> = Spec extends RegionSpec<infer Props> ? Props : never

export interface ResolvedRegions<Specs extends AnySpecs> {
  /** What to render for each region: the element prop when supplied, otherwise the matched children. */
  regions: {[Name in keyof Specs]: React.ReactNode}
  /** Only the children that matched, so parents can still read part props for layout decisions. */
  matched: {[Name in keyof Specs]: React.ReactElement<SpecProps<Specs[Name]>>[]}
  /** Everything that did not fill a region, in authored order. */
  rest: React.ReactNode[]
}

/**
 * Extracts named regions from `children` in a single pass and lets an explicit element prop
 * take precedence over a matched child.
 *
 * The element prop is the escape hatch for consumers whose own component wraps a part: a
 * wrapper is unrecognizable by identity, but it can always be handed to the parent directly.
 * Resolution stays in render so it is SSR-safe, and unmatched children keep authored order.
 */
export function resolveRegions<Specs extends AnySpecs>(
  children: React.ReactNode,
  specs: Specs,
  overrides?: Partial<{[Name in keyof Specs]: React.ReactNode}>,
): ResolvedRegions<Specs> {
  const names = Object.keys(specs) as (keyof Specs & string)[]
  const matched: Record<string, React.ReactElement[]> = {}
  for (const name of names) matched[name] = []

  const rest: React.ReactNode[] = []

  for (const child of flattenChildren(children)) {
    let consumed = false
    if (React.isValidElement(child)) {
      for (const name of names) {
        const spec = specs[name]
        if (!spec.multiple && matched[name].length > 0) continue
        if (!spec.match(child)) continue
        matched[name].push(child)
        consumed = !spec.keep
        break
      }
    }
    if (!consumed) rest.push(child)
  }

  const regions: Record<string, React.ReactNode> = {}
  for (const name of names) {
    const matches = matched[name]
    const fromChildren = specs[name].multiple ? (matches.length > 0 ? matches : undefined) : matches[0]
    regions[name] = overrides?.[name] ?? fromChildren
  }

  return {regions, matched, rest} as ResolvedRegions<Specs>
}

/** Matches a child rendered by `component`, the identity check most compound parts use. */
export function isPartOf<Props>(component: React.ComponentType<Props>): RegionMatcher<Props>
export function isPartOf(component: React.ElementType): RegionMatcher
export function isPartOf(component: React.ElementType): RegionMatcher {
  return (child: React.ReactElement): child is React.ReactElement => child.type === component
}

/** Matches a child whose component type carries `marker`, which survives identity-breaking wrappers. */
export function isMarkedWith(marker: symbol): RegionMatcher {
  return (child: React.ReactElement): child is React.ReactElement =>
    Boolean((child.type as unknown as Record<symbol, unknown> | undefined)?.[marker])
}

/**
 * Normalizes a region value that may come from an element prop or from matched children into a
 * list of elements, so parents can keep reading part props for layout decisions.
 */
export function regionElements<Props>(
  override: React.ReactNode,
  matched: React.ReactElement<Props>[],
): React.ReactElement<Props>[] {
  if (override == null) return matched
  return flattenChildren(override).filter((child): child is React.ReactElement<Props> => React.isValidElement(child))
}
