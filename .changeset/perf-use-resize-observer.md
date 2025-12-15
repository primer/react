---
'@primer/react': patch
---

perf(hooks): Add first-immediate throttling to useResizeObserver and useOverflow

- useResizeObserver now fires callback immediately on first observation, then throttles with rAF
- useOverflow now uses the same pattern to avoid initial flash of incorrect overflow state
- Added isFirstCallback ref pattern to skip throttling on initial mount
