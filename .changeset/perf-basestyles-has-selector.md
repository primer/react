---
'@primer/react': patch
---

perf(BaseStyles): Remove expensive :has([data-color-mode]) selectors

Remove `:has([data-color-mode])` selectors that scanned the entire DOM on every style recalculation.
Input color-scheme is already handled by global selectors in the codebase.
