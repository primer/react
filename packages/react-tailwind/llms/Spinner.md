# Spinner

`Spinner` communicates that work is in progress with an animated indicator and an optional screen-reader announcement.

Import: `import {Spinner} from '@primer/react-tailwind/Spinner'`

## Props

- `delay`: `number | "long" | "short" | boolean` — Default `false`. Waits before showing the spinner, so a fast response never flashes one.
- `size`: `"large" | "medium" | "small" | null`
- `srText`: `string | null` — Default `'Loading'`. Text announced to assistive technology while loading. Set to null when a nearby live region already announces it.

## Differences from `@primer/react`

- Keep `size`, `srText`, and delay usage, but recheck selectors targeting the legacy SVG root.
