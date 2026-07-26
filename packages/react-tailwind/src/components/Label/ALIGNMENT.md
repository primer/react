# Alignment

## From: `@primer/react`

`Label` is a compact, polymorphic label with `variant` (`accent`, `attention`, `danger`, `done`, `neutral`, `sponsors`, or `severe`) and `size` (`small` or `medium`). The legacy implementation uses data attributes and CSS modules, and its shared prop types include styled-system customization. It is presentational and does not provide form-label association automatically.

## To: `@primer/react-tailwind`

Tailwind keeps the `Label` name, variants, sizes, `as` polymorphism, children, and native HTML props. Styling is expressed with Tailwind classes and Primer semantic tokens rather than the legacy data-attribute/CSS-module system. There is no Base UI behavior and no new form-control association; use native `htmlFor`/`id` when a form label is intended. The legacy styling-system surface and deprecated aliases are omitted.

## Migration notes

- Existing `variant`, `size`, and semantic `as` usage can be retained.
- Add explicit form association where needed.
- Remove `sx`, styled-system props, and selectors targeting legacy data attributes.
