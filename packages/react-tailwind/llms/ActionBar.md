# ActionBar

`ActionBar` groups related actions with `Button`, `IconButton`, `Group`, `Divider`, and `Menu` parts.

Import: `import {ActionBar} from '@primer/react-tailwind/ActionBar'`

## Props

- `flush`: `boolean` — Default `false`.
- `gap`: `"condensed" | "none"` — Default `'condensed'`.
- `size`: `ControlSize` — Default `'medium'`.

## Button props

- `alignContent`: `"center" | "start"`
- `block`: `boolean`
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number`
- `disabled`: `boolean`
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean`
- `loadingAnnouncement`: `string`
- `size`: `ControlSize` — Default `'medium'`.
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`

## IconButton props

- `alignContent`: `"center" | "start"`
- `aria-label`: `string` — Defines a string value that labels the current element.
- `block`: `boolean`
- `className`: `string`
- `count`: `string | number`
- `disabled`: `boolean`
- `icon`: `React.ElementType` — Default `KebabHorizontalIcon`.
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `loading`: `boolean`
- `loadingAnnouncement`: `string`
- `size`: `ControlSize` — Default `'medium'`.
- `trailingAction`: `ButtonVisual`

## Menu props

- `aria-label`: `string`
- `icon`: `React.ElementType` — Default `KebabHorizontalIcon`.
- `items`: `ActionBarMenuItem[]`

## Differences from `@primer/react`

- Replace `overflowIcon` with an explicit `ActionBar.Menu`; preserve the action order and focus behavior in consumer code.
