import type React from 'react'
import type {Column} from './column'
import {useTable} from './useTable'
import type {SortDirection} from './sorting'
import type {UniqueRow} from './row'
import type {ObjectPaths} from './utils'
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
  initialSortColumn?: ObjectPaths<Data> | string | number

  /**
   * Provide the sort direction that the table should be sorted by on the
   * currently sorted column
   */
  initialSortDirection?: Exclude<SortDirection, 'NONE'>

  /**
   * Provide a function to determine the unique identifier for each row.
   * This function allows you to customize the key used for the row.
   * By default, the table uses the `id` field from the data.
   * @param rowData The row data object for which the ID is being retrieved.
   * @returns The unique identifier for the row, which can be a string or number.
   */
  getRowId?: (rowData: Data) => string | number

  /**
   * Fires every time the user clicks a sortable column header. It reports
   * the column id that is now sorted and the direction after the toggle
   * (never `"NONE"`).
   */
  onToggleSort?: (columnId: ObjectPaths<Data> | string | number, direction: Exclude<SortDirection, 'NONE'>) => void
}

function defaultGetRowId<D extends UniqueRow>(row: D) {
  return row.id
}

function DataTable<Data extends UniqueRow>({
  'aria-labelledby': labelledby,
  'aria-describedby': describedby,
  cellPadding,
  columns,
  data,
  initialSortColumn,
  initialSortDirection,
  getRowId = defaultGetRowId,
  onToggleSort,
}: DataTableProps<Data>) {
  const {headers, rows, actions, gridTemplateColumns} = useTable({
    data,
    columns,
    initialSortColumn,
    initialSortDirection,
    getRowId,
  })

  return (
    <Table
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      cellPadding={cellPadding}
      gridTemplateColumns={gridTemplateColumns}
    >
      <TableHead>
        <TableRow>
          {headers.map(header => {
            if (header.isSortable()) {
              return (
                <TableSortHeader
                  key={header.id}
                  align={header.column.align}
                  direction={header.getSortDirection()}
                  onToggleSort={() => {
                    const nextDirection: Exclude<SortDirection, 'NONE'> =
                      header.getSortDirection() === 'ASC' ? 'DESC' : 'ASC'
                    actions.sortBy(header)
                    onToggleSort?.(header.id, nextDirection)
                  }}
                >
                  {typeof header.column.header === 'string' ? header.column.header : header.column.header()}
                </TableSortHeader>
              )
            }
            return (
              <TableHeader key={header.id} align={header.column.align}>
                {typeof header.column.header === 'string' ? header.column.header : header.column.header()}
              </TableHeader>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow key={row.id}>
              {row.getCells().map(cell => {
                return (
                  <TableCell key={cell.id} scope={cell.rowHeader ? 'row' : undefined} align={cell.column.align}>
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
