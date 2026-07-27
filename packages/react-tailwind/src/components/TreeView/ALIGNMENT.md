# Alignment

## From: `@primer/react`

Legacy TreeView has nested items, selection, truncation, roving focus, expansion, async success/count/error fixtures, and drag-and-drop-oriented product extensions.

## To: `@primer/react-tailwind`

TreeView is a presentational compound API. `Item` accepts `LeadingVisual`, `TrailingVisual`, and `SubTree` children, while `DirectoryIcon` and visual render functions respond to expansion state. The convenience `subtree`, `leadingVisual`, and `trailingVisual` item props remain supported.

It provides `flat`, `truncate`, current state, controlled and uncontrolled expansion, selection callbacks, optional `containIntrinsicSize`, APG tree keyboard navigation, and a native `as` escape hatch with valid list and tree markup.

## Migration notes

- `TreeView.Item` accepts `leadingVisual`, `trailingVisual`, and `subtree` for the corresponding regions, each taking precedence over a matching child. `leadingVisual` and `trailingVisual` also accept a `(state) => ReactNode` callback so a visual can respond to the item's expanded state.
- Control expansion with `expanded`, `defaultExpanded`, and `onExpandedChange` where needed.
- `SubTree` supports the upstream `state` and `count` loading fixture shape. Fetching, retry UI, loaded-content announcements, and error dialogs intentionally remain application composition rather than a TreeView data-loading API.
- Dragging is native `draggable` markup only. Secondary actions intentionally remain outside the treeitem: the Tailwind examples use labelled, non-interactive trailing visuals to avoid nested interactive elements. This is an intentional accessibility-oriented divergence from legacy keyboard action dialogs.
- Preserve the `ContainIntrinsicSize` audit exclusion: its 10,000-item performance story is interactive-only and excluded from automated pixel parity because upstream has no stable bounded screenshot.
- `sx` and styled-system props are unsupported.
