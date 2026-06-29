---
'@primer/react': minor
---

DataTable: Add integrated pagination via the `pagination` prop. Pass
`pagination={true}` (or an options object) and `DataTable` renders the
existing `<Table.Pagination>` for you and slices the rows automatically —
consumers no longer need to wire `<Table.Pagination>` and manual row
slicing themselves. Supports controlled (`pageIndex` / `onPageChange`) and
uncontrolled modes, plus an `externalPagination` escape hatch for
server-driven pagination.

Pass `pagination.pageSizeOptions` (e.g. `[10, 25, 50]`) to render a
rows-per-page dropdown alongside the range. Pair with the new controlled
`pageSize` / `onPageSizeChange` props to lift that selection into a
parent. The existing manual `<Table.Pagination>` composition pattern
continues to work unchanged for callers that want finer control.
