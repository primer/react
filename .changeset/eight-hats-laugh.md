---
'@primer/react': patch
---

perf(TreeView): Optimize typeahead with startTransition to prevent input lag

Wrapped the expensive typeahead search operation in `startTransition` to mark it as low-priority, keeping keystroke handling responsive while deferring the focus search. This improves performance on large trees with thousands of items.
