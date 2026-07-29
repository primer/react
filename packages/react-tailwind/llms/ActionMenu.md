# ActionMenu

`ActionMenu` is a composable Base UI menu with button and low-level trigger options.

Import: `import {ActionMenu} from '@primer/react-tailwind/ActionMenu'`

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
- `loading`: `boolean` — Default `false`.
- `loadingAnnouncement`: `string`
- `size`: `ControlSize` — Default `'medium'`.
- `trailingAction`: `ButtonVisual`
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`.

## Content props

- `align`: `FloatingAlignment` — Default `'start'`.
- `alignOffset`: `FloatingOffset`
- `positionerClassName`: `string`
- `side`: `FloatingSide` — Default `'bottom'`.
- `sideOffset`: `FloatingOffset` — Default `4`.

## Overlay props

- `align`: `FloatingAlignment` — Default `'start'`.
- `alignOffset`: `FloatingOffset`
- `positionerClassName`: `string`
- `side`: `FloatingSide` — Default `'bottom'`.
- `sideOffset`: `FloatingOffset` — Default `4`.

## Item props

- `inactiveText`: `React.ReactNode`
- `loading`: `boolean` — Default `false`.
- `loadingText`: `string`
- `selected`: `boolean`
- `variant`: `"danger" | "default"` — Default `'default'`.

## Description props

- `truncate`: `boolean`
- `variant`: `"block" | "inline"` — Default `'default'`.

## Differences from `@primer/react`

- Compose branded triggers with `render`, not `as`, to avoid nested interactive elements. Use `className` when the composed control owns the visual treatment.
