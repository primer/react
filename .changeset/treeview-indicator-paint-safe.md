---
'@primer/react': patch
---

`TreeView`: make rows safer to use with `contain: paint` / `content-visibility: auto` and reduce style-recalc cost on hover/focus in large trees. No visual or layout changes; all changes are either invisible at the default rendering or behind an opt-in CSS containment property the consumer sets.

- The current-item indicator (positioned at `left: -8px` of the row container) was being clipped when a consumer applied `contain: paint` to the `<li>` or when the documented `containIntrinsicSize` prop on `TreeView.Item` triggered `content-visibility: auto` on the row container — including for `current` items. Both `.TreeViewItem` and `.TreeViewItemContainer` now declare `overflow-clip-margin: var(--base-size-8)`, which extends the paint-clip edge by 8px on the side the indicator paints. The property is a no-op when no paint containment is active, so default rendering is byte-identical.
- Skeleton-row hover suppression no longer relies on `:has(.TreeViewItemSkeleton)`, which forced subtree invalidation on every row. `LoadingItem` now communicates with the placeholder `Item` via a module-private context that emits a positive `data-loading` attribute on the `<li>`, and the CSS selector targets that directly. No new public prop.
- Nesting indicator lines no longer use a root-scope `:hover`/`:focus-within` descendant selector. Color is driven by an inherited `--tree-line-color` custom property set on the root `<ul>`, so a hover or focus change inside the tree updates one property on one element instead of re-matching `.TreeViewItemLevelLine` selectors against every level line in the tree.
- Fixed a unitless `outline-offset: -2` in the forced-colors focus-ring fallback that browsers were silently dropping (so forced-colors users now actually get a focus indicator on tree items).
- `.TreeViewItemContainer`'s `grid-template-columns` now declares the `trailingAction` column explicitly (`auto`) so it matches the 5-area `grid-template-areas` declaration (previously the trailing column was implicit `auto`).
