# ActionMenu

`ActionMenu` is a composable Base UI menu with button and low-level trigger options.

Import: `import {ActionMenu} from '@primer/react-tailwind/ActionMenu'`

## ActionMenuButton props

- `children`: `React.ReactNode`

## ActionMenuItem props

- `inactiveText`: `React.ReactNode`
- `loading`: `boolean` — Default `false`.
- `loadingText`: `string`
- `selected`: `boolean`
- `variant`: `'default' | 'danger'` — Default `'default'`.

## Differences from `@primer/react`

- Compose branded triggers with `render`, not `as`, to avoid nested interactive elements. Use `className` when the composed control owns the visual treatment.

