---
'@primer/react': patch
---

`useAnchoredPosition`: avoid re-walking the scrollable-ancestor chain (and its `getComputedStyle` calls) on every reposition dependency change by caching the walk per anchor element, reducing style-recalc work for overlays, menus, and tooltips.
