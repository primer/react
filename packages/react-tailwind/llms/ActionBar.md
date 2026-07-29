# ActionBar

`ActionBar` groups related actions with `Button`, `IconButton`, `Group`, `Divider`, and `Menu` parts.

Import: `import {ActionBar} from '@primer/react-tailwind/ActionBar'`

## Props

- `flush`: `boolean` — Default `false`.
- `gap`: `'none' | 'condensed'` — Default `'condensed'`.
- `size`: `ControlSize` — Default `'medium'`.

## ActionBarMenu props

- `aria-label`: `string`
- `icon`: `React.ElementType` — Default `KebabHorizontalIcon`.
- `items`: `ActionBarMenuItem[]`

## Differences from `@primer/react`

- Replace `overflowIcon` with an explicit `ActionBar.Menu`; preserve the action order and focus behavior in consumer code.

