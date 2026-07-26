# Alignment

## From: `@primer/react`

`Truncate` constrains text to a `maxWidth`, supports `inline`, and can mark content as `expandable`. Legacy CSS modules provide overflow, ellipsis, and the inline/block treatment; the component forwards legacy shared styling props. The legacy implementation is presentational and does not implement expansion itself.

## To: `@primer/react-tailwind`

Tailwind `Truncate` keeps `maxWidth`, `inline`, `expandable`, children, and native element props while using Tailwind utilities for overflow and ellipsis. It remains a presentational marker: `expandable` communicates intent but does not supply an expansion control or state machine. The new implementation uses React 19-compatible native composition and Primer/Tailwind classes, without legacy CSS-module selectors or styled-system styling.

## Migration notes

- Keep expansion state and controls in the consumer.
- Recheck the rendered default element and selectors when relying on legacy block/inline markup.
- Remove `sx` and styled-system props.
