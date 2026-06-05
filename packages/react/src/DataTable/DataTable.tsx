import React from 'react'
import type {Column} from './column'
import {useTable} from './useTable'
import type {SortDirection} from './sorting'
import type {UniqueRow} from './row'
import type {ObjectPaths} from './utils'
import {Table, TableHead, TableBody, TableRow, TableHeader, TableSortHeader, TableCell} from './Table'
import {Pagination} from './Pagination'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'

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

  /**
   * Render an integrated pagination control beneath the table. Pass `false`
   * (or omit) to opt out and continue composing `<Table.Pagination />`
   * manually.
   *
   * Provide either `true` to use defaults, or an options object:
   *   - `pageSize`        — items per page (default `25`)
   *   - `defaultPageIndex` — initial page index (uncontrolled mode only)
   *   - `aria-label`      — landmark label (default `'Pagination'`)
   *   - `showPages`       — show numbered pages (default `{narrow: false}`)
   */
  pagination?:
    | false
    | true
    | {
        pageSize?: number
        defaultPageIndex?: number
        'aria-label'?: string
        showPages?: boolean | ResponsiveValue<boolean>
      }

  /**
   * Controlled page index. When provided, the parent owns the page state and
   * `defaultPageIndex` is ignored. Pair with `onPageChange`.
   */
  pageIndex?: number

  /**
   * Called whenever the page index changes (controlled or uncontrolled).
   */
  onPageChange?: (pageIndex: number) => void

  /**
   * When `true`, disables client-side row slicing. The pagination control
   * still renders and `onPageChange` still fires, but `data` is rendered
   * as-is. Use this for server-driven pagination where the consumer fetches
   * one page at a time.
   */
  externalPagination?: boolean
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
  externalSorting,
  externalPagination,
  pagination,
  pageIndex,
  onPageChange,
  getRowId = defaultGetRowId,
  onToggleSort,
}: DataTableProps<Data>) {
  // Normalize the `pagination` prop. `true` is a shortcut for defaults; an
  // object provides explicit overrides; `false`/`undefined` keeps the
  // pre-existing behaviour (no integrated pagination — consumers can still
  // compose `<Table.Pagination>` themselves).
  const paginationOptions = pagination === true ? {} : pagination || undefined
  const paginationEnabled = paginationOptions !== undefined
  // Defensive clamp so a bogus `pageSize` (0, negative, NaN) cannot produce
  // Infinity in `<Pagination>`'s page-count math.
  const rawPageSize = paginationOptions?.pageSize ?? 25
  const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 ? Math.floor(rawPageSize) : 25
  const defaultPageIndex = paginationOptions?.defaultPageIndex ?? 0
  const paginationAriaLabel = paginationOptions?.['aria-label'] ?? 'Pagination'

  const isControlledPage = pageIndex !== undefined
  // All uncontrolled page state lives in a single object so the
  // "reset when data identity changes" path is a single setState rather
  // than three — keeps the React reconciler happy and prevents cascading
  // renders under Strict / Concurrent mode. Documented React pattern:
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [pageState, setPageState] = React.useState<{
    pageIndex: number
    resetKey: number
    prevData: ReadonlyArray<Data>
  }>(() => ({pageIndex: defaultPageIndex, resetKey: 0, prevData: data}))
  const controlledPageIndex = isControlledPage ? Math.max(0, pageIndex as number) : undefined
  const effectivePageIndex = controlledPageIndex ?? pageState.pageIndex
  if (!isControlledPage && pageState.prevData !== data) {
    // Derived-state-from-props reset. The functional setState body is
    // idempotent and only triggers an additional render the first time
    // we see a new `data` identity.
    setPageState(prev => ({pageIndex: 0, resetKey: prev.resetKey + 1, prevData: data}))
  }

  const {headers, rows, actions, gridTemplateColumns} = useTable({
    data,
    columns,
    initialSortColumn,
    initialSortDirection,
    getRowId,
    externalSorting,
  })

  // Slice the sorted rows down to the visible page when integrated pagination
  // is enabled and the consumer hasn't taken over with externalPagination.
  let visibleRows = rows
  let totalCount = rows.length
  if (paginationEnabled) {
    if (externalPagination) {
      // Consumer is feeding one page of data already. `data.length` is the
      // page size; totalCount is unknown to us, but Pagination needs a
      // sensible value to compute its model. Default to the larger of
      // (pageIndex+1)*pageSize and the visible row count so the "next"
      // button stays enabled while there might be more pages.
      totalCount = Math.max(rows.length, (effectivePageIndex + 1) * pageSize + 1)
    } else {
      // Clamp the slice window to valid bounds so a bogus pageIndex (out
      // of range in controlled mode, or stale across data shrinks) can't
      // produce an empty page when one exists.
      const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
      const clampedIndex = Math.min(Math.max(0, effectivePageIndex), pageCount - 1)
      const pageStart = clampedIndex * pageSize
      const pageEnd = pageStart + pageSize
      visibleRows = rows.slice(pageStart, pageEnd)
      // Ensure Pagination sees at least one page even when the dataset is
      // empty, otherwise its `defaultPageIndex` validation logs a warning
      // about an out-of-range index.
      totalCount = Math.max(rows.length, 1)
    }
  }

  return (
    <>
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
          {visibleRows.map(row => {
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
      {paginationEnabled ? (
        // The <Pagination> component owns its own UI page state. We must
        // pass `defaultPageIndex` only when intending to (re)initialise
        // that internal state — otherwise Pagination's render-time
        // `defaultPageIndex` sync would call back into DataTable's
        // setState during Pagination's render, triggering React's
        // cross-component setState warning.
        //
        // - Controlled mode: every new `pageIndex` value bumps the remount
        //   key so the parent's value takes effect cleanly.
        // - Uncontrolled mode: we never change the prop after mount;
        //   navigation updates Pagination's internal state directly and we
        //   mirror it via onChange for row slicing. Data-identity changes
        //   bump the reset counter so Pagination remounts and clamps.
        <Pagination
          key={isControlledPage ? `controlled-${effectivePageIndex}` : `reset-${pageState.resetKey}`}
          aria-label={paginationAriaLabel}
          defaultPageIndex={isControlledPage ? (pageIndex as number) : defaultPageIndex}
          pageSize={pageSize}
          showPages={paginationOptions.showPages}
          totalCount={totalCount}
          onChange={({pageIndex: nextPageIndex}) => {
            if (!isControlledPage) {
              setPageState(prev => ({...prev, pageIndex: nextPageIndex}))
            }
            onPageChange?.(nextPageIndex)
          }}
        />
      ) : null}
    </>
  )
}

export {DataTable}
