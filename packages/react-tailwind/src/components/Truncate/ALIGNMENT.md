# Alignment

## From: `@primer/react`

`Truncate` constrains text to a `maxWidth`, supports `inline`, and can mark content as `expandable`. Legacy CSS modules provide overflow, ellipsis, and the inline/block treatment; the component forwards legacy shared styling props. The legacy implementation is presentational and does not implement expansion itself.

## To: `@primer/react-tailwind`

Tailwind `Truncate` keeps `maxWidth`, `inline`, `expandable`, children, and native element props while using Tailwind utilities for overflow and ellipsis. `expandable` lifts the width limit while the text is hovered or contains focus, using CSS only; it does not add an expansion control or state machine. The new implementation uses React 19-compatible native composition and Primer/Tailwind classes, without legacy CSS-module selectors or styled-system styling.

## Migration notes

- Keep persistent expansion state and controls in the consumer; `expandable` only reveals the text on hover or focus.
- Use `as={Link}` with `href` for truncated links; component targets also receive `inline`.
- The default element stays a `div`; pass `as="span"` for phrasing contexts such as paragraphs.
- Remove `sx` and styled-system props.
