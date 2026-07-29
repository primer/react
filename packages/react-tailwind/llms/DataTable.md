# DataTable

`DataTable` is a presentational, typed table for stable row data. It owns native table structure, sorting state, and column layout while `Table` exposes structural parts for custom composition.

Import: `import {DataTable} from '@primer/react-tailwind/DataTable'`

## Props

- `columns`: `Column<Data>[]`
- `data`: `Data[]`
- `externalSorting`: `boolean` — Default `false`.
- `getRowId`: `(row: Data) => string | number` — Default `defaultGetRowId`.
- `initialSortColumn`: `string`
- `initialSortDirection`: `Exclude<SortDirection, 'NONE'>`
- `onToggleSort`: `(columnId: string, direction: Exclude<SortDirection, 'NONE'>) => void`

## Table props

- `cellPadding`: `'condensed' | 'normal' | 'spacious'` — Default `'normal'`.
- `gridTemplateColumns`: `React.CSSProperties['gridTemplateColumns']`

## TableHeader props

- `align`: `Alignment`

## TableSortHeader props

- `direction`: `SortDirection`
- `onToggleSort`: `() => void`

## TableCell props

- `align`: `Alignment`
- `scope`: `'row'`

## TablePagination props

- `defaultPageIndex`: `number` — Default `0`.
- `onChange`: `(details: {pageIndex: number}) => void`
- `pageSize`: `number`
- `totalCount`: `number`

## TableSkeleton props

- `columns`: `Array<TableColumnLayout & {header: React.ReactNode}>`
- `rows`: `number` — Default `10`.

## Differences from `@primer/react`

- **Intentional:** Fetching, error dialogs, and product action menus are not configuration props on the base table. Compose `Table.Skeleton`, `Table.Pagination`, `ActionMenu`, and error UI in the application instead.

