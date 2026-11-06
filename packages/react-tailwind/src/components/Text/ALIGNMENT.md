# Alignment

## From: `@primer/react`

Legacy `Text` is a polymorphic typography component with `as`, `size`, `weight`, and `whiteSpace` options. Its CSS-module implementation uses `data-size`, `data-weight`, and `data-white-space` attributes, while shared styled-system props provide additional styling. Its whitespace API accepts kebab-case values such as `pre-wrap` and `pre-line`.

## To: `@primer/react-tailwind`

Tailwind `Text` keeps `as`, `size`, `weight`, and the kebab-case `whiteSpace` values while using Tailwind classes plus Primer tokens for explicit typography variants. When typography variants are omitted, values inherit from the surrounding content like the original implementation. Its default element remains `span`. Styling no longer depends on legacy CSS-module/data-attribute behavior. It remains a native presentational element, not a Base UI primitive, and omits styled-system customization.

## Migration notes

- Preserve core typography props and semantic `as` usage.
- Keep the original whitespace values, including `pre-wrap` and `pre-line`.
- Remove `sx`, styled-system props, and CSS-module selectors.
