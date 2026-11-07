---
'@primer/react': patch
---

DataTable: Sort the rows on the first render when `initialSortColumn` or `initialSortDirection` is set. Before, only the header showed the sort direction and the rows stayed in the order of `data` until it changed or a header was clicked.
