# TreeView

`TreeView` is a presentational compound component for hierarchical files, folders, and nested resources. Compose its parts in author order to retain control of item content and visuals while TreeView owns tree semantics, expansion, roving focus, and typeahead.

Import: `import {TreeView} from '@primer/react-tailwind/TreeView'`

## Props

- `flat`: `boolean` — Default `false`.
- `truncate`: `boolean` — Default `true`.

## TreeViewItem props

- `as`: `React.ElementType` — Default `'li'`.
- `containIntrinsicSize`: `string`
- `current`: `boolean` — Default `false`.
- `defaultExpanded`: `boolean`
- `expanded`: `boolean | null`
- `href`: `string`
- `id`: `string`
- `leadingVisual`: `React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)`
- `onExpandedChange`: `(expanded: boolean) => void`
- `onSelect`: `(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void`
- `subtree`: `React.ReactNode`
- `to`: `string`
- `trailingVisual`: `React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)`

## TreeViewSubTree props

- `count`: `number`
- `state`: `'initial' | 'loading' | 'done' | 'error'`

## TreeViewVisual props

- `children`: `React.ReactNode | ((state: TreeViewVisualState) => React.ReactNode)`
- `label`: `string`

## Differences from `@primer/react`

- `TreeView.Item` accepts `leadingVisual`, `trailingVisual`, and `subtree` for the corresponding regions, each taking precedence over a matching child. `leadingVisual` and `trailingVisual` also accept a `(state) => ReactNode` callback so a visual can respond to the item's expanded state.

