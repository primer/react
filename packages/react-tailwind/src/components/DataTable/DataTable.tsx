'use client'

import React from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowSelection,
  TableSelectionHeader,
  TableSortHeader,
  type SortDirection,
} from './Table'
import {TableBulkActions, type TableBulkActionsProps} from './TableBulkActions'
import {TableGroup} from './TableGroup'
import {getGridTemplateColumns} from './layout'
import {
  isDataTableRowGroup,
  type DataTableData,
  type DataTableRowGroup,
  type DataTableRowId,
  type UniqueRow,
} from './row'

export type {DataTableData, DataTableRowGroup, DataTableRowId, UniqueRow} from './row'

export type CellAlignment = 'start' | 'end'
export type ColumnWidth = 'grow' | 'growCollapse' | 'auto' | React.CSSProperties['width']
type SortKeyword = 'alphanumeric' | 'datetime'
export type SortStrategy<Data> = boolean | SortKeyword | ((a: Data, b: Data) => number)
type ActiveSortDirection = Exclude<SortDirection, 'NONE'>

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

/** What `renderBulkActions` receives about the current selection. */
export interface DataTableBulkActionsContext {
  /** Ids of the selected rows that are present and selectable. */
  selectedRows: ReadonlySet<DataTableRowId>
  /** Number of selected rows that are present and selectable. */
  selectedCount: number
  /** Clears every selected row, including ids that are not currently rendered. */
  clearSelection: () => void
}

interface DataTableBaseProps<Data extends UniqueRow>
  extends Omit<React.ComponentPropsWithoutRef<typeof Table>, 'children'> {
  /** Column definitions, giving each column its header, width, and how to read a cell from a row. */
  columns: Column<Data>[]
  /** Column sorted on first render. */
  initialSortColumn?: string
  /** Direction sorted on first render. */
  initialSortDirection?: ActiveSortDirection
  /** Stops the table sorting `data` itself, for when rows arrive already sorted by a server. */
  externalSorting?: boolean
  /**
   * Reads a stable identity from a row. Supply it when rows have no `id` field.
   * @default row => row.id
   */
  getRowId?: (row: Data) => DataTableRowId
  /** Called with the column and new direction when a sortable header is activated. */
  onToggleSort?: (columnId: string, direction: ActiveSortDirection) => void
  /** Adds a checkbox column for selecting rows. */
  rowSelection?: boolean
  /** Ids of the selected rows, for when the caller owns the selection. */
  selectedRows?: ReadonlySet<DataTableRowId>
  /** Ids selected on first render, when the table owns its selection. Intended for static, single-page data. */
  defaultSelectedRows?: ReadonlySet<DataTableRowId>
  /** Called with the requested selection when a reader selects or deselects rows. */
  onSelectionChange?: (details: {selectedRows: Set<DataTableRowId>}) => void
  /** Decides whether a row can be selected. Rows are selectable by default. */
  isRowSelectable?: (row: Data) => boolean
  /** Adds disclosure buttons that show and hide each group's rows. Groups start expanded. */
  collapsibleGroups?: boolean
  /** Ids of the expanded groups, for when the caller owns the expanded state. */
  expandedGroups?: ReadonlySet<DataTableRowId>
  /** Ids of the groups expanded on first render. Defaults to every group in the initial data. */
  defaultExpandedGroups?: ReadonlySet<DataTableRowId>
  /** Called with the requested expanded groups when a reader shows or hides a group. */
  onExpandedGroupsChange?: (details: {expandedGroups: Set<DataTableRowId>}) => void
  /** Renders actions for the selected rows in place of the column headers while any row is selected. */
  renderBulkActions?: (context: DataTableBulkActionsContext) => React.ReactNode
  /** Labels for the bulk actions toolbar. */
  bulkActionsProps?: Pick<TableBulkActionsProps, 'aria-label' | 'getSelectedCountLabel'>
  /** Element that receives focus when a focused bulk action disappears. Defaults to the select-all checkbox. */
  bulkActionsReturnFocusRef?: React.RefObject<HTMLElement | null>
}

export interface DataTableProps<Data extends UniqueRow> extends DataTableBaseProps<Data> {
  /** Rows, row groups, or a mixture of both, in display order. */
  data: DataTableData<Data>
}

type IsAny<T> = 0 extends 1 & T ? true : false
type DataFromItem<Item> = Item extends DataTableRowGroup<infer Data> ? Data : Item extends UniqueRow ? Item : never
type DataFromInput<Input> =
  IsAny<Input> extends true ? UniqueRow : Input extends ReadonlyArray<infer Item> ? DataFromItem<Item> : never

export interface InferredDataTableProps<Input> extends DataTableBaseProps<DataFromInput<Input>> {
  /** Rows, row groups, or a mixture of both, in display order. */
  data: Input & DataTableData<DataFromInput<Input>>
}

// Rows are inferred from `data` first, so mixed rows and groups resolve to the row type. The explicit signature is
// last so that `typeof DataTable<Row>` and `ComponentProps` resolve to `DataTableProps<Row>`.
interface DataTableComponent {
  <Input>(props: InferredDataTableProps<Input> & React.RefAttributes<HTMLTableElement>): React.ReactElement | null
  <Data extends UniqueRow>(
    props: DataTableProps<Data> & React.RefAttributes<HTMLTableElement>,
  ): React.ReactElement | null
}

type SortState = {id: string; direction: ActiveSortDirection} | null

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

function getColumnId<Data extends UniqueRow>(column: Column<Data>) {
  return column.id ?? column.field
}

function sortRows<Data extends UniqueRow>(rows: Data[], column: Column<Data>, direction: ActiveSortDirection) {
  const {field, sortBy} = column
  return [...rows].sort((a, b) => {
    if (field === undefined) return 0
    if (typeof sortBy === 'function') return direction === 'ASC' ? sortBy(a, b) : sortBy(b, a)
    const valueA = getValue(a, field)
    const valueB = getValue(b, field)
    // Blank values sort last regardless of direction.
    if (isBlank(valueA) || isBlank(valueB)) return Number(isBlank(valueA)) - Number(isBlank(valueB))
    const comparison = compareValues(valueA, valueB, sortBy === 'datetime' ? 'datetime' : 'alphanumeric')
    return direction === 'ASC' ? comparison : -comparison
  })
}

// Groups keep their position; rows sort within each group and within each run of ungrouped rows.
function sortData<Data extends UniqueRow>(
  data: DataTableData<Data>,
  column: Column<Data>,
  direction: ActiveSortDirection,
) {
  const sorted: DataTableData<Data> = []
  let ungroupedRows: Data[] = []
  const flushUngroupedRows = () => {
    sorted.push(...sortRows(ungroupedRows, column, direction))
    ungroupedRows = []
  }
  for (const item of data) {
    if (isDataTableRowGroup(item)) {
      flushUngroupedRows()
      sorted.push({...item, rows: sortRows(item.rows, column, direction)})
    } else {
      ungroupedRows.push(item)
    }
  }
  flushUngroupedRows()
  return sorted
}

function toggleIds(ids: ReadonlySet<DataTableRowId>, toggled: DataTableRowId[], selected: boolean) {
  const next = new Set(ids)
  for (const id of toggled) {
    if (selected) next.add(id)
    else next.delete(id)
  }
  return next
}

function getSelectionState(selectableCount: number, selectedCount: number): 'all' | 'some' | 'none' {
  if (selectableCount > 0 && selectedCount === selectableCount) return 'all'
  return selectedCount > 0 ? 'some' : 'none'
}

interface RenderedRow<Data extends UniqueRow> {
  row: Data
  id: DataTableRowId
  index: number
  selectable: boolean
  selected: boolean
}

type RenderedBody<Data extends UniqueRow> =
  | {type: 'rows'; key: string; rows: RenderedRow<Data>[]}
  | {
      type: 'group'
      key: string
      group: DataTableRowGroup<Data>
      rows: RenderedRow<Data>[]
      expanded: boolean
      selection: 'all' | 'some' | 'none'
      selectable: boolean
    }

function DataTableInner<Data extends UniqueRow>(
  {
    bulkActionsProps,
    bulkActionsReturnFocusRef,
    collapsibleGroups = false,
    columns,
    data,
    defaultExpandedGroups,
    defaultSelectedRows,
    expandedGroups: controlledExpandedGroups,
    externalSorting = false,
    getRowId = defaultGetRowId,
    initialSortColumn,
    initialSortDirection,
    isRowSelectable,
    onExpandedGroupsChange,
    onSelectionChange,
    onToggleSort,
    renderBulkActions,
    rowSelection = false,
    selectedRows: controlledSelectedRows,
    ...tableProps
  }: DataTableProps<Data>,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  const tableId = React.useId()
  const tableRef = React.useRef<HTMLTableElement>(null)
  // A stable internal ref stays attached while bulk actions recover focus during commit.
  React.useImperativeHandle(ref, () => tableRef.current as HTMLTableElement)
  const selectAllRef = React.useRef<HTMLElement>(null)
  const [sort, setSort] = React.useState<SortState>(() => {
    if (initialSortColumn) return {id: initialSortColumn, direction: initialSortDirection ?? 'ASC'}
    if (!initialSortDirection) return null
    const sortableColumn = columns.find(column => column.sortBy)
    const id = sortableColumn && getColumnId(sortableColumn)
    return id ? {id, direction: initialSortDirection} : null
  })
  const [uncontrolledSelectedRows, setUncontrolledSelectedRows] = React.useState<ReadonlySet<DataTableRowId>>(
    () => defaultSelectedRows ?? new Set(),
  )
  const [uncontrolledExpandedGroups, setUncontrolledExpandedGroups] = React.useState<ReadonlySet<DataTableRowId>>(
    () => defaultExpandedGroups ?? new Set(data.filter(isDataTableRowGroup).map(group => group.groupId)),
  )
  const selectedRows = controlledSelectedRows ?? uncontrolledSelectedRows
  const expandedGroups = controlledExpandedGroups ?? uncontrolledExpandedGroups

  const setSelectedRows = (next: Set<DataTableRowId>) => {
    if (controlledSelectedRows === undefined) setUncontrolledSelectedRows(next)
    onSelectionChange?.({selectedRows: new Set(next)})
  }
  const setExpandedGroups = (next: Set<DataTableRowId>) => {
    if (controlledExpandedGroups === undefined) setUncontrolledExpandedGroups(next)
    onExpandedGroupsChange?.({expandedGroups: new Set(next)})
  }

  // A sort on a column that has since been removed, or is no longer sortable, is ignored.
  const sortColumn = sort ? columns.find(column => getColumnId(column) === sort.id && column.sortBy) : undefined
  const orderedData = sort && sortColumn && !externalSorting ? sortData(data, sortColumn, sort.direction) : data
  const hasGroups = orderedData.some(isDataTableRowGroup)
  const describesRows = hasGroups || rowSelection
  const getHeaderId = (index: number) => (hasGroups ? `${tableId}-column-${index}` : undefined)
  const getRowHeaderId = (rowIndex: number, columnIndex: number) => `${tableId}-row-${rowIndex}-header-${columnIndex}`
  const selectionHeaderId = `${tableId}-selection-column`

  const bodies: RenderedBody<Data>[] = []
  let ungroupedRows: RenderedBody<Data> = {type: 'rows', key: 'rows:start', rows: []}
  let rowIndex = 0
  for (const item of orderedData) {
    const itemRows: RenderedRow<Data>[] = []
    for (const row of isDataTableRowGroup(item) ? item.rows : [item]) {
      const id = getRowId(row)
      const selectable = rowSelection && (isRowSelectable?.(row) ?? true)
      itemRows.push({row, id, index: rowIndex, selectable, selected: selectable && selectedRows.has(id)})
      rowIndex += 1
    }
    if (isDataTableRowGroup(item)) {
      if (ungroupedRows.rows.length > 0) bodies.push(ungroupedRows)
      const selectableRows = itemRows.filter(row => row.selectable)
      bodies.push({
        type: 'group',
        key: `group:${typeof item.groupId}:${item.groupId}`,
        group: item,
        rows: itemRows,
        expanded: !collapsibleGroups || expandedGroups.has(item.groupId),
        selection: getSelectionState(selectableRows.length, selectableRows.filter(row => row.selected).length),
        selectable: selectableRows.length > 0,
      })
      ungroupedRows = {type: 'rows', key: `rows:after:${typeof item.groupId}:${item.groupId}`, rows: []}
    } else {
      ungroupedRows.rows.push(...itemRows)
    }
  }
  if (ungroupedRows.rows.length > 0 || bodies.length === 0) bodies.push(ungroupedRows)

  // Selection only counts rows that are present and selectable, while ids outside the data are retained.
  const selectableRows = bodies.flatMap(body => body.rows).filter(row => row.selectable)
  const effectiveSelectedRows = new Set(selectableRows.filter(row => row.selected).map(row => row.id))
  const selectableCount = selectableRows.length
  const selectedCount = effectiveSelectedRows.size
  const selection = getSelectionState(selectableCount, selectedCount)
  const hasBulkActions = rowSelection && renderBulkActions !== undefined
  const bulkActionsActive = hasBulkActions && selectedCount > 0

  const toggleRows = (rows: RenderedRow<Data>[], allSelected: boolean) => {
    if (rows.length === 0) return
    setSelectedRows(
      toggleIds(
        selectedRows,
        rows.map(row => row.id),
        !allSelected,
      ),
    )
  }
  const clearSelection = () => setSelectedRows(new Set())

  const toggleSort = (id: string) => {
    const direction: ActiveSortDirection = sort?.id === id && sort.direction === 'ASC' ? 'DESC' : 'ASC'
    setSort({id, direction})
    onToggleSort?.(id, direction)
  }

  const returnFocus = () => {
    const target = bulkActionsReturnFocusRef?.current
    const selectAll = selectAllRef.current
    if (target?.isConnected) target.focus()
    else if (selectAll && !selectAll.hasAttribute('data-disabled')) selectAll.focus()
    else tableRef.current?.focus()
  }

  const gridTemplateColumns = [rowSelection ? 'min-content' : '', getGridTemplateColumns(columns)].join(' ').trim()
  const headerRowClassName = hasBulkActions ? '[grid-row:1] *:[grid-row:1]' : undefined

  const renderRow = ({row, id, index, selectable, selected}: RenderedRow<Data>) => {
    const rowHeaderIds = describesRows
      ? columns.flatMap((column, columnIndex) => (column.rowHeader ? [getRowHeaderId(index, columnIndex)] : []))
      : []
    return (
      <TableRow key={`${typeof id}:${id}`}>
        {rowSelection ? (
          <TableRowSelection
            selected={selected}
            disabled={!selectable}
            headers={selectionHeaderId}
            aria-label={rowHeaderIds.length > 0 ? undefined : `Select row ${id}`}
            aria-labelledby={rowHeaderIds.length > 0 ? rowHeaderIds.join(' ') : undefined}
            onToggleSelect={() => {
              if (selectable) setSelectedRows(toggleIds(selectedRows, [id], !selectedRows.has(id)))
            }}
          />
        ) : null}
        {columns.map((column, columnIndex) => {
          const rowHeader = column.rowHeader ?? false
          const headerId = getHeaderId(columnIndex)
          const value = column.renderCell
            ? column.renderCell(row)
            : column.field
              ? (getValue(row, column.field) as React.ReactNode)
              : null
          return (
            <TableCell
              key={getColumnId(column) ?? columnIndex}
              id={describesRows && rowHeader ? getRowHeaderId(index, columnIndex) : undefined}
              align={column.align}
              headers={hasGroups ? (rowHeader ? [headerId] : [...rowHeaderIds, headerId]).join(' ') : undefined}
              scope={rowHeader ? 'row' : undefined}
            >
              {value}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }

  return (
    <Table
      {...tableProps}
      ref={tableRef}
      tabIndex={hasBulkActions ? -1 : tableProps.tabIndex}
      gridTemplateColumns={gridTemplateColumns}
    >
      <TableHead>
        <TableRow className={headerRowClassName}>
          {rowSelection ? (
            <TableSelectionHeader
              id={selectionHeaderId}
              checkboxRef={selectAllRef}
              selection={selection}
              disabled={selectableCount === 0}
              aria-description={
                selectableCount > 0
                  ? `Select all ${selectableCount} ${selectableCount === 1 ? 'row' : 'rows'}`
                  : undefined
              }
              onToggleSelect={() => toggleRows(selectableRows, selection === 'all')}
            />
          ) : null}
          {columns.map((column, index) => {
            const id = getColumnId(column)
            const direction: SortDirection = sort && sortColumn && sort.id === id ? sort.direction : 'NONE'
            const key = id ?? (typeof column.header === 'string' ? column.header : index)
            if (bulkActionsActive) {
              // Keep each header's name and sort state in the accessibility tree while the actions cover them.
              const labelId = typeof column.header === 'string' ? undefined : `${tableId}-bulk-column-${index}`
              return (
                <TableHeader
                  key={key}
                  id={getHeaderId(index)}
                  align={column.align}
                  aria-labelledby={labelId}
                  aria-sort={direction === 'ASC' ? 'ascending' : direction === 'DESC' ? 'descending' : undefined}
                >
                  <span className="min-h-[1lh]">
                    {typeof column.header === 'string' ? (
                      <VisuallyHidden>{column.header}</VisuallyHidden>
                    ) : (
                      <span id={labelId} hidden>
                        {column.header()}
                      </span>
                    )}
                  </span>
                </TableHeader>
              )
            }
            const label = typeof column.header === 'function' ? column.header() : column.header
            return column.sortBy && id ? (
              <TableSortHeader
                key={key}
                id={getHeaderId(index)}
                align={column.align}
                direction={direction}
                onToggleSort={() => toggleSort(id)}
              >
                {label}
              </TableSortHeader>
            ) : (
              <TableHeader key={key} id={getHeaderId(index)} align={column.align}>
                {label}
              </TableHeader>
            )
          })}
        </TableRow>
        {hasBulkActions ? (
          <TableRow className={headerRowClassName}>
            <td
              colSpan={columns.length + 1}
              role="cell"
              className={
                bulkActionsActive
                  ? 'z-1 col-[2/-1] min-w-0 content-center rounded-tr-md border-y border-r border-default bg-muted py-0 pr-2 pl-3 group-data-[cell-padding=condensed]:pl-2 group-data-[cell-padding=spacious]:pl-4'
                  : 'sr-only'
              }
            >
              <TableBulkActions {...bulkActionsProps} selectedCount={selectedCount} onFocusReturn={returnFocus}>
                {bulkActionsActive
                  ? renderBulkActions({selectedRows: new Set(effectiveSelectedRows), selectedCount, clearSelection})
                  : null}
              </TableBulkActions>
            </td>
          </TableRow>
        ) : null}
      </TableHead>
      {bodies.map(body =>
        body.type === 'group' ? (
          <TableGroup
            key={body.key}
            id={body.group.groupId}
            label={body.group.label}
            aria-label={body.group['aria-label']}
            rowCount={body.rows.length}
            colSpan={columns.length + (rowSelection ? 1 : 0)}
            collapsible={collapsibleGroups}
            expanded={body.expanded}
            onExpandedChange={() => {
              if (!collapsibleGroups) return
              setExpandedGroups(
                toggleIds(expandedGroups, [body.group.groupId], !expandedGroups.has(body.group.groupId)),
              )
            }}
            selection={rowSelection && collapsibleGroups ? body.selection : undefined}
            selectionDisabled={!body.selectable}
            onToggleSelect={() =>
              toggleRows(
                body.rows.filter(row => row.selectable),
                body.selection === 'all',
              )
            }
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

export const DataTable = React.forwardRef(DataTableInner) as DataTableComponent
