---
'@primer/react': minor
---

DataTable: Add per-column filtering via the `filterBy` column option and a
`filterable` prop. Columns opt in with
`filterBy: true | 'substring' | 'startsWith' | CustomFilterStrategy<Data>`,
mirroring the shape of `sortBy`. The component renders an inline filter row
beneath the header when at least one column is filterable. Use `filters` /
`defaultFilters` / `onFilterChange` for controlled or uncontrolled state, and
`externalFiltering` to defer filtering to the server.
