---
'@primer/react': patch
---

Reduce render cascades in `UnderlineNav` and `UnderlinePanels` (experimental):

- `UnderlineNav.Item` no longer runs a per-item layout effect that dispatches
  `setChildrenWidth` + `setNoIconChildrenWidth` to the parent. The parent
  `UnderlineNav` now measures all items in a single layout effect and stores
  widths in refs (not state). For N items, that's one batched setState
  instead of 2N. The hook's `updateListAndMenu` now compares items/menuItems
  by key before committing, so the `ResizeObserver`'s initial fire (which
  reports the same dimensions the parent layout effect just measured) bails
  out instead of producing an extra render.
- `UnderlinePanels` now derives `tabs` and `tabPanels` inline via `useMemo`
  instead of holding them in state and syncing through a post-paint
  `useEffect`. The `listWidth` state is gone — the layout effect and resize
  observer compute icon visibility by measuring both list and wrapper
  together at decision time.

No public API changes.
