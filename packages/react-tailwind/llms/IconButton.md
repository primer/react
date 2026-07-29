# IconButton

`IconButton` is a button whose only content is an icon. `aria-label` is required, because the control has no visible text.

Import: `import {IconButton} from '@primer/react-tailwind/IconButton'`

## Props

- `alignContent`: `"center" | "start"`
- `aria-label`: `string` — Defines a string value that labels the current element.
- `block`: `boolean`
- `className`: `string`
- `count`: `string | number`
- `data-component`: `string` — Default `'IconButton'`.
- `disabled`: `boolean`
- `icon`: `React.ElementType`
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `loading`: `boolean`
- `loadingAnnouncement`: `string`
- `size`: `ControlSize` — Default `'medium'`.
- `trailingAction`: `ButtonVisual`
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"`

## Differences from `@primer/react`

- Supply an accessible name with `aria-label`; use native `title` only as supplemental text.
