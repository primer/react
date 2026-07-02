---
'@primer/react': patch
---

UnderlineNav: Fix forced reflow / layout thrashing by measuring item overflow (`offsetTop`) inside the `IntersectionObserver` callback (which runs after layout) and caching the result, instead of reading it in the `useSyncExternalStore` snapshot — which React calls during render and commit while layout is dirty, forcing a synchronous reflow for every item on every render.
