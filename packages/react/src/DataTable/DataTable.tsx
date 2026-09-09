import {useId, type ReactElement, type ReactNode} from 'react'
import type {Column} from './column'
import {useTable} from './useTable'
import type {SortDirection} from './sorting'
import type {DataTableData, DataTableRowGroup, UniqueRow} from './row'
import type {ObjectPaths} from './utils'
import {Table, TableHead, TableBody, TableRow, TableHeader, TableSortHeader, TableCell} from './Table'
import {TableGroup} from './TableGroup'

// ----------------------------------------------------------------------------
// DataTable
// ----------------------------------------------------------------------------

type DataTableBaseProps<Data extends UniqueRow> = {
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
   * When true, disables client-side sorting for all sortable columns in the
   * table. Use this when sorting is handled server-side. The `onToggleSort`
   * callback will still be fired when a sortable column header is clicked.
   */
  externalSorting?: boolean

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

export type DataTableProps<Data extends UniqueRow> = DataTableBaseProps<Data> & {
  /**
   * Provide a collection of rows, row groups, or a mixture of both.
   */
  data: DataTableData<Data>
}

function defaultGetRowId<D extends UniqueRow>(row: D) {
  return row.id
}

type DataFromInput<Input extends DataTableData<UniqueRow>> =
  Input extends Array<infer Item>
    ? Item extends DataTableRowGroup<infer Data>
      ? Data
      : Item extends UniqueRow
        ? Item
        : never
    : never

type InferredDataTableProps<Input extends DataTableData<UniqueRow>> = DataTableBaseProps<DataFromInput<Input>> & {
  data: Input & DataTableData<DataFromInput<Input>>
}

interface DataTableComponent {
  <Data extends UniqueRow>(props: DataTableProps<Data>): ReactElement
  <Input extends DataTableData<UniqueRow>>(props: InferredDataTableProps<Input>): ReactElement
}

function DataTableImplementation<Data extends UniqueRow>({
  'aria-labelledby': labelledby,
  'aria-describedby': describedby,
  cellPadding,
  columns,
  data,
  initialSortColumn,
  initialSortDirection,
  externalSorting,
  getRowId = defaultGetRowId,
  onToggleSort,
}: DataTableProps<Data>) {
  const tableId = useId()
  const table = useTable({
    data,
    columns,
    initialSortColumn,
    initialSortDirection,
    getRowId,
    externalSorting,
  })
  const {headers, actions, gridTemplateColumns, hasGroups} = table
  const columnHeaderIds = hasGroups ? headers.map((_, index) => `${tableId}-column-${index}`) : []
  const allRows = table.rows.flatMap(item => (item.type === 'row-group' ? item.rows : [item]))
  const rowIndexes = new Map((hasGroups ? allRows : []).map((row, index) => [row, index]))

  const renderRow = (row: (typeof allRows)[number]) => {
    const cells = row.getCells()
    const rowIndex = rowIndexes.get(row)
    if (hasGroups && rowIndex === undefined) {
      throw new Error(`Unable to find row index for row: ${row.id}`)
    }
    const rowHeaderIds = hasGroups
      ? cells.flatMap((cell, index) => (cell.rowHeader ? [`${tableId}-row-${rowIndex}-header-${index}`] : []))
      : []

    return (
      <TableRow key={row.id}>
        {cells.map((cell, index) => {
          const rowHeaderId = hasGroups && cell.rowHeader ? `${tableId}-row-${rowIndex}-header-${index}` : undefined
          const cellHeaderIds = cell.rowHeader ? [columnHeaderIds[index]] : [...rowHeaderIds, columnHeaderIds[index]]

          return (
            <TableCell
              key={cell.id}
              id={rowHeaderId}
              scope={cell.rowHeader ? 'row' : undefined}
              align={cell.column.align}
              headers={hasGroups ? cellHeaderIds.join(' ') : undefined}
            >
              {cell.column.renderCell ? cell.column.renderCell(row.getValue()) : (cell.getValue() as ReactNode)}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }

  const bodies: Array<ReactElement> = []
  let ungroupedRows: typeof allRows = []
  let bodyKey = 'rows:start'

  function appendUngroupedBody() {
    if (ungroupedRows.length > 0) {
      bodies.push(<TableBody key={bodyKey}>{ungroupedRows.map(renderRow)}</TableBody>)
      ungroupedRows = []
    }
  }

  for (const item of table.rows) {
    if (item.type === 'row-group') {
      appendUngroupedBody()
      bodies.push(
        <TableGroup
          key={`group:${item.id}`}
          id={item.id}
          label={item.label}
          rowCount={item.rows.length}
          colSpan={headers.length}
          aria-label={item['aria-label']}
        >
          {item.rows.map(renderRow)}
        </TableGroup>,
      )
      bodyKey = `rows:after:${item.id}`
    } else {
      ungroupedRows.push(item)
    }
  }
  appendUngroupedBody()

  return (
    <Table
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      cellPadding={cellPadding}
      gridTemplateColumns={gridTemplateColumns}
    >
      <TableHead>
        <TableRow>
          {headers.map((header, index) => {
            if (header.isSortable()) {
              return (
                <TableSortHeader
                  key={header.id}
                  id={hasGroups ? columnHeaderIds[index] : undefined}
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
              <TableHeader
                key={header.id}
                id={hasGroups ? columnHeaderIds[index] : undefined}
                align={header.column.align}
              >
                {typeof header.column.header === 'string' ? header.column.header : header.column.header()}
              </TableHeader>
            )
          })}
        </TableRow>
      </TableHead>
      {bodies.length > 0 ? bodies : <TableBody />}
    </Table>
  )
}

const DataTable = DataTableImplementation as DataTableComponent

export {DataTable}
