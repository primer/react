---
'@primer/react': patch
---

perf(Breadcrumbs): Optimize CSS :has() selector and batch offsetWidth reads

- Scope `:has(.MenuOverlay)` to shallow path `> .MenuDetails .MenuOverlay` for O(1) lookup
- Batch all offsetWidth reads in a single pass to avoid layout thrashing
