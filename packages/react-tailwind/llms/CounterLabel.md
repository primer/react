# CounterLabel

`CounterLabel` displays a numeric count alongside a label, such as an open-issue total. It is presentational and does not format or abbreviate the number.

Import: `import {CounterLabel} from '@primer/react-tailwind/CounterLabel'`

Renders a `<span>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `aria-label`: `string` — Defines a string value that labels the current element.
- `data-component`: `string` — Default `'CounterLabel'`.
- `variant`: `"primary" | "secondary" | null`

## Differences from `@primer/react`

- Keep `variant`, children, and count-related content unchanged.
