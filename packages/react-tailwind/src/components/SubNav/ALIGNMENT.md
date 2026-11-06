# Alignment

## From: `@primer/react`

`SubNav` is a horizontal navigation composition with `SubNav.Links` and `SubNav.Link` parts. Legacy CSS modules provide the border, spacing, selected state, and responsive layout; shared styled-system props are available on the component and its parts. The component is structural navigation and does not manage route state.

## To: `@primer/react-tailwind`

Tailwind preserves the SubNav compound names and native link/button composition while replacing CSS modules with Tailwind utilities and Primer semantic tokens. Selected and disabled states remain represented by the rendered item props, while routing and current-page state remain external. No Base UI primitive is involved. React 19-compatible native element props are supported, but legacy CSS selectors and styled-system styling are intentionally omitted.

## Migration notes

- Existing navigation composition and state ownership can be retained.
- Recheck custom selectors for borders, selected state, and item spacing.
- Remove `sx` and styled-system props.
