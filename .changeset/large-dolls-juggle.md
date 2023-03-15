---
"@primer/react": patch
---

`PageLayout` and `SplitPageLayout` are now SSR-compatible. 

Warning: In this new implementation, `PageLayout.Header` and `PageLayout.Footer` must be direct children of `PageLayout`. The same applies to `SplitPageLayout`
