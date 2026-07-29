# Truncate

`Truncate` applies single-line overflow truncation while preserving the full value in the native `title` tooltip.

Import: `import {Truncate} from '@primer/react-tailwind/Truncate'`

## Props

- `as`: `React.ElementType` — Default `'span'`.
- `expandable`: `boolean`
- `inline`: `boolean`
- `maxWidth`: `string | number` — Default `125`.
- `title`: `string`

## Differences from `@primer/react`

- Keep expansion state and controls in the consumer.
