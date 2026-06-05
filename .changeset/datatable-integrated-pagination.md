---
'@primer/react': minor
---

DataTable: Add integrated pagination via the `pagination` prop. Pass
`pagination={true}` (or an options object) and `DataTable` renders the
existing `<Table.Pagination>` for you and slices the rows automatically —
consumers no longer need to wire `<Table.Pagination>` and manual row
slicing themselves. Supports controlled (`pageIndex` / `onPageChange`) and
uncontrolled modes, plus an `externalPagination` escape hatch for
server-driven pagination. The existing manual `<Table.Pagination>`
composition pattern continues to work unchanged for callers that want
finer control.
