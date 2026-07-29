# Flash

`Flash` presents a prominent message with semantic visual variants and an optional full-width layout.

Import: `import {Flash} from '@primer/react-tailwind/Flash'`

Renders a `<div>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'div'`.
- `full`: `boolean` — Default `false`.
- `variant`: `"danger" | "default" | "success" | "warning"` — Default `'default'`.

## Differences from `@primer/react`

- Put a named close button and its state outside or inside Flash as ordinary composition.
