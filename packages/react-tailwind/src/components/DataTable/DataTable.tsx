import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
  type SortDirection,
} from './Table'

export type UniqueRow = {id: string | number}
export type CellAlignment = 'start' | 'end'
export type SortStrategy<Data> = boolean | ((a: Data, b: Data) => number)

interface ColumnBase<Data extends UniqueRow> {
  id?: string
  header: string | (() => React.ReactNode)
  align?: CellAlignment
  renderCell?: (data: Data) => React.ReactNode
  rowHeader?: boolean
}

export type Column<Data extends UniqueRow> =
  | (ColumnBase<Data> & {
      field: keyof Data & string
      sortBy?: SortStrategy<Data>
    })
  | (ColumnBase<Data> & {
      id: string
      field?: never
      renderCell: (data: Data) => React.ReactNode
      sortBy?: false | ((a: Data, b: Data) => number)
    })

export interface DataTableProps<Data extends UniqueRow>
  extends Omit<React.ComponentPropsWithoutRef<typeof Table>, 'children'> {
  data: Data[]
  columns: Column<Data>[]
  initialSortColumn?: string
  initialSortDirection?: Exclude<SortDirection, 'NONE'>
  externalSorting?: boolean
  getRowId?: (row: Data) => string | number
  onToggleSort?: (columnId: string, direction: Exclude<SortDirection, 'NONE'>) => void
}

function defaultGetRowId<Data extends UniqueRow>(row: Data) {
  return row.id
}

function DataTableInner<Data extends UniqueRow>(
  {
    columns,
    data,
    externalSorting = false,
    getRowId = defaultGetRowId,
    initialSortColumn,
    initialSortDirection = 'ASC',
    onToggleSort,
    ...tableProps
  }: DataTableProps<Data>,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  const [sort, setSort] = React.useState<{id: string; direction: Exclude<SortDirection, 'NONE'>} | null>(
    initialSortColumn ? {id: initialSortColumn, direction: initialSortDirection} : null,
  )
  const rows = React.useMemo(() => {
    if (!sort || externalSorting) return data
    const column = columns.find(item => (item.id ?? item.field) === sort.id)
    if (!column?.sortBy) return data
    return [...data].sort((a, b) => {
      const comparison =
        typeof column.sortBy === 'function'
          ? column.sortBy(a, b)
          : String(column.field ? (a[column.field] ?? '') : '').localeCompare(
              String(column.field ? (b[column.field] ?? '') : ''),
              undefined,
              {numeric: true},
            )
      return sort.direction === 'ASC' ? comparison : -comparison
    })
  }, [columns, data, externalSorting, sort])
  const toggleSort = (id: string) => {
    const direction: Exclude<SortDirection, 'NONE'> = sort?.id === id && sort.direction === 'ASC' ? 'DESC' : 'ASC'
    setSort({id, direction})
    onToggleSort?.(id, direction)
  }
  return (
    <Table {...tableProps} ref={ref}>
      <TableHead>
        <TableRow>
          {columns.map(column => {
            const id = column.id ?? column.field
            const label = typeof column.header === 'function' ? column.header() : column.header
            return column.sortBy && id ? (
              <TableSortHeader
                key={id}
                align={column.align}
                direction={sort?.id === id ? sort.direction : 'NONE'}
                onToggleSort={() => toggleSort(id)}
              >
                {label}
              </TableSortHeader>
            ) : (
              <TableHeader key={id ?? String(label)} align={column.align}>
                {label}
              </TableHeader>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={getRowId(row)}>
            {columns.map(column => {
              const id = column.id ?? column.field
              const value = column.renderCell
                ? column.renderCell(row)
                : column.field
                  ? (row[column.field] as React.ReactNode)
                  : null
              return (
                <TableCell key={id} align={column.align} scope={column.rowHeader ? 'row' : undefined}>
                  {value}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const DataTable = React.forwardRef(DataTableInner) as <Data extends UniqueRow>(
  props: DataTableProps<Data> & React.RefAttributes<HTMLTableElement>,
) => React.ReactElement | null
