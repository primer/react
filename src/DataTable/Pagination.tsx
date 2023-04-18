import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {Button} from '../internal/components/ButtonReset'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'

const StyledPagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  grid-area: footer;
  padding: 0.5rem 1rem;
  border: 1px solid ${get('colors.border.default')};
  border-top-width: 0;
  border-end-start-radius: 6px;
  border-end-end-radius: 6px;

  .TablePaginationRange {
    color: ${get('colors.fg.muted')};
    font-size: 0.75rem;
    margin: 0;
  }

  .TablePaginationSteps {
    display: flex;
    list-style: none;
    align-items: center;
    color: ${get('colors.fg.default')};
    font-size: 0.875rem;
    margin: 0;
    padding: 0;
  }

  .TablePaginationStep:first-of-type {
    margin-right: 1rem;
  }

  .TablePaginationStep:last-of-type {
    margin-left: 1rem;
  }

  .TablePaginationAction {
    display: flex;
    align-items: center;
    color: ${get('colors.fg.muted')};
    font-size: 0.875rem;
    line-height: calc(20 / 14);
    user-select: none;
    padding: 0.5rem;
    border-radius: 6px;
  }

  .TablePaginationAction[data-has-page] {
    color: ${get('colors.accent.fg')};
  }

  .TablePaginationPage {
    min-width: 2rem;
    min-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    line-height: calc(20 / 14);
    user-select: none;
    border-radius: 6px;
  }

  .TablePaginationAction[data-has-page]:hover,
  .TablePaginationAction[data-has-page]:focus,
  .TablePaginationPage:hover,
  .TablePaginationPage:focus {
    background-color: ${get('colors.actionListItem.default.hoverBg')};
    transition-duration: 0.1s;
  }

  .TablePaginationPage[data-active='true'] {
    background-color: ${get('colors.accent.emphasis')};
    color: ${get('colors.fg.onEmphasis')};
  }

  .TablePaginationTruncated {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    min-height: 2rem;
    user-select: none;
  }
`

export type PaginationProps = React.ComponentPropsWithoutRef<'nav'> & {
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
   * Optionally specify the number of items within a page
   */
  pageSize?: number

  /**
   * Specify the total number of items within the collection
   */
  totalCount: number
}

const VISIBLE_PAGE_COUNT = 4

export function Pagination({
  'aria-label': label,
  defaultPageIndex,
  id,
  onChange,
  pageSize = 25,
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
  const {
    windowStartIndex,
    hasPagesBefore,
    hasPagesAfter,
    isWithinBounds,
    shiftWindowDown,
    shiftWindowUp,
    shiftStartTo,
    shiftEndTo,
  } = useWindowing({
    defaultPageIndex,
    size: VISIBLE_PAGE_COUNT,
    pageCount,
  })
  const pages = Array.from({length: VISIBLE_PAGE_COUNT}).map((_, i) => {
    const offset = windowStartIndex + i
    const active = offset === pageIndex

    return (
      <li className="TablePaginationStep" key={offset}>
        <Button
          type="button"
          className="TablePaginationPage"
          data-active={active ? true : undefined}
          onClick={() => {
            selectPage(offset)
          }}
        >
          <VisuallyHidden>Page&nbsp;</VisuallyHidden>
          {offset + 1}
        </Button>
      </li>
    )
  })

  return (
    <StyledPagination aria-label={label} className="TablePagination" id={id} tabIndex={-1}>
      <Range pageStart={pageStart} pageEnd={pageEnd} totalCount={totalCount} />
      <ul className="TablePaginationSteps">
        <li className="TablePaginationStep">
          <Button
            className="TablePaginationAction"
            type="button"
            data-has-page={hasPreviousPage ? true : undefined}
            onClick={() => {
              if (!hasPreviousPage) {
                return
              }

              selectPreviousPage()

              if (!isWithinBounds(pageIndex - 1)) {
                shiftWindowDown()
              }
            }}
          >
            {hasPreviousPage ? <ChevronLeftIcon /> : null}
            <span className="TablePaginationActionLabel">Previous</span>
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
          </Button>
        </li>
        {hasPagesBefore ? (
          <>
            <li className="TablePaginationStep">
              <Button
                type="button"
                className="TablePaginationPage"
                onClick={() => {
                  selectPage(0)
                  shiftStartTo(0)
                }}
              >
                <VisuallyHidden>Page&nbsp;</VisuallyHidden>1
              </Button>
            </li>
            <li aria-hidden="true" className="TablePaginationTruncated">
              …
            </li>
          </>
        ) : null}
        {pages}
        {hasPagesAfter ? (
          <>
            <li aria-hidden="true" className="TablePaginationTruncated">
              …
            </li>
            <li className="TablePaginationStep">
              <Button
                type="button"
                className="TablePaginationPage"
                onClick={() => {
                  selectPage(pageCount)
                  shiftEndTo(pageCount)
                }}
              >
                <VisuallyHidden>Page&nbsp;</VisuallyHidden>
                {pageCount}
              </Button>
            </li>
          </>
        ) : null}
        <li className="TablePaginationStep">
          <Button
            className="TablePaginationAction"
            type="button"
            data-has-page={hasNextPage ? true : undefined}
            onClick={() => {
              if (!hasNextPage) {
                return
              }

              selectNextPage()

              if (!isWithinBounds(pageIndex + 1)) {
                shiftWindowUp()
              }
            }}
          >
            <span className="TablePaginationActionLabel">Next</span>
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
            {hasNextPage ? <ChevronRightIcon /> : null}
          </Button>
        </li>
      </ul>
    </StyledPagination>
  )
}

type RangeProps = {
  pageStart: number
  pageEnd: number
  totalCount: number
}

function Range({pageStart, pageEnd, totalCount}: RangeProps) {
  return (
    <p className="TablePaginationRange">
      {pageStart + 1}
      <VisuallyHidden>&nbsp;through&nbsp;</VisuallyHidden>
      <span aria-hidden="true">‒</span>
      {pageEnd} of {totalCount}
    </p>
  )
}

interface PaginationState {
  /**
   * The index of currently selected page
   */
  pageIndex: number
}

interface PaginationConfig {
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

interface PaginationResult {
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
  const [pageIndex, setPageIndex] = useState(defaultPageIndex ?? 0)
  const pageCount = Math.ceil(totalCount / pageSize)
  const pageStart = pageIndex * pageSize
  const pageEnd = Math.min(pageIndex * pageSize + pageSize, totalCount - 1)
  const hasNextPage = pageIndex + 1 < pageCount
  const hasPreviousPage = pageIndex > 0

  function selectPage(pageIndex: number) {
    setPageIndex(pageIndex)
    onChange?.({pageIndex})
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

interface WindowingConfig {
  /**
   * Provide an optional index to specify the default selected page
   */
  defaultPageIndex?: number

  /**
   * Specify the size of the window
   */
  size: number

  /**
   * Specify the total number of items within the collection
   */
  pageCount: number
}

/**
 * A helper utility for "windowing"
 */
function useWindowing(config: WindowingConfig) {
  const {defaultPageIndex, size, pageCount} = config
  const [startIndex, setStartIndex] = useState(defaultPageIndex ?? 0)
  const endIndex = Math.min(startIndex + size, pageCount - 1)

  console.log('useWindowing()', startIndex, endIndex, pageCount)

  function isWithinBounds(index: number) {
    return index >= startIndex && index < endIndex
  }

  function shiftWindowUp() {
    setStartIndex(startIndex + 1)
  }

  function shiftWindowDown() {
    setStartIndex(startIndex - 1)
  }

  function shiftStartTo(index: number) {
    setStartIndex(index)
  }

  function shiftEndTo(index: number) {
    setStartIndex(index - size)
  }

  return {
    windowStartIndex: startIndex,
    windowEndIndex: endIndex,
    hasPagesBefore: startIndex > 0,
    hasPagesAfter: endIndex < pageCount - 1,
    isWithinBounds,
    shiftWindowUp,
    shiftWindowDown,
    shiftStartTo,
    shiftEndTo,
  }
}
