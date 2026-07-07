---
'@primer/react': patch
---

`useAnchoredPosition`: improve performance by caching the scrollable-ancestor walk per anchor, reducing repositioning work for overlays, menus, and tooltips.
