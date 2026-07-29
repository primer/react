# TreeView

`TreeView` is a presentational compound component for hierarchical files, folders, and nested resources. Compose its parts in author order to retain control of item content and visuals while TreeView owns tree semantics, expansion, roving focus, and typeahead.

Import: `import {TreeView} from '@primer/react-tailwind/TreeView'`

Renders an `<ul>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `flat`: `boolean` — Default `false`.
- `truncate`: `boolean` — Default `true`.

## Item props

- `as`: `React.ElementType` — Default `'li'`.
- `containIntrinsicSize`: `string`
- `current`: `boolean` — Default `false`.
- `defaultExpanded`: `boolean`
- `expanded`: `boolean | null`
- `href`: `string`
- `id`: `string`
- `leadingVisual`: `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode`
- `onExpandedChange`: `((expanded: boolean) => void)`
- `onSelect`: `((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement, MouseEvent>) => void)`
- `subtree`: `React.ReactNode`
- `to`: `string`
- `trailingVisual`: `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode`

## LeadingVisual props

- `children`: `React.ReactElement[]`
- `label`: `string`

## SubTree props

- `count`: `number`
- `state`: `"done" | "error" | "initial" | "loading"`

## TrailingVisual props

- `children`: `React.ReactElement[]`
- `label`: `string`

## Differences from `@primer/react`

- `TreeView.Item` accepts `leadingVisual`, `trailingVisual`, and `subtree` for the corresponding regions, each taking precedence over a matching child. `leadingVisual` and `trailingVisual` also accept a `(state) => ReactNode` callback so a visual can respond to the item's expanded state.
