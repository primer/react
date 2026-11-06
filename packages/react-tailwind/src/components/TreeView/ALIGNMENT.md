# Alignment

## From: `@primer/react`

Legacy TreeView has nested items, current state, truncation, roving focus, typeahead, expansion, async subtrees with skeleton rows and an error dialog, leading actions such as drag handles, and secondary actions reached by pointer or a keyboard shortcut.

## To: `@primer/react-tailwind`

TreeView is a compound API. `Item` accepts `LeadingAction`, `LeadingVisual`, `TrailingVisual`, and `SubTree` children, while `DirectoryIcon` and visual render functions respond to expansion state. The convenience `subtree`, `leadingAction`, `leadingVisual`, and `trailingVisual` item props remain supported.

It provides `flat`, `truncate`, current state, controlled and uncontrolled expansion, selection callbacks, `href` and `to` links, async `SubTree` states with `ErrorDialog`, `secondaryActions`, optional `containIntrinsicSize`, APG tree keyboard navigation, typeahead, and an `as` escape hatch with valid list and tree markup. Dialogs compose the local `Dialog` and `ConfirmationDialog`, actions compose `IconButton` and `Tooltip`, and load announcements use `AriaStatus`.

## Migration notes

- **Parity — composition:** `TreeView.Item` accepts `leadingAction`, `leadingVisual`, `trailingVisual`, and `subtree` for the corresponding regions, each taking precedence over a matching child. Visual and action props also accept a `(state) => ReactNode` callback so they can respond to the item's expanded state.
- **Parity — expansion:** Control expansion with `expanded`, `defaultExpanded`, and `onExpandedChange`. `expanded={null}` keeps an item collapsed without announcing an expanded state.
- **Parity — async subtrees:** `SubTree` accepts upstream's `state` and `count`. `loading` renders skeleton rows (or a spinner row without `count`) and announces the load; `done` announces the result and moves focus from a focused placeholder to the first loaded item. Render `TreeView.ErrorDialog` inside a subtree in the `error` state to offer `onRetry` and `onDismiss`.
- **Parity — actions:** `LeadingAction` holds pointer affordances such as drag handles; like upstream, it is hidden from assistive technology and out of the tab order. `secondaryActions` render labelled icon buttons with tooltips at the end of the row; Shift+Meta+U (Apple) or Shift+Control+U runs a single action directly or opens a dialog listing several.
- **Intentional — selection semantics:** Items don't set `aria-selected`. Upstream marks the focused item selected, which announces every focus move as a selection; `current` (`aria-current`) conveys the active item instead.
- **Intentional — polymorphic items:** An item rendered with a non-`li` `as` element sits inside a presentational list item, and its expanded subtree is a sibling that the item claims with `aria-owns`, so the treeitem never contains its group.
- **Intentional — keyboard:** Space activates the item rather than starting typeahead. Arrow keys with Control, Alt, or Meta are left to the browser, and Backspace moves to the parent item. Items of a tree nested inside another item's content are excluded from the outer tree's navigation. Re-entering the tree focuses the current item if there is one, otherwise the last focused item, otherwise the first, following the APG.
- **Intentional — events:** `onExpandedChange` fires only when the expanded state changes. `flat` trees render no toggle.
- **Intentional — actions dialog:** Choosing an action from the keyboard actions dialog closes it and returns focus to the item.
- Preserve the `ContainIntrinsicSize` audit exclusion: its 10,000-item performance story is interactive-only and excluded from automated pixel parity because upstream has no stable bounded screenshot.
- `sx` and styled-system props are unsupported.
