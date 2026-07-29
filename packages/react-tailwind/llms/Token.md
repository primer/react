# Token

`Token` displays compact filter or selection content with optional leading visuals, selection state, and removal behavior. `IssueLabelToken` provides the same token interaction model with a custom label color.

Import: `import {Token} from '@primer/react-tailwind/Token'`

## Props

- `as`: `"a" | "button" | "span"` — Default `'span'`.
- `disabled`: `boolean`
- `hideRemoveButton`: `boolean` — Default `false`.
- `href`: `string`
- `id`: `string | number`
- `isSelected`: `boolean`
- `leadingVisual`: `React.ElementType`
- `onRemove`: `(() => void)`
- `size`: `TokenSize` — Default `'medium'`.
- `text`: `React.ReactNode`

## Differences from `@primer/react`

- Do not nest a remove button inside a link/button token.
