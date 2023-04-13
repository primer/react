import {useState} from 'react'
import {warning} from '../utils/warning'
import {useId} from '../hooks/useId'
import VisuallyHidden from '../_VisuallyHidden'

interface PaginationState {
  /**
   * The index of currently selected page
   */
  pageIndex: number
}

interface PaginationOptions {
  /**
   * The index of default selected page
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
  totalItems: number
}

export function usePagination({defaultPageIndex, onChange, pageSize, totalItems}: PaginationOptions) {
  const [pageIndex, setPageIndex] = useState(defaultPageIndex ?? 0)
  const pageCount = Math.ceil(totalItems / pageSize)
  const hasNextPage = pageIndex + 1 < pageCount
  const hasPreviousPage = pageIndex > 0

  function selectPage(pageIndex: number) {
    setPageIndex(pageIndex)
    onChange?.({
      pageIndex,
    })
  }

  function selectNextPage() {
    if (hasNextPage) {
      selectPage(pageIndex + 1)
    } else {
      warning(true, 'usePagination expected `selectNextPage` to be called only when a next page is available.')
    }
  }

  function selectPreviousPage() {
    if (hasPreviousPage) {
      selectPage(pageIndex - 1)
    } else {
      warning(true, 'usePagination expected `selectPreviousPage` to be called only when a previous page is available.')
    }
  }

  return {
    pageIndex,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    selectPage,
    selectNextPage,
    selectPreviousPage,
  }
}

type PaginationProps = {
  defaultPageIndex?: number
  label: string
  pageSize: number
  totalItems: number
  onChange?: (state: PaginationState) => void
}

const MAX_PAGE_ITEMS = 4

export function Pagination({defaultPageIndex, label, onChange, pageSize, totalItems}: PaginationProps) {
  const {pageIndex, pageCount, hasNextPage, hasPreviousPage, selectPage, selectNextPage, selectPreviousPage} =
    usePagination({
      defaultPageIndex,
      pageSize,
      totalItems,
      onChange,
    })
  const start = pageIndex * pageSize + 1
  const end = Math.min(pageIndex * pageSize + pageSize, totalItems)
  const truncated = pageCount > MAX_PAGE_ITEMS
  const truncateIndex = Math.floor(MAX_PAGE_ITEMS / 2)
  const pages = Array.from({length: Math.min(pageCount, MAX_PAGE_ITEMS)}).flatMap((_, i) => {
    const page = (
      <li>
        <button
          type="button"
          onClick={() => {
            selectPage(pageIndex + i)
          }}
        >
          <VisuallyHidden>Page&nbsp;</VisuallyHidden>
          {pageIndex + i}
        </button>
      </li>
    )

    if (truncated && truncateIndex === i) {
      return [<li role="presentation">…</li>, page]
    }

    return page
  })

  return (
    <nav aria-label={label}>
      <p>
        {start}
        <VisuallyHidden>&nbsp;through&nbsp;</VisuallyHidden>
        <span aria-hidden="true">‒</span>
        {end} of {totalItems}
      </p>
      <ol>
        <li>
          <button
            type="button"
            onClick={() => {
              selectPage(0)
            }}
          >
            First<VisuallyHidden>&nbsp;page</VisuallyHidden>
          </button>
        </li>
        <li>
          <button type="button" onClick={selectPreviousPage} disabled={!hasPreviousPage}>
            Previous<VisuallyHidden>&nbsp;page</VisuallyHidden>
          </button>
        </li>
        <li>
          <button type="button" onClick={selectNextPage} disabled={!hasNextPage}>
            Next<VisuallyHidden>&nbsp;page</VisuallyHidden>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              selectPage(pageCount - 1)
            }}
          >
            Last<VisuallyHidden>&nbsp;page</VisuallyHidden>
          </button>
        </li>
      </ol>
    </nav>
  )
}
