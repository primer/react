# Popover

`Popover` pairs a trigger with positioned, dismissible content.

Import: `import {Popover} from '@primer/react-tailwind/Popover'`

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
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"`

## Content props

- `align`: `FloatingAlignment` — Default `'center'`.
- `alignOffset`: `FloatingOffset`
- `portal`: `boolean` — Default `true`.
- `positionerClassName`: `string`
- `side`: `FloatingSide` — Default `'bottom'`.
- `sideOffset`: `FloatingOffset` — Default `8`.

## Differences from `@primer/react`

- Recompose legacy anchor/content markup with the compound parts.
