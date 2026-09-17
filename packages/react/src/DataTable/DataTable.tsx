import type {ReactElement, ReactNode} from 'react'
import type {Column} from './column'
import {useTable} from './useTable'
import type {SortDirection} from './sorting'
import type {DataTableData, DataTableRowGroup, DataTableRowId, UniqueRow} from './row'
import type {IsAny, ObjectPaths} from './utils'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableSortHeader,
  TableSelectionHeader,
  TableCell,
  TableRowSelection,
} from './Table'
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
  getRowId?: (rowData: Data) => DataTableRowId

  /**
   * Fires every time the user clicks a sortable column header. It reports
   * the column id that is now sorted and the direction after the toggle
   * (never `"NONE"`).
   */
  onToggleSort?: (columnId: ObjectPaths<Data> | string | number, direction: Exclude<SortDirection, 'NONE'>) => void

  /**
   * Whether to render controls for selecting rows.
   */
  rowSelection?: boolean

  /**
   * Controls the selected row IDs.
   */
  selectedRows?: ReadonlySet<DataTableRowId>

  /**
   * Provides the initially selected row IDs for an uncontrolled table.
   * Uncontrolled selection is intended for static, single-page data.
   */
  defaultSelectedRows?: ReadonlySet<DataTableRowId>

  /**
   * Handles changes to the selected row IDs.
   */
  onSelectionChange?: ({selectedRows}: {selectedRows: Set<DataTableRowId>}) => void

  /**
   * Determines whether a row can be selected.
   */
  isRowSelectable?: (row: Data) => boolean
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

type DataFromItem<Item> = Item extends DataTableRowGroup<infer Data> ? Data : Item extends UniqueRow ? Item : never

type DataFromInput<Input extends DataTableData<UniqueRow>> =
  IsAny<Input> extends true ? UniqueRow : DataFromItem<Input[number]>

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
  rowSelection = false,
  selectedRows,
  defaultSelectedRows,
  onSelectionChange,
  isRowSelectable,
}: DataTableProps<Data>) {
  const table = useTable({
    data,
    columns,
    initialSortColumn,
    initialSortDirection,
    getRowId,
    externalSorting,
    rowSelection,
    selectedRows,
    defaultSelectedRows,
    onSelectionChange,
    isRowSelectable,
  })
  const {headers, bodies, actions, selection, gridTemplateColumns} = table

  const renderRow = (row: (typeof bodies)[number]['rows'][number]) => (
    <TableRow key={`${typeof row.selectionId}:${row.selectionId}`}>
      {rowSelection ? (
        <TableRowSelection
          selected={row.selected}
          disabled={!row.selectable}
          headers={selection.headerId}
          aria-label={row.selectionLabelledBy ? undefined : `Select row ${row.selectionId}`}
          aria-labelledby={row.selectionLabelledBy}
          onToggleSelect={() => {
            actions.toggleRowSelection(row)
          }}
        />
      ) : null}
      {row.getCells().map(cell => (
        <TableCell
          key={cell.id}
          id={cell.domId}
          scope={cell.rowHeader ? 'row' : undefined}
          align={cell.column.align}
          headers={cell.headers}
        >
          {cell.column.renderCell ? cell.column.renderCell(row.getValue()) : (cell.getValue() as ReactNode)}
        </TableCell>
      ))}
    </TableRow>
  )

  return (
    <Table
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      cellPadding={cellPadding}
      gridTemplateColumns={gridTemplateColumns}
    >
      <TableHead>
        <TableRow>
          {rowSelection ? (
            <TableSelectionHeader
              id={selection.headerId}
              selection={selection.allSelected ? 'all' : selection.someSelected ? 'some' : 'none'}
              disabled={selection.selectableCount === 0}
              aria-label="Select rows"
              aria-description={
                selection.selectableCount > 0
                  ? `Select all ${selection.selectableCount} ${selection.selectableCount === 1 ? 'row' : 'rows'}`
                  : undefined
              }
              onToggleSelect={() => {
                actions.toggleAllRows()
              }}
            />
          ) : null}
          {headers.map(header => {
            if (header.isSortable()) {
              return (
                <TableSortHeader
                  key={header.id}
                  id={header.domId}
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
              <TableHeader key={header.id} id={header.domId} align={header.column.align}>
                {typeof header.column.header === 'string' ? header.column.header : header.column.header()}
              </TableHeader>
            )
          })}
        </TableRow>
      </TableHead>
      {bodies.map(body =>
        body.type === 'row-group' ? (
          <TableGroup
            key={body.key}
            id={body.id}
            label={body.label}
            rowCount={body.rows.length}
            colSpan={headers.length + (rowSelection ? 1 : 0)}
            aria-label={body['aria-label']}
          >
            {body.rows.map(renderRow)}
          </TableGroup>
        ) : (
          <TableBody key={body.key}>{body.rows.map(renderRow)}</TableBody>
        ),
      )}
    </Table>
  )
}

const DataTable = DataTableImplementation as DataTableComponent

export {DataTable}
