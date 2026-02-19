---
'@primer/react': patch
---

perf(ActionList): replace `:has([aria-disabled])` child scan with `data-is-disabled` attribute for faster style recalculation
