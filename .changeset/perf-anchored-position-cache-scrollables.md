---
'@primer/react': patch
---

`useAnchoredPosition`: improve scroll performance for overlays, menus, and tooltips by caching the scrollable-ancestor walk per anchor element (avoiding repeated `getComputedStyle` traversals on reposition dependency changes) and marking the ancestor scroll listeners as passive.
