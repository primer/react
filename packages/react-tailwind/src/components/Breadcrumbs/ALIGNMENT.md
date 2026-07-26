# Alignment

## From: `@primer/react`

`Breadcrumbs` renders an ordered breadcrumb navigation with `Breadcrumbs.Item` children. Items support `href`, `selected`, `separator`, and the polymorphic link behavior supplied by the legacy component. The `overflow` prop collapses items into an overflow menu, while `variant` controls the visual treatment. The legacy implementation combines styled-system props, CSS modules, and the older `ActionMenu` composition for overflow.

## To: `@primer/react-tailwind`

The Tailwind component preserves `Breadcrumbs`, `Breadcrumbs.Item`, `overflow`, and `variant`, and continues to render a navigation landmark with an ordered list. Its layout, separators, selected state, and responsive styling use Tailwind utilities and Primer tokens. Overflow is composed with the package's `ActionMenu` rather than the legacy menu implementation. The component remains presentational/navigation behavior; it is not a Base UI replacement.

## Migration notes

- Normal breadcrumb and item composition is intended to be drop-in.
- Verify custom overflow menu styling or selectors against the new `ActionMenu` composition.
- Remove `sx` and other styled-system props.
