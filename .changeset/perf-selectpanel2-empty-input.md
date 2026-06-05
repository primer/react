---
'@primer/react': patch
---

SelectPanel (experimental v2): replace the `:has(input:placeholder-shown)` selector that hid the clear-action button with a `data-empty` attribute derived from React state. The clear-action visibility no longer triggers a descendant `:has()` re-evaluation on every keystroke.
