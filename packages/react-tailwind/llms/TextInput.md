# TextInput

`TextInput` is a styled native single-line input with small, medium, and large visual sizes.

Import: `import {TextInput} from '@primer/react-tailwind/TextInput'`

## Props

- `block`: `boolean` — Default `false`.
- `characterLimit`: `number`
- `contrast`: `boolean` — Default `false`.
- `leadingVisual`: `TextInputVisual`
- `loaderPosition`: `'auto' | 'leading' | 'trailing'` — Default `'auto'`.
- `loaderText`: `string` — Default `'Loading'`.
- `loading`: `boolean` — Default `false`.
- `monospace`: `boolean` — Default `false`.
- `size`: `ControlSize` — Default `'medium'`.
- `trailingAction`: `React.ReactElement`
- `trailingVisual`: `TextInputVisual`
- `validationStatus`: `'error' | 'success'`

## TextInputAction props

- `aria-label`: `string`
- `icon`: `React.ElementType`
- `tooltipDirection`: `TextInputActionDirection` — Default `'s'`.

## Differences from `@primer/react`

- Continue using `leadingVisual`, `trailingVisual`, `trailingAction`, `loading`, and `characterLimit`.

