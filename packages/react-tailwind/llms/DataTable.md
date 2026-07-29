# DataTable

`DataTable` is a presentational, typed table for stable row data. It owns native table structure, sorting state, and column layout while `Table` exposes structural parts for custom composition.

Import: `import {DataTable} from '@primer/react-tailwind/DataTable'`

## Props

- `cellPadding`: `"condensed" | "normal" | "spacious"` — Default `'normal'`. Vertical spacing inside cells, which sets the density of the table.
- `columns`: `Column<Data>[]` — Column definitions, giving each column its header, width, and how to read a cell from a row.
- `data`: `Data[]` — Rows to render.
- `externalSorting`: `boolean` — Default `false`. Stops the table sorting `data` itself, for when rows arrive already sorted by a server.
- `getRowId`: `((row: Data) => string | number)` — Default `defaultGetRowId`. Reads a stable identity from a row. Supply it when rows have no `id` field.
- `gridTemplateColumns`: `GridTemplateColumns<string | number>` — Explicit column track sizes, as a CSS grid template.
- `initialSortColumn`: `string` — Column sorted on first render.
- `initialSortDirection`: `"ASC" | "DESC"` — Direction sorted on first render.
- `onToggleSort`: `((columnId: string, direction: "ASC" | "DESC") => void)` — Called with the column and new direction when a sortable header is activated.

## Differences from `@primer/react`

- **Intentional:** Fetching, error dialogs, and product action menus are not configuration props on the base table. Compose `Table.Skeleton`, `Table.Pagination`, `ActionMenu`, and error UI in the application instead.
