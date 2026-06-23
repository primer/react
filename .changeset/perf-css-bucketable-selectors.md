---
'@primer/react': patch
---

Improve style-recalc performance by making ButtonGroup, DataTable Pagination, and Checkbox CSS selectors bucketable (removing universal `*`/`:not([attr])` subjects and `:is()` selector-list merges)
