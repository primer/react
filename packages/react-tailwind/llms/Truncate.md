# Truncate

`Truncate` applies single-line overflow truncation while preserving the full value in the native `title` tooltip.

Import: `import {Truncate} from '@primer/react-tailwind/Truncate'`

## Props

- `as`: `React.ElementType` — Default `'span'`. Element to render.
- `expandable`: `boolean` — Reveals the full text on hover and focus.
- `inline`: `boolean` — Renders inline rather than as a block.
- `maxWidth`: `string | number` — Default `125`. Width past which the text is clipped.
- `title`: `string` — Full text, shown on hover and kept available to assistive technology when the text is clipped.

## Differences from `@primer/react`

- Keep expansion state and controls in the consumer.
