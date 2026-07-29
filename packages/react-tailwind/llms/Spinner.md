# Spinner

`Spinner` communicates that work is in progress with an animated indicator and an optional screen-reader announcement.

Import: `import {Spinner} from '@primer/react-tailwind/Spinner'`

## Props

- `delay`: `boolean | 'short' | 'long' | number` — Default `false`.
- `srText`: `string | null` — Default `'Loading'`.

## Differences from `@primer/react`

- Keep `size`, `srText`, and delay usage, but recheck selectors targeting the legacy SVG root.

