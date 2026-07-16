---
applyTo: 'packages/react/src/**/*'
---

# ADR-backed component review trial

Apply these rules only to behavior or contracts introduced or expanded by the
change. Report concrete impact, cite the rule ID, and do not report pre-existing
migration debt.

## `component-review.children-as-api`

- **Check:** Content uses React children when consumers own the rendered
  elements or need free-form composition.
- **Prefer:** Use data props when the component must own, transform, order, or
  constrain the rendered elements. Do not support equivalent children and data
  APIs without a concrete need.
- **Authority:** `contributor-docs/adrs/adr-004-children-as-api.md`

## `component-review.file-structure`

- **Check:** New components use a PascalCase directory and colocate
  applicable implementation, styles, tests, stories, docs metadata, and exports
  according to repository conventions.
- **Prefer:** Name subcomponent files with the parent component prefix for
  discoverability.
- **Authority:** `contributor-docs/adrs/adr-013-file-structure.md`

## `component-review.internal-modules`

- **Check:** New shared modules that are not public API live under
  `packages/react/src/internal` and are not exported from public entrypoints.
- **Prefer:** Keep implementation details internal until a supported public API
  is intentionally designed.
- **Authority:** `contributor-docs/adrs/adr-015-internal-modules.md`

## `component-review.stable-identifiers` (advisory)

- **Check:** Newly added component roots, public subcomponents, and meaningful
  structural parts follow the established `data-component` naming contract.
- **Prefer:** Use PascalCase component API names, keep state in separate data
  attributes, and test stable identifier values.
- **Authority:** `contributor-docs/adrs/adr-023-stable-selectors-api.md`
