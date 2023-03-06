import React from 'react'
import {Column} from './column'
import {useTable} from './useTable'
import {SortDirection} from './sorting'
import {UniqueRow} from './row'
import {ObjectPaths} from './utils'
import {Table, TableHead, TableBody, TableRow, TableHeader, TableSortHeader, TableCell} from './Table'

// ----------------------------------------------------------------------------
// DataTable
// ----------------------------------------------------------------------------

export type DataTableProps<Data extends UniqueRow> = {
  /**
   * Provide an id to an element which uniquely describes this table
   */
  'aria-describedby'?: string

  /**
   * Provide an id to an element which uniquely labels this table
   */
  'aria-labelledby'?: string

  /**
   * Specify the amount of space that should be available around the contents of
   * a cell
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious'

  /**
   * Provide a collection of the rows which will be rendered inside of the table
   */
  data: Array<Data>

  /**
   * Provide the columns for the table and the fields in `data` to which they
   * correspond
   */
  columns: Array<Column<Data>>

  /**
   * Provide the id or field of the column by which the table is sorted. When
   * using this `prop`, the input data must be sorted by this column in
   * ascending order
   */
  initialSortColumn?: ObjectPaths<Data> | string

  /**
   * Provide the sort direction that the table should be sorted by on the
   * currently sorted column
   */
  initialSortDirection?: Exclude<SortDirection, 'NONE'>
}

function DataTable<Data extends UniqueRow>({
  'aria-labelledby': labelledby,
  'aria-describedby': describedby,
  cellPadding,
  columns,
  data,
  initialSortColumn,
  initialSortDirection,
}: DataTableProps<Data>) {
  const {headers, rows, actions} = useTable({
    data,
    columns,
    initialSortColumn,
    initialSortDirection,
  })
  return (
    <Table aria-labelledby={labelledby} aria-describedby={describedby} cellPadding={cellPadding}>
      <TableHead>
        <TableRow>
          {headers.map(header => {
            if (header.isSortable()) {
              return (
                <TableSortHeader
                  key={header.id}
                  direction={header.getSortDirection()}
                  onToggleSort={() => {
                    actions.sortBy(header)
                  }}
                >
                  {header.column.header}
                </TableSortHeader>
              )
            }
            return <TableHeader key={header.id}>{header.column.header}</TableHeader>
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow key={row.id}>
              {row.getCells().map(cell => {
                return (
                  <TableCell key={cell.id} scope={cell.rowHeader ? 'row' : undefined}>
                    {cell.column.renderCell
                      ? cell.column.renderCell(row.getValue())
                      : (cell.getValue() as React.ReactNode)}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export {DataTable}
