import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import type React from 'react'
import {useCallback, useId, useMemo, useState} from 'react'
import {Button} from '../internal/components/ButtonReset'
import {AriaStatus} from '../live-region'
import {VisuallyHidden} from '../VisuallyHidden'
import {warning} from '../utils/warning'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {buildPaginationModel} from '../Pagination/model'
import Select from '../Select'
import classes from './Pagination.module.css'
import {clsx} from 'clsx'

export type PaginationProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'onChange'> & {
  /**
   * Provide a label for the navigation landmark rendered by this component
   */
  'aria-label': string

  /**
   * Provide an optional index to specify the default selected page
   */
  defaultPageIndex?: number

  /**
   * Optionally provide an `id` that is placed on the navigation landmark
   * rendered by this component
   */
  id?: string

  /**
   * Optionally provide a handler that is called whenever the pagination state
   * is updated
   */
  onChange?: (state: PaginationState) => void

  /**
   * Called whenever the user selects a new page size from the rows-per-page
   * dropdown. Pair with `pageSizeOptions` to enable the dropdown.
   */
  onPageSizeChange?: (pageSize: number) => void

  /**
   * Optionally specify the number of items within a page
   */
  pageSize?: number

  /**
   * When provided, renders a rows-per-page `<select>` dropdown to the left of
   * the range. Each value must be a positive integer. The current `pageSize`
   * is selected by default; choosing a new value resets the page index to `0`
   * and fires `onPageSizeChange` (and `onChange` with `pageIndex: 0`).
   */
  pageSizeOptions?: ReadonlyArray<number>

  /**
   * Visible label for the rows-per-page dropdown. Only used when
   * `pageSizeOptions` is provided. Defaults to `'Rows per page'`.
   */
  pageSizeLabel?: string

  /**
   * Whether to show the page numbers
   */
  showPages?: boolean | ResponsiveValue<boolean>

  /**
   * Specify the total number of items within the collection
   */
  totalCount: number
}

const defaultShowPages = {
  narrow: false,
}

export function Pagination({
  'aria-label': label,
  defaultPageIndex,
  id,
  onChange,
  onPageSizeChange,
  pageSize = 25,
  pageSizeOptions,
  pageSizeLabel = 'Rows per page',
  showPages = defaultShowPages,
  totalCount,
}: PaginationProps) {
  const {
    pageIndex,
    pageStart,
    pageEnd,
    pageCount,
    hasPreviousPage,
    hasNextPage,
    selectPage,
    selectNextPage,
    selectPreviousPage,
  } = usePagination({
    defaultPageIndex,
    onChange,
    pageSize,
    totalCount,
  })

  const getViewportRangesToHidePages = useCallback(() => {
    if (typeof showPages !== 'boolean') {
      return Object.keys(showPages).filter(key => !showPages[key as keyof typeof viewportRanges]) as Array<
        keyof typeof viewportRanges
      >
    }

    if (showPages) {
      return []
    } else {
      return Object.keys(viewportRanges) as Array<keyof typeof viewportRanges>
    }
  }, [showPages])

  const model = useMemo(() => {
    return buildPaginationModel(pageCount, pageIndex + 1, !!showPages, 1, 2)
  }, [pageCount, pageIndex, showPages])

  // Validate the page-size options once per change so a consumer passing a
  // bogus value (0, negative, NaN) gets a single dev-time warning instead of
  // a silently broken dropdown.
  const validatedPageSizeOptions = useMemo(() => {
    if (!pageSizeOptions || pageSizeOptions.length === 0) {
      return undefined
    }
    const cleaned = pageSizeOptions.filter(size => Number.isFinite(size) && size > 0 && Number.isInteger(size))
    warning(
      cleaned.length !== pageSizeOptions.length,
      // eslint-disable-next-line github/unescaped-html-literal
      '<Pagination> received non-positive-integer entries in `pageSizeOptions`. ' +
        'Those entries were dropped. Got: %s',
      JSON.stringify(pageSizeOptions),
    )
    return cleaned.length > 0 ? cleaned : undefined
  }, [pageSizeOptions])

  const pageSizeSelectId = useId()
  const showPageSizeDropdown = validatedPageSizeOptions !== undefined

  return (
    <nav
      aria-label={label}
      className={clsx('TablePagination', classes.TablePagination)}
      id={id}
      data-component="Table.Pagination"
    >
      <div className={clsx('TablePaginationStart', classes.TablePaginationStart)}>
        {showPageSizeDropdown ? (
          <PageSizeSelect
            id={pageSizeSelectId}
            label={pageSizeLabel}
            options={validatedPageSizeOptions}
            value={pageSize}
            onChange={nextSize => {
              if (nextSize === pageSize) {
                return
              }
              // Resetting page index whenever the page size changes avoids
              // landing on a phantom page (e.g. page 5 of a 10-page list
              // collapsing to a 2-page list when the user picks "50/page").
              if (pageIndex !== 0) {
                selectPage(0)
              }
              onPageSizeChange?.(nextSize)
            }}
          />
        ) : null}
        <Range pageStart={pageStart} pageEnd={pageEnd} totalCount={totalCount} />
      </div>
      <ol
        className={clsx('TablePaginationSteps', classes.TablePaginationSteps)}
        data-hidden-viewport-ranges={getViewportRangesToHidePages().join(' ')}
      >
        <Step>
          <Button
            className={clsx('TablePaginationAction', classes.TablePaginationAction)}
            type="button"
            data-has-page={hasPreviousPage ? true : undefined}
            aria-disabled={!hasPreviousPage ? true : undefined}
            data-component="Table.Pagination.PreviousPageButton"
            onClick={() => {
              if (!hasPreviousPage) {
                return
              }
              selectPreviousPage()
            }}
          >
            {hasPreviousPage ? <ChevronLeftIcon /> : null}
            <span>Previous</span>
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
          </Button>
        </Step>
        {model.map((page, i) => {
          if (page.type === 'BREAK') {
            return <TruncationStep key={`truncation-${i}`} />
          } else if (page.type === 'NUM') {
            return (
              <Step key={i}>
                <Page
                  active={!!page.selected}
                  onClick={() => {
                    selectPage(page.num - 1)
                  }}
                >
                  {page.num}
                  {page.precedesBreak ? <VisuallyHidden>…</VisuallyHidden> : null}
                </Page>
              </Step>
            )
          }
        })}
        <Step>
          <Button
            className={clsx('TablePaginationAction', classes.TablePaginationAction)}
            type="button"
            data-has-page={hasNextPage ? true : undefined}
            aria-disabled={!hasNextPage ? true : undefined}
            data-component="Table.Pagination.NextPageButton"
            onClick={() => {
              if (!hasNextPage) {
                return
              }
              selectNextPage()
            }}
          >
            <span>Next</span>
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
            {hasNextPage ? <ChevronRightIcon /> : null}
          </Button>
        </Step>
      </ol>
    </nav>
  )
}

type PageSizeSelectProps = {
  id: string
  label: string
  options: ReadonlyArray<number>
  value: number
  onChange: (size: number) => void
}

function PageSizeSelect({id, label, options, value, onChange}: PageSizeSelectProps) {
  // If the current page size isn't part of the provided options, prepend it so
  // the dropdown can still reflect reality (useful when a consumer feeds an
  // initial pageSize like 25 alongside options like [10, 50, 100]).
  const renderedOptions = options.includes(value) ? options : [value, ...options]
  return (
    <div
      className={clsx('TablePaginationPageSize', classes.TablePaginationPageSize)}
      data-component="Table.Pagination.PageSizeSelect"
    >
      <label htmlFor={id} className={clsx('TablePaginationPageSizeLabel', classes.TablePaginationPageSizeLabel)}>
        {label}
      </label>
      <Select
        id={id}
        size="small"
        value={String(value)}
        onChange={event => {
          const next = Number((event.target as HTMLSelectElement).value)
          if (Number.isFinite(next) && next > 0) {
            onChange(next)
          }
        }}
      >
        {renderedOptions.map(size => (
          <Select.Option key={size} value={String(size)}>
            {size}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

type RangeProps = {
  pageStart: number
  pageEnd: number
  totalCount: number
}

function Range({pageStart, pageEnd, totalCount}: RangeProps) {
  const start = pageStart + 1
  const end = pageEnd
  return (
    <>
      <VisuallyHidden>
        <AriaStatus>
          Showing {start} through {end} of {totalCount}
        </AriaStatus>
      </VisuallyHidden>
      <p className={clsx('TablePaginationRange', classes.TablePaginationRange)} data-component="Table.Pagination.Range">
        {start}
        <VisuallyHidden>&nbsp;through&nbsp;</VisuallyHidden>
        <span aria-hidden="true">‒</span>
        {end} of {totalCount}
      </p>
    </>
  )
}

function TruncationStep() {
  return (
    <li
      aria-hidden="true"
      className={clsx('TablePaginationTruncationStep', classes.TablePaginationTruncationStep)}
      data-component="Table.Pagination.TruncationStep"
    >
      …
    </li>
  )
}

function Step({children}: React.PropsWithChildren) {
  return (
    <li className={clsx('TablePaginationStep', classes.TablePaginationStep)} data-component="Table.Pagination.Step">
      {children}
    </li>
  )
}

type PageProps = React.PropsWithChildren<{
  active: boolean
  onClick: () => void
}>

function Page({active, children, onClick}: PageProps) {
  return (
    <Button
      className={clsx('TablePaginationPage', classes.TablePaginationPage)}
      type="button"
      data-active={active ? true : undefined}
      aria-current={active ? true : undefined}
      onClick={onClick}
      data-component="Table.Pagination.Page"
    >
      <VisuallyHidden>Page&nbsp;</VisuallyHidden>
      {children}
    </Button>
  )
}

type PaginationState = {
  /**
   * The index of currently selected page
   */
  pageIndex: number
}

type PaginationConfig = {
  /**
   * Provide an optional index to specify the default selected page
   */
  defaultPageIndex?: number

  /**
   * Provide an optional handler that is called whenever the pagination state
   * has changed
   */
  onChange?: (state: PaginationState) => void

  /**
   * Specify the number of items within a page
   */
  pageSize: number

  /**
   * Specify the total number of items within the collection
   */
  totalCount: number
}

type PaginationResult = {
  /**
   * The index for the currently selected page
   */
  pageIndex: number

  /**
   * The number that represents the position of the item at the beginning of the
   * current page.
   */
  pageStart: number

  /**
   * The number that represents the position of the item at the end of the
   * current page.
   */
  pageEnd: number

  /**
   * The number of pages in the current pagination context
   */
  pageCount: number

  /**
   * Indicates if a previous page is available given the current state and
   * pagination options
   */
  hasPreviousPage: boolean

  /**
   * Indicates if a next page is available given the current state and
   * pagination options
   */
  hasNextPage: boolean

  /**
   * Perform an action to select the page at the given index
   */
  selectPage: (pageIndex: number) => void

  /**
   * Perform an action to select the previous page, if one is available
   */
  selectPreviousPage: () => void

  /**
   * Perform an action to select the next page, if one is available
   */
  selectNextPage: () => void
}

function usePagination(config: PaginationConfig): PaginationResult {
  const {defaultPageIndex, onChange, pageSize, totalCount} = config
  const pageCount = Math.ceil(totalCount / pageSize)
  const [defaultIndex, setDefaultIndex] = useState(() => {
    if (defaultPageIndex !== undefined) {
      if (defaultPageIndex >= 0 && defaultPageIndex < pageCount) {
        return defaultPageIndex
      }

      warning(
        true,
        // eslint-disable-next-line github/unescaped-html-literal
        '<Pagination> expected `defaultPageIndex` to be less than the ' +
          'total number of pages. Instead, received a `defaultPageIndex` ' +
          'of %s with %s total pages.',
        defaultPageIndex,
        pageCount,
      )
    }

    return 0
  })
  const [pageIndex, setPageIndex] = useState(defaultIndex)
  const validDefaultPageCount = defaultPageIndex !== undefined && defaultPageIndex >= 0 && defaultPageIndex < pageCount
  if (validDefaultPageCount && defaultIndex !== defaultPageIndex) {
    setDefaultIndex(defaultPageIndex)
    setPageIndex(defaultPageIndex)
    onChange?.({pageIndex: defaultPageIndex})
  }
  const pageStart = pageIndex * pageSize
  const pageEnd = Math.min((pageIndex + 1) * pageSize, totalCount)
  const hasNextPage = pageIndex + 1 < pageCount
  const hasPreviousPage = pageIndex > 0

  function selectPage(newPageIndex: number) {
    if (pageIndex !== newPageIndex) {
      setPageIndex(newPageIndex)
      onChange?.({pageIndex: newPageIndex})
    }
  }

  function selectPreviousPage() {
    if (hasPreviousPage) {
      selectPage(pageIndex - 1)
    }
  }

  function selectNextPage() {
    if (hasNextPage) {
      selectPage(pageIndex + 1)
    }
  }

  return {
    pageIndex,
    pageStart,
    pageEnd,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    selectPage,
    selectPreviousPage,
    selectNextPage,
  }
}
