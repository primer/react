# Spinner

`Spinner` communicates that work is in progress with an animated indicator and an optional screen-reader announcement.

Import: `import {Spinner} from '@primer/react-tailwind/Spinner'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `delay`: `number | "long" | "short" | boolean` — Default `false`. Waits before showing the spinner, so a fast response never flashes one.
- `size`: `"large" | "medium" | "small" | null`
- `srText`: `string | null` — Default `'Loading'`. Text announced to assistive technology while loading. Set to null when a nearby live region already announces it.

## Differences from `@primer/react`

- Keep `size`, `srText`, and delay usage, but recheck selectors targeting the legacy SVG root.
- Respect the new root status semantics when composing surrounding live regions.
- Remove `sx`, styled-system props, and legacy animation overrides.
