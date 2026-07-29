# DataTable

`DataTable` is a presentational, typed table for stable row data. It owns native table structure, sorting state, and column layout while `Table` exposes structural parts for custom composition.

Import: `import {DataTable} from '@primer/react-tailwind/DataTable'`

## Props

- `cellPadding`: `"condensed" | "normal" | "spacious"` — Default `'normal'`.
- `columns`: `Column<Data>[]`
- `data`: `Data[]`
- `externalSorting`: `boolean` — Default `false`.
- `getRowId`: `((row: Data) => string | number)` — Default `defaultGetRowId`.
- `gridTemplateColumns`: `GridTemplateColumns<string | number>`
- `initialSortColumn`: `string`
- `initialSortDirection`: `"ASC" | "DESC"`
- `onToggleSort`: `((columnId: string, direction: "ASC" | "DESC") => void)`

## Differences from `@primer/react`

- **Intentional:** Fetching, error dialogs, and product action menus are not configuration props on the base table. Compose `Table.Skeleton`, `Table.Pagination`, `ActionMenu`, and error UI in the application instead.
