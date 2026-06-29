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

/**
 * Options object accepted by `DataTableProps.pagination` to configure the
 * integrated pagination control. Exported so consumers can type a shared
 * config in their own code.
 *
 * Design note: the surrounding `pagination` prop is a single switch — pass
 * `true` for defaults or an options object to customise — because integrated
 * pagination needs an explicit opt-in signal. Flattening these options into
 * individual top-level props (e.g. `pageSize`, `pageSizeOptions`, etc.) would
 * mean the table silently entered "pagination mode" the moment any one of
 * them was set, which is harder to read at the call site and easy to do by
 * accident. Keeping all integrated-pagination configuration on this single
 * options object makes the call site self-documenting:
 *
 * ```tsx
 * <DataTable pagination={{pageSize: 10, pageSizeOptions: [10, 25, 50]}} />
 * ```
 */
export type IntegratedPaginationOptions = {
  /** Items per page when no rows-per-page selection has happened yet. Defaults to `25`. */
  pageSize?: number
  /**
   * When provided, renders a rows-per-page `<select>` dropdown alongside the
   * range. Each value must be a positive integer. Selecting a new value resets
   * the page index to `0`.
   */
  pageSizeOptions?: ReadonlyArray<number>
  /**
   * Visible label for the rows-per-page dropdown. Defaults to `'Rows per page'`.
   * Only used when `pageSizeOptions` is provided.
   */
  pageSizeLabel?: string
  /** Initial page index (uncontrolled mode only). */
  defaultPageIndex?: number
  /** Accessible landmark label for the navigation. Defaults to `'Pagination'`. */
  'aria-label'?: string
  /** Show numbered pages. Defaults to `{narrow: false}`. */
  showPages?: boolean | ResponsiveValue<boolean>
}

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
   * Pass `true` for defaults, or an {@link IntegratedPaginationOptions} object
   * to customise.
   */
  pagination?: false | true | IntegratedPaginationOptions

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
   * Controlled page size. When provided, the parent owns the rows-per-page
   * selection and `pagination.pageSize` becomes the initial value only. Pair
   * with `onPageSizeChange`.
   */
  pageSize?: number

  /**
   * Called whenever the user picks a new page size from the rows-per-page
   * dropdown. The integrated pagination always resets `pageIndex` to `0`
   * when the page size changes, so `onPageChange(0)` will also fire.
   */
  onPageSizeChange?: (pageSize: number) => void

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

function clampPageSize(raw: number | undefined, fallback: number): number {
  if (raw === undefined) return fallback
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : fallback
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
  pageSize,
  onPageSizeChange,
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
  const initialPageSize = clampPageSize(paginationOptions?.pageSize, 25)
  const defaultPageIndex = paginationOptions?.defaultPageIndex ?? 0
  const paginationAriaLabel = paginationOptions?.['aria-label'] ?? 'Pagination'
  const pageSizeOptions = paginationOptions?.pageSizeOptions
  const pageSizeLabel = paginationOptions?.pageSizeLabel

  const isControlledPage = pageIndex !== undefined
  const isControlledPageSize = pageSize !== undefined
  // All uncontrolled page state lives in a single object so the
  // "reset when data identity changes" path is a single setState rather
  // than three — keeps the React reconciler happy and prevents cascading
  // renders under Strict / Concurrent mode. Documented React pattern:
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [pageState, setPageState] = React.useState<{
    pageIndex: number
    pageSize: number
    resetKey: number
    prevData: ReadonlyArray<Data>
  }>(() => ({pageIndex: defaultPageIndex, pageSize: initialPageSize, resetKey: 0, prevData: data}))
  const controlledPageIndex = isControlledPage ? Math.max(0, pageIndex as number) : undefined
  const effectivePageIndex = controlledPageIndex ?? pageState.pageIndex
  const effectivePageSize = isControlledPageSize ? clampPageSize(pageSize, initialPageSize) : pageState.pageSize
  if (!isControlledPage && pageState.prevData !== data) {
    // Derived-state-from-props reset. The functional setState body is
    // idempotent and only triggers an additional render the first time
    // we see a new `data` identity.
    setPageState(prev => ({...prev, pageIndex: 0, resetKey: prev.resetKey + 1, prevData: data}))
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
      totalCount = Math.max(rows.length, (effectivePageIndex + 1) * effectivePageSize + 1)
    } else {
      // Clamp the slice window to valid bounds so a bogus pageIndex (out
      // of range in controlled mode, or stale across data shrinks) can't
      // produce an empty page when one exists.
      const pageCount = Math.max(1, Math.ceil(rows.length / effectivePageSize))
      const clampedIndex = Math.min(Math.max(0, effectivePageIndex), pageCount - 1)
      const pageStart = clampedIndex * effectivePageSize
      const pageEnd = pageStart + effectivePageSize
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
        //   and page-size changes bump the reset counter so Pagination
        //   remounts and clamps.
        <Pagination
          key={
            isControlledPage
              ? `controlled-${effectivePageIndex}-${effectivePageSize}`
              : `reset-${pageState.resetKey}-${effectivePageSize}`
          }
          aria-label={paginationAriaLabel}
          // When uncontrolled, use the live `pageState.pageIndex` so a remount
          // after a page-size change (which resets to 0) doesn't seed
          // Pagination with the original `defaultPageIndex` and warn about an
          // out-of-range index against the now-smaller pageCount.
          defaultPageIndex={
            isControlledPage ? (pageIndex as number) : pageState.resetKey === 0 ? defaultPageIndex : pageState.pageIndex
          }
          pageSize={effectivePageSize}
          pageSizeOptions={pageSizeOptions}
          pageSizeLabel={pageSizeLabel}
          onPageSizeChange={nextSize => {
            // The page-size dropdown always resets the page index to 0 (both
            // Pagination's internal state and our mirror), so we bump the
            // remount key and reset pageIndex in uncontrolled mode here.
            if (!isControlledPageSize) {
              setPageState(prev => ({
                ...prev,
                pageIndex: 0,
                pageSize: nextSize,
                resetKey: prev.resetKey + 1,
              }))
            }
            onPageSizeChange?.(nextSize)
            // Fire onPageChange with 0 so controlled consumers can update
            // their own pageIndex state in lockstep.
            if (effectivePageIndex !== 0) {
              onPageChange?.(0)
            }
          }}
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
