---
'@primer/react': patch
---

perf(AvatarStack): Optimize CSS :has() selector and throttle MutationObserver

- Scope `:has([data-square])` to direct child with `>` combinator for O(1) lookup
- Throttle MutationObserver callback using requestAnimationFrame to batch DOM reads
