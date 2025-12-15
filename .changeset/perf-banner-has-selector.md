---
'@primer/react': patch
---

perf(Banner): Optimize CSS :has() selectors for better INP

- Scope `:has(.BannerActions)` selectors to shallow path `> * >` for O(1) lookup
- Scope `:has(.BannerActionsContainer)` to direct child with `>` combinator
