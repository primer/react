# CounterLabel

`CounterLabel` displays a numeric count alongside a label, such as an open-issue total. It is presentational and does not format or abbreviate the number.

Import: `import {CounterLabel} from '@primer/react-tailwind/CounterLabel'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `aria-label`: `string` — Accessible name giving the count meaning, since the number alone rarely explains itself.
- `data-component`: `string` — Default `'CounterLabel'`. Overrides the marker used to identify this element in tests and styling.
- `variant`: `"primary" | "secondary" | null`

## Differences from `@primer/react`

- Keep `variant`, children, and count-related content unchanged.
