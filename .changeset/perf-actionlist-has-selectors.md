---
'@primer/react': patch
---

ActionList: Replace `:has(...)` selectors on `ActionList.Item`, `InactiveButtonWrap`, and `TrailingActionButton` with JS-derived data attributes (`data-has-trailing-action`, `data-trailing-action-loading`, `data-position`, `data-has-label`). Reduces style-recalculation cost on lists that render many items. No visual or behavioral changes.
