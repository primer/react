---
'@primer/react': patch
---

perf(UnderlineNav): Batch layout reads and add comment about ResizeObserver throttling

- UnderlineNavItem: Batch getBoundingClientRect and getComputedStyle reads
- UnderlineNav: Add comment noting ResizeObserver callbacks are now throttled
