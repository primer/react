---
'@primer/react': patch
---

perf(PageHeader): Scope :has() selectors to direct child for O(1) lookup

All TitleArea and Navigation selectors are now scoped to direct children with `>` combinator.
