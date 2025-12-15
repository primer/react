---
'@primer/react': patch
---

perf(Announce): Batch getComputedStyle reads to avoid layout thrashing

Combine display and visibility checks into a single getComputedStyle call.
