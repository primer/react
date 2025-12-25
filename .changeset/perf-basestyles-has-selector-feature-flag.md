---
'@primer/react': patch
---

perf(BaseStyles): Feature-flag expensive :has([data-color-mode]) selectors

Add a feature flag (`data-primer-css-perf-has-selector` data attribute) to opt-in to skipping expensive `:has([data-color-mode])` selectors that scan the entire DOM on every style recalculation.

To enable the optimization, add `data-primer-css-perf-has-selector` to an ancestor element (e.g., `<html>` or `<body>`). Input color-scheme is already handled by global selectors in the codebase.

See #7325 and #7312 for context on this performance optimization.
