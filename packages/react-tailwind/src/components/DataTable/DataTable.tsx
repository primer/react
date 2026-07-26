'use client'

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
import {getGridTemplateColumns} from './layout'

export type UniqueRow = {id: string | number}
export type CellAlignment = 'start' | 'end'
export type ColumnWidth = 'grow' | 'growCollapse' | 'auto' | React.CSSProperties['width']
type SortKeyword = 'alphanumeric' | 'datetime'
export type SortStrategy<Data> = boolean | SortKeyword | ((a: Data, b: Data) => number)

interface ColumnBase<Data extends UniqueRow> {
  id?: string
  header: string | (() => React.ReactNode)
  align?: CellAlignment
  maxWidth?: React.CSSProperties['maxWidth']
  minWidth?: React.CSSProperties['minWidth']
  renderCell?: (data: Data) => React.ReactNode
  rowHeader?: boolean
  width?: ColumnWidth
}

export type Column<Data extends UniqueRow> =
  | (ColumnBase<Data> & {
      field: string
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

function getValue<Data>(row: Data, field: string) {
  return field.split('.').reduce<unknown>((value, key) => {
    return value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined
  }, row)
}

function isBlank(value: unknown) {
  return value === null || value === undefined || value === ''
}

function compareValues(valueA: unknown, valueB: unknown, strategy: SortKeyword) {
  if (strategy === 'datetime') {
    return new Date(valueA as string | number | Date).valueOf() - new Date(valueB as string | number | Date).valueOf()
  }

  return String(valueA).localeCompare(String(valueB), undefined, {numeric: true})
}

function DataTableInner<Data extends UniqueRow>(
  {
    columns,
    data,
    externalSorting = false,
    getRowId = defaultGetRowId,
    initialSortColumn,
    initialSortDirection,
    onToggleSort,
    ...tableProps
  }: DataTableProps<Data>,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  const [sort, setSort] = React.useState<{id: string; direction: Exclude<SortDirection, 'NONE'>} | null>(() => {
    if (initialSortColumn) return {id: initialSortColumn, direction: initialSortDirection ?? 'ASC'}
    if (!initialSortDirection) return null
    const sortableColumn = columns.find(column => column.sortBy)
    const id = sortableColumn && (sortableColumn.id ?? sortableColumn.field)
    return id ? {id, direction: initialSortDirection} : null
  })
  const rows = React.useMemo(() => {
    if (!sort || externalSorting) return data
    const column = columns.find(item => (item.id ?? item.field) === sort.id)
    if (!column?.sortBy) return data
    return [...data].sort((a, b) => {
      const valueA = column.field ? getValue(a, column.field) : undefined
      const valueB = column.field ? getValue(b, column.field) : undefined
      if (!isBlank(valueA) && isBlank(valueB)) return -1
      if (isBlank(valueA) && !isBlank(valueB)) return 1
      if (isBlank(valueA) && isBlank(valueB)) return 0
      const comparison =
        typeof column.sortBy === 'function'
          ? column.sortBy(a, b)
          : compareValues(valueA, valueB, column.sortBy === 'datetime' ? 'datetime' : 'alphanumeric')
      return sort.direction === 'ASC' ? comparison : -comparison
    })
  }, [columns, data, externalSorting, sort])
  const gridTemplateColumns = React.useMemo(() => getGridTemplateColumns(columns), [columns])
  const toggleSort = (id: string) => {
    const direction: Exclude<SortDirection, 'NONE'> = sort?.id === id && sort.direction === 'ASC' ? 'DESC' : 'ASC'
    setSort({id, direction})
    onToggleSort?.(id, direction)
  }
  return (
    <Table {...tableProps} ref={ref} gridTemplateColumns={gridTemplateColumns}>
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
                  ? (getValue(row, column.field) as React.ReactNode)
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
;('use client')
