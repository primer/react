# Token

`Token` displays compact filter or selection content with optional leading visuals, selection state, and removal behavior. `IssueLabelToken` provides the same token interaction model with a custom label color.

Import: `import {Token} from '@primer/react-tailwind/Token'`

## Props

- `leadingVisual`: `React.ElementType`

## IssueLabelToken props

- `fillColor`: `string` — Default `'#999999'`.

## TokenBase props

- `as`: `'span' | 'a' | 'button'` — Default `'span'`.
- `disabled`: `boolean`
- `hideRemoveButton`: `boolean` — Default `false`.
- `href`: `string`
- `id`: `string | number`
- `isSelected`: `boolean`
- `onRemove`: `() => void`
- `size`: `TokenSize` — Default `'medium'`.
- `text`: `React.ReactNode`

## Differences from `@primer/react`

- Do not nest a remove button inside a link/button token.

