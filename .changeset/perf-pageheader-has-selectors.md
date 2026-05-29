---
'@primer/react': patch
---

PageHeader: hoist title-size and navigation-visibility state from descendants onto the root and replace 18 `:has()` selectors with plain attribute selectors. Same rendered output; the engine no longer re-evaluates subtree-scoped `:has()` selectors on every DOM mutation inside a `PageHeader`.
