# TreeView

`TreeView` is a presentational compound component for hierarchical files, folders, and nested resources. Compose its parts in author order to retain control of item content and visuals while TreeView owns tree semantics, expansion, roving focus, and typeahead.

Import: `import {TreeView} from '@primer/react-tailwind/TreeView'`

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `flat`: `boolean` — Default `false`. Removes the indentation guides, for a tree that is only one level deep.
- `truncate`: `boolean` — Default `true`. Clips long item labels to one line instead of wrapping them.

## TreeView.DirectoryIcon

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## TreeView.ErrorDialog

- `children`: `React.ReactElement[]` — Description of the error.
- `onDismiss`: `(() => void)` — Called when the user dismisses the error, after the item collapses.
- `onRetry`: `(() => void)` — Called when the user chooses to retry loading the subtree.
- `title`: `string` — Default `'Error'`. Title of the dialog.

## TreeView.Item

Renders a [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'li'`. Element to render. Anything other than `li` is wrapped in a presentational list item.
- `containIntrinsicSize`: `string` — Reserves a size for off-screen items so a long tree can skip rendering them.
- `current`: `boolean` — Default `false`. Marks the item as the one currently being viewed.
- `defaultExpanded`: `boolean` — Whether the item starts expanded when it owns its own expansion state.
- `expanded`: `boolean | null` — Controls whether the item is expanded. Supply it with `onExpandedChange` to own the state. `null` keeps the item collapsed and leaves its expanded state unannounced.
- `href`: `string` — Makes the item a link to the given URL.
- `id`: `string` — Stable identity for the item, used to track focus and expansion.
- `leadingAction`: `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode` — Action shown before the toggle, such as a drag handle. Accepts a callback to vary it with the expanded state.
- `leadingVisual`: `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode` — Visual shown before the label. Accepts a callback to vary it with the item's expanded state.
- `onExpandedChange`: `((expanded: boolean) => void)` — Called with the new state when the item is expanded or collapsed.
- `onSelect`: `((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated by click or keyboard.
- `secondaryActions`: `TreeViewSecondaryActions[]` — Actions shown at the end of the row for pointer users. Keyboard users reach them with Shift+Meta+U on Apple platforms or Shift+Control+U elsewhere: one action runs directly, several open a dialog to choose from.
- `subtree`: `React.ReactNode` — Nested items, as an alternative to supplying a subtree child. Takes precedence over a `TreeView.SubTree` child.
- `to`: `string` — Route the item links to, for integration with a router.
- `trailingVisual`: `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode` — Visual shown after the label. Accepts a callback to vary it with the item's expanded state.

## TreeView.LeadingAction

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `children`: `React.ReactElement[]` — The action, such as a drag handle button. Accepts a callback to vary it with the item's expanded state.
- `label`: `string` — Text describing the action. Like the action itself, it is hidden from assistive technology.

## TreeView.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `children`: `React.ReactElement[]`
- `label`: `string` — Accessible name for the visual, which is announced as part of the item's description.

## TreeView.SubTree

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `count`: `number` — Number of placeholder rows to show while the subtree loads. Without it, a spinner row is shown.
- `state`: `SubTreeState` — Loading state of the subtree. `loading` shows placeholders and announces the load; moving from `loading` to `done` announces the result and moves focus from a focused placeholder to the first loaded item.

## TreeView.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `children`: `React.ReactElement[]`
- `label`: `string` — Accessible name for the visual, which is announced as part of the item's description.

## Differences from `@primer/react`

- **Parity — composition:** `TreeView.Item` accepts `leadingAction`, `leadingVisual`, `trailingVisual`, and `subtree` for the corresponding regions, each taking precedence over a matching child. Visual and action props also accept a `(state) => ReactNode` callback so they can respond to the item's expanded state.
