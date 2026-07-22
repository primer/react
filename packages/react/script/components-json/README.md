# Component metadata generation

`npm run build:components.json -w @primer/react` produces the published
`@primer/react/generated/components.json` artifact from the canonical
`*.docs.json` component metadata.

## Composition metadata

The artifact's `composition` field is generated from repository sources; it is
not authored as a separate documentation surface.

- `apiParentChild` identifies component references in documented `children` prop
  types. Its `required` field reports whether that prop itself is required.
- `observed.parentChild` and `observed.adjacentSibling` report JSX nesting and
  adjacent siblings found in colocated default, feature, and example stories,
  plus `*.test.tsx` files.
- Every observed relation includes its occurrence count, number of distinct
  source units, confidence tier, and sorted source provenance. A relation is
  emitted only when it appears in at least two source units. Two sources are
  `medium` evidence; three or more are `high`.

The generator uses docs metadata as the canonical component registry, then
resolves JSX identifiers, aliased named imports, and namespace imports against
that registry. It reads only this package's `src/` tree, so provenance remains
package-relative. It intentionally records source evidence rather than
inferring semantic validity: frequency does not make a composition required,
accessible, or suitable for every use case. Dynamic element selection and
runtime children are not analyzed.

Downstream consumers can use `apiParentChild` for documented type-level
composition contracts and `observed` for source-backed examples. Both are
structured, versioned metadata available from the same public artifact as
component docs, so consumers do not need a separate documentation format.
