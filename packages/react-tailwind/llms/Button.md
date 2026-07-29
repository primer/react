# Button

`Button` triggers an action in the current view. Use `LinkButton` when the control navigates to a URL, and `IconButton` when the control has no visible label.

Import: `import {Button} from '@primer/react-tailwind/Button'`

## Props

- `alignContent`: `'start' | 'center'` — Default `'center'`.
- `block`: `boolean`
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `number | string`
- `data-component`: `string` — Default `'ButtonBase'`.
- `disabled`: `boolean`
- `inactive`: `boolean`
- `labelWrap`: `boolean`
- `leadingVisual`: `ButtonVisual`
- `loading`: `boolean`
- `loadingAnnouncement`: `string` — Default `'Loading'`.
- `size`: `ControlSize`
- `trailingAction`: `ButtonVisual`
- `trailingVisual`: `ButtonVisual`
- `variant`: `'default' | 'primary' | 'danger' | 'invisible' | 'link'` — Default `'default'`.

## ButtonBase props

- `data-component`: `string` — Default `'ButtonBase'`.

## Differences from `@primer/react`

- Prefer LinkButton for navigation; the `link` Button variant remains available for semantic button actions rendered as inline links.

