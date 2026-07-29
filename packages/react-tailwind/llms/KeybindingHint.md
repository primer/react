# KeybindingHint

`KeybindingHint` renders a compact, screen-reader-friendly keyboard shortcut using the local key formatting rules.

Import: `import {KeybindingHint} from '@primer/react-tailwind/KeybindingHint'`

## Props

- `className`: `string`
- `format`: `'condensed' | 'full'` — Default `'condensed'`.
- `keys`: `string`
- `size`: `'small' | 'medium'` — Default `'medium'`.
- `variant`: `'default' | 'onEmphasis' | 'onPrimary'` — Default `'default'`.

## Differences from `@primer/react`

- Pass the documented key tokens through `keys`; do not depend on a story platform override.

