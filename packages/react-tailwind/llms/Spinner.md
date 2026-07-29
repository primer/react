# Spinner

`Spinner` communicates that work is in progress with an animated indicator and an optional screen-reader announcement.

Import: `import {Spinner} from '@primer/react-tailwind/Spinner'`

## Props

- `delay`: `number | "long" | "short" | boolean` — Default `false`.
- `size`: `"large" | "medium" | "small" | null`
- `srText`: `string | null` — Default `'Loading'`.

## Differences from `@primer/react`

- Keep `size`, `srText`, and delay usage, but recheck selectors targeting the legacy SVG root.
