# Component metadata generation

`npm run build:components.json -w @primer/react` produces the published
`@primer/react/generated/components.json` artifact from the canonical
`*.docs.json` component metadata.

## Composition metadata

The artifact's `composition` field is generated from repository sources; it is
not authored as a separate documentation surface.

- `apiParentChild` identifies component references in documented `children` prop
  types. Its `childrenPropRequired` field reports whether the parent prop itself
  is required; it does not make an individual referenced child required.
- `apiSubcomponents` records documented compound component APIs without implying
  that a subcomponent must be nested under its parent.
- `observed.parentChild` and `observed.adjacentSibling` report JSX nesting and
  adjacent siblings found in colocated default, feature, and example stories,
  `*.test.tsx` files, and component implementation files.
- `observed.variants` reports static `variant` and `*Variant` JSX prop values.
  `observed.relatedComponents` is an undirected structural index derived from
  observed parent/child and adjacent-sibling relationships.
- Every observed relation includes its occurrence count, number of distinct
  source units, confidence tier, and sorted source provenance. A relation is
  emitted only when it appears in at least two source units. Two sources are
  `medium` evidence; three or more are `high`.

The generator uses docs metadata as the canonical component registry, then
resolves JSX identifiers, aliased named imports, and namespace imports against
that registry. It gathers source units from each documented component's
directory, sorts and deduplicates them before extraction, and reads only this
package's `src/` tree, so provenance remains package-relative. It intentionally
records source evidence rather than inferring semantic validity: frequency does
not make a composition required, accessible, or suitable for every use case.
Dynamic element selection and runtime children are not analyzed.

Not every component has qualifying observed evidence. A missing observation
means that the static sources did not meet the configured threshold, not that a
relationship is invalid. When a component name is available from multiple
entrypoints, consumers should combine source provenance with the corresponding
component record's `importPath` when selecting an implementation.

Downstream consumers can use `apiParentChild` and `apiSubcomponents` for
documented API structure, then use `observed` as source-backed evidence. Both
are structured, versioned metadata available from the same public artifact as
component docs, so consumers do not need a separate documentation format.
