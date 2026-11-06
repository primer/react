# Alignment

## From: `@primer/react`

`CounterLabel` renders a compact count badge with `primary` and `secondary` variants. The legacy implementation uses CSS-module styles and supports the deprecated `scheme` prop in addition to the current variant API. Its count can be exposed through visually hidden text, while children provide the visible label. Legacy shared props also allow styled-system customization.

## To: `@primer/react-tailwind`

Tailwind `CounterLabel` keeps the `primary` and `secondary` variants, visible children, and accessible count semantics. It uses Tailwind classes and Primer semantic tokens for the badge surface and text, with React 19-compatible HTML composition. The deprecated `scheme` API is not implemented. The component remains a small presentational label and does not introduce a behavioral primitive.

## Migration notes

- Keep `variant`, children, and count-related content unchanged.
- Replace deprecated `scheme` usage with `variant`.
- Remove `sx`, styled-system props, and CSS-module selectors.
