import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {Button} from '../internal/components/ButtonReset'
import {Message} from '../internal/components/LiveRegion'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'
import {LiveRegion, LiveRegionOutlet, useLiveRegion} from '../internal/components/LiveRegion'

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
   * Optionally specify the number of items within a page
   */
  pageSize?: number

  /**
   * Specify the total number of items within the collection
   */
  totalCount: number
}

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
  const totalPageCount = pageCount > 2 ? Math.min(pageCount - 2, 7) : 0
  const [offsetStartIndex, setOffsetStartIndex] = useState(() => {
    if (pageIndex === 0) {
      return 1
    }
    return pageIndex
  })
  const offsetEndIndex = offsetStartIndex + totalPageCount - 1
  const hasLeadingTruncation = offsetStartIndex >= 2
  const hasTrailingTruncation = pageCount - 1 - offsetEndIndex > 1

  return (
    <LiveRegion>
      <LiveRegionOutlet />
      <StyledPagination aria-label={label} className="TablePagination" id={id} tabIndex={-1}>
        <Range pageStart={pageStart} pageEnd={pageEnd} totalCount={totalCount} />
        <ol className="TablePaginationSteps">
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
                if (hasLeadingTruncation) {
                  if (pageIndex - 1 < offsetStartIndex + 1) {
                    setOffsetStartIndex(offsetStartIndex - 1)
                  }
                }
              }}
            >
              {hasPreviousPage ? <ChevronLeftIcon /> : null}
              <span className="TablePaginationActionLabel">Previous</span>
              <VisuallyHidden>&nbsp;page</VisuallyHidden>
            </Button>
          </li>
          {pageCount > 0 ? (
            <li className="TablePaginationStep">
              <Button
                className="TablePaginationPage"
                type="button"
                data-active={pageIndex === 0 ? true : undefined}
                aria-current={pageIndex === 0 ? true : undefined}
                onClick={() => {
                  selectPage(0)
                  if (pageCount > 1) {
                    setOffsetStartIndex(1)
                  }
                }}
              >
                {1}
              </Button>
            </li>
          ) : null}
          {pageCount > 2
            ? Array.from({length: totalPageCount}).map((_, i) => {
                if (i === 0 && hasLeadingTruncation) {
                  return (
                    <li aria-hidden="true" className="TablePaginationTruncated" key={`truncation-${i}`}>
                      …
                    </li>
                  )
                }

                if (i === totalPageCount - 1 && hasTrailingTruncation) {
                  return (
                    <li aria-hidden="true" className="TablePaginationTruncated" key={`truncation-${i}`}>
                      …
                    </li>
                  )
                }

                const page = offsetStartIndex + i
                return (
                  <li className="TablePaginationStep" key={i}>
                    <Button
                      className="TablePaginationPage"
                      type="button"
                      data-active={pageIndex === page ? true : undefined}
                      aria-current={pageIndex === page ? true : undefined}
                      onClick={() => {
                        selectPage(page)
                      }}
                    >
                      {page + 1}
                    </Button>
                  </li>
                )
              })
            : null}
          {pageCount > 1 ? (
            <li className="TablePaginationStep">
              <Button
                className="TablePaginationPage"
                type="button"
                data-active={pageIndex === pageCount - 1 ? true : undefined}
                aria-current={pageIndex === pageCount - 1 ? true : undefined}
                onClick={() => {
                  selectPage(pageCount - 1)
                  setOffsetStartIndex(pageCount - 1 - totalPageCount)
                }}
              >
                {pageCount}
              </Button>
            </li>
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
                if (hasTrailingTruncation) {
                  if (pageIndex + 1 > offsetEndIndex - 1) {
                    setOffsetStartIndex(offsetStartIndex + 1)
                  }
                }
              }}
            >
              <span className="TablePaginationActionLabel">Next</span>
              <VisuallyHidden>&nbsp;page</VisuallyHidden>
              {hasNextPage ? <ChevronRightIcon /> : null}
            </Button>
          </li>
        </ol>
      </StyledPagination>
    </LiveRegion>
  )
}

type RangeProps = {
  pageStart: number
  pageEnd: number
  totalCount: number
}

function Range({pageStart, pageEnd, totalCount}: RangeProps) {
  const start = pageStart + 1
  const end = pageEnd === totalCount - 1 ? totalCount : pageEnd
  return (
    <>
      <Message value={`Showing ${start} through ${end} of ${totalCount}`} />
      <p className="TablePaginationRange">
        {start}
        <VisuallyHidden as="span">&nbsp;through&nbsp;</VisuallyHidden>
        <span aria-hidden="true">‒</span>
        {end} of {totalCount}
      </p>
    </>
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
