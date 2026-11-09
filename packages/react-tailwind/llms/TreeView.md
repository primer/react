# TreeView

`TreeView` is a presentational compound component for hierarchical files, folders, and nested resources. Compose its parts in author order to retain control of item content and visuals while TreeView owns tree semantics, expansion, roving focus, and typeahead.

Import: `import {TreeView} from '@primer/react-tailwind/TreeView'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {TreeView} from '@primer/react-tailwind/TreeView'
;<TreeView aria-label="Files">
  <TreeView.Item id="src" defaultExpanded>
    <TreeView.LeadingVisual>
      <TreeView.DirectoryIcon />
    </TreeView.LeadingVisual>
    src
    <TreeView.SubTree>
      <TreeView.Item id="src/index.ts">index.ts</TreeView.Item>
    </TreeView.SubTree>
  </TreeView.Item>
</TreeView>
```

Every item needs a stable `id`. Put `LeadingVisual`, item text, `TrailingVisual`, and `SubTree` directly inside `Item`; `SubTree` is rendered as the item’s nested tree group. Visual children can be a node or a function that receives `{expanded}`. Give a non-decorative visual a `label`; its label is exposed as the item description.

`expanded` and `onExpandedChange` control expansion; use `defaultExpanded` for uncontrolled trees. The `subtree`, `leadingAction`, `leadingVisual`, and `trailingVisual` props remain available as convenience APIs, but compound composition is preferred when structure or visual state matters. Use `containIntrinsicSize` on very large trees to apply `content-visibility: auto` to each row without changing its accessible tree semantics.

### Trees with links

Use `TreeView.LinkTree` and `TreeView.LinkTree.SubTree` when items need to be native links without presentational list-item wrappers. These parts forward refs to `HTMLDivElement` elements; the original `TreeView` and `TreeView.SubTree` retain their `HTMLUListElement` refs.

```tsx
<TreeView.LinkTree aria-label="Files">
  <TreeView.Item id="src" defaultExpanded>
    src
    <TreeView.LinkTree.SubTree>
      <TreeView.Item as="a" href="/src/index.ts" id="src/index.ts" current>
        index.ts
      </TreeView.Item>
    </TreeView.LinkTree.SubTree>
  </TreeView.Item>
</TreeView.LinkTree>
```

For router links, pass a ref-forwarding link component with `as` and its destination with `to`. Links retain native navigation, including modifier and middle clicks; use `onSelect` when activation also needs a callback. Linked items may contain noninteractive visuals but must not contain `LeadingAction`, `secondaryActions`, or other interactive descendants. A linked branch owns its sibling group with `aria-owns`; validate that combination with the assistive technologies supported by your product.

Set `showGuides={false}` to hide the decorative level lines while retaining indentation and expansion toggles. Set the `--tree-indent-size` CSS custom property on the root to change the indentation per level; by default it is half the toggle width.

The `TreeView.Row`, `TreeView.ItemContent`, `TreeView.Item.Label`, `TreeView.Toggle`, `TreeView.LeadingAction`, `TreeView.LevelGuides`, and `TreeView.LevelGuide` `data-component` values are supported hooks. Select them beneath the tree root or item rather than relying on element types or child positions. `TreeView.Item.Label` identifies the clipping container even when the item has an explicit `aria-label`; scope a measurement to the item's own row when it has nested items.

For subtrees that load on demand, set `SubTree`'s `state` to `loading` (with an optional placeholder `count`), then `done`. Render `TreeView.ErrorDialog` inside a subtree in the `error` state to offer retry and dismiss. Put pointer affordances such as drag handles in `LeadingAction`, and per-item commands in `secondaryActions`.

## Accessibility

The root has `role="tree"`, items have `role="treeitem"`, and expanded descendants are in `role="group"` containers. TreeView keeps one roving tab stop. Arrow Up/Down moves among visible items, Right expands or enters a group, Left collapses or moves to the parent, Home/End move to the first/last visible item, and Backspace moves to the parent. Enter follows a native link; Space invokes an item's `onSelect` when supplied or toggles a branch. Typeahead moves to a matching visible label. Loading and loaded subtrees are announced through a status region.

For non-link items, `secondaryActions` are hidden from assistive technology and removed from the tab order; keyboard users reach them with Shift+Meta+U on Apple platforms or Shift+Control+U elsewhere. `LeadingAction` is also hidden from assistive technology and removed from the tab order, so give keyboard users an equivalent through the item itself.

`LeadingAction` is a high-risk, pointer-only slot: it puts its children under `aria-hidden` and removes controls from sequential keyboard navigation. Do not programmatically focus a control in that hidden subtree. The package does not provide a specialist-reviewed composition for a keyboard drag sensor that requires the handle itself to receive focus. Consult the accessibility team before choosing a drag interaction or focus model. The draggable example illustrates a pointer affordance, not a complete accessible reordering implementation.

Reordering also needs a single-pointer alternative that does not require dragging, unless an applicable exception is established. An item action or move dialog may be a direction to evaluate with accessibility specialists, but it is not automatically equivalent to an existing keyboard drag sensor.

Long labels are truncated by default, matching Primer React. Use `truncate={false}` when the full label needs to wrap and remain visible at narrow widths or zoom.

See alignment decisions for differences from the legacy component.

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `flat`: `boolean` — Removes indentation and expansion toggles, for a tree that is only one level deep.
- `showGuides`: `boolean` — Shows indentation guides without changing the nesting or expansion controls.
- `truncate`: `boolean` — Clips long item labels to one line instead of wrapping them.

## TreeView.DirectoryIcon

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## TreeView.ErrorDialog

- `children` (required): `React.ReactNode` — Description of the error.
- `onDismiss`: `(() => void)` — Called when the user dismisses the error, after the item collapses.
- `onRetry`: `(() => void)` — Called when the user chooses to retry loading the subtree.
- `title`: `string` — Default `'Error'`. Title of the dialog.

## TreeView.Item

- `as`: `React.ElementType` — Element to render. Use `as="a"` with `href` for a native link.
- `containIntrinsicSize`: `string` — Reserves a size for off-screen items so a long tree can skip rendering them.
- `current`: `boolean` — Default `false`. Marks the item as the one currently being viewed.
- `defaultExpanded`: `boolean` — Whether the item starts expanded when it owns its own expansion state.
- `expanded`: `boolean | null` — Controls whether the item is expanded. Supply it with `onExpandedChange` to own the state. `null` keeps the item collapsed and leaves its expanded state unannounced.
- `href`: `string` — Makes the item a link to the given URL.
- `id` (required): `string` — Stable identity for the item, used to track focus and expansion.
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

- `children` (required): `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode` — The action, such as a drag handle button. Accepts a callback to vary it with the item's expanded state.
- `label`: `string` — Text describing the action. Like the action itself, it is hidden from assistive technology.

## TreeView.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `children` (required): `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode`
- `label`: `string` — Accessible name for the visual, which is announced as part of the item's description.

## TreeView.LinkTree

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `flat`: `boolean` — Removes indentation and expansion toggles, for a tree that is only one level deep.
- `showGuides`: `boolean` — Shows indentation guides without changing the nesting or expansion controls.
- `truncate`: `boolean` — Clips long item labels to one line instead of wrapping them.

## TreeView.LinkTree.SubTree

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `count`: `number` — Number of placeholder rows to show while the subtree loads. Without it, a spinner row is shown.
- `state`: `SubTreeState` — Loading state of the subtree. `loading` shows placeholders and announces the load; moving from `loading` to `done` announces the result and moves focus from a focused placeholder to the first loaded item.

## TreeView.SubTree

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `count`: `number` — Number of placeholder rows to show while the subtree loads. Without it, a spinner row is shown.
- `state`: `SubTreeState` — Loading state of the subtree. `loading` shows placeholders and announces the load; moving from `loading` to `done` announces the result and moves focus from a focused placeholder to the first loaded item.

## TreeView.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `children` (required): `((state: TreeViewVisualState) => React.ReactNode) | React.ReactNode`
- `label`: `string` — Accessible name for the visual, which is announced as part of the item's description.

## Differences from `@primer/react`

- **Parity — composition:** `TreeView.Item` accepts `leadingAction`, `leadingVisual`, `trailingVisual`, and `subtree` for the corresponding regions, each taking precedence over a matching child. Visual and action props also accept a `(state) => ReactNode` callback so they can respond to the item's expanded state.
- **Parity — expansion:** Control expansion with `expanded`, `defaultExpanded`, and `onExpandedChange`. `expanded={null}` keeps an item collapsed without announcing an expanded state.
- **Parity — async subtrees:** `SubTree` accepts upstream's `state` and `count`. `loading` renders skeleton rows (or a spinner row without `count`) and announces the load; `done` announces the result and moves focus from a focused placeholder to the first loaded item. Render `TreeView.ErrorDialog` inside a subtree in the `error` state to offer `onRetry` and `onDismiss`.
- **Parity — actions:** `LeadingAction` holds pointer affordances such as drag handles; like upstream, it is hidden from assistive technology and out of the tab order. `secondaryActions` render labelled icon buttons with tooltips at the end of the row; Shift+Meta+U (Apple) or Shift+Control+U runs a single action directly or opens a dialog listing several.
- **Unresolved — keyboard drag:** `LeadingAction` unconditionally sets `aria-hidden` on its container and removes descendants from the tab order. It has no supported seam for exposing a programmatically focused drag handle, and moving focus into the hidden subtree is not an approved solution. Chromium may expose a focused descendant despite the hidden ancestor; that observation is not screen-reader or cross-browser verification. Consult accessibility specialists about the complete drag interaction, including a non-dragging single-pointer alternative. Historical [github/primer#3446](https://github.com/github/primer/issues/3446) and [github/accessibility-audits#10114](https://github.com/github/accessibility-audits/issues/10114) concern related legacy examples, not approval of this composition.
- **Unresolved — Primer guidance:** The [TreeView accessibility guidance](https://primer.style/product/components/tree-view/accessibility/#keyboard) requires keyboard operation of nodes with leading actions, including drag, while the [design guidelines](https://primer.style/product/components/tree-view/guidelines/#interaction) say nodes may not contain other interactive elements besides the chevron. Neither describes a focus-requiring keyboard drag sensor; resolve the interaction with accessibility specialists. This implementation activates an item on Space, whereas the [published keyboard guidance](https://primer.style/product/components/tree-view/accessibility/#typeahead-behavior) says Space is ignored and reserved for possible checkbox support; assess any change to that behavior for accessibility and compatibility.
- **Intentional — styling hooks:** `showGuides={false}` hides level lines without flattening the tree. Use the documented `data-component` hooks and `--tree-indent-size` instead of legacy private class selectors. `TreeView.Item.Label` identifies the label's clipping container independently of the item's accessible name. `truncate` defaults to `true`, as in upstream; set it to `false` to wrap long labels.
- **Intentional — selection semantics:** Items don't set `aria-selected`. Upstream marks the focused item selected, which announces every focus move as a selection; `current` (`aria-current`) conveys the active item instead.
- **Intentional — linked trees:** `TreeView.LinkTree` and `TreeView.LinkTree.SubTree` render `div` containers, allowing `Item as="a"` and router links to be directly owned treeitems without presentational `li` wrappers. Linked branches claim a sibling group with `aria-owns`; verify that composition with the product's supported assistive technologies. Linked items cannot contain interactive row actions. The original `TreeView` and `SubTree` keep their `ul` ref contracts; polymorphic items there still use presentational `li` wrappers.
- **Intentional — keyboard:** Space activates the item rather than starting typeahead. Arrow keys with Control, Alt, or Meta are left to the browser, and Backspace moves to the parent item. Items of a tree nested inside another item's content are excluded from the outer tree's navigation. Re-entering the tree focuses the current item if there is one, otherwise the last focused item, otherwise the first, following the APG.
- **Intentional — events:** `onExpandedChange` fires only when the expanded state changes. `flat` trees render no toggle.
- **Intentional — actions dialog:** Choosing an action from the keyboard actions dialog closes it and returns focus to the item.
- Preserve the `ContainIntrinsicSize` audit exclusion: its 10,000-item performance story is interactive-only and excluded from automated pixel parity because upstream has no stable bounded screenshot.
- `sx` and styled-system props are unsupported.
