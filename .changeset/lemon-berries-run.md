---
"@primer/react": patch
---

`ActionList` and `NavList` are now SSR-compatible. 

Warning: In this new implementation, `ActionList.LeadingVisual`, `ActionList.TrailingVisual,` and `ActionList.Description` must be direct children of `ActionList`. The same applies to `NavList`.
