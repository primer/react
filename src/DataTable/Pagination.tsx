import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {Button} from '../internal/components/ButtonReset'
import {LiveRegion, LiveRegionOutlet, Message} from '../internal/components/LiveRegion'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'
import {warning} from '../utils/warning'
import {ResponsiveValue, viewportRanges} from '../hooks/useResponsiveValue'

const StyledPagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1rem;
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
    align-items: center;
    flex-wrap: wrap;
    list-style: none;
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

  .TablePaginationTruncationStep {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    min-height: 2rem;
    user-select: none;
  }

  ${
    // Hides pages based on the viewport range passed to `showPages`
    Object.keys(viewportRanges)
      .map(viewportRangeKey => {
        return `
      @media (${viewportRanges[viewportRangeKey as keyof typeof viewportRanges]}) {
        .TablePaginationSteps[data-hidden-viewport-ranges*='${viewportRangeKey}'] > *:not(:first-child):not(:last-child) {
          display: none;
        }

        .TablePaginationSteps[data-hidden-viewport-ranges*='${viewportRangeKey}'] > *:first-child {
          margin-inline-end: 0;
        }
        
        .TablePaginationSteps[data-hidden-viewport-ranges*='${viewportRangeKey}'] > *:last-child {
          margin-inline-start: 0;
        }
      }
    `
      })
      .join('')
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
   * Whether to show the page numbers
   */
  showPages?: boolean | ResponsiveValue<boolean>

  /**
   * Specify the total number of items within the collection
   */
  totalCount: number
}

/**
 * Specifies the maximum number of items in between the first and last page,
 * including truncated steps
 */
const MAX_TRUNCATED_STEP_COUNT = 7

export function Pagination({
  'aria-label': label,
  defaultPageIndex,
  id,
  onChange,
  pageSize = 25,
  showPages = {narrow: false},
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
  const truncatedPageCount = pageCount > 2 ? Math.min(pageCount - 2, MAX_TRUNCATED_STEP_COUNT) : 0
  const [offsetStartIndex, setOffsetStartIndex] = useState(() => {
    // Set the offset start index to the page at index 1 since we will have the
    // first page already visible
    if (pageIndex === 0) {
      return 1
    }
    return pageIndex
  })
  const offsetEndIndex = offsetStartIndex + truncatedPageCount - 1
  const hasLeadingTruncation = offsetStartIndex >= 2
  const hasTrailingTruncation = pageCount - 1 - offsetEndIndex > 1
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

  return (
    <LiveRegion>
      <LiveRegionOutlet />
      <StyledPagination aria-label={label} className="TablePagination" id={id}>
        <Range pageStart={pageStart} pageEnd={pageEnd} totalCount={totalCount} />
        <ol className="TablePaginationSteps" data-hidden-viewport-ranges={getViewportRangesToHidePages().join(' ')}>
          <Step>
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
          </Step>
          {pageCount > 0 ? (
            <Step>
              <Page
                active={pageIndex === 0}
                onClick={() => {
                  selectPage(0)
                  if (pageCount > 1) {
                    setOffsetStartIndex(1)
                  }
                }}
              >
                {1}
                {hasLeadingTruncation ? <VisuallyHidden>…</VisuallyHidden> : null}
              </Page>
            </Step>
          ) : null}
          {pageCount > 2
            ? Array.from({length: truncatedPageCount}).map((_, i) => {
                if (i === 0 && hasLeadingTruncation) {
                  return <TruncationStep key={`truncation-${i}`} />
                }

                if (i === truncatedPageCount - 1 && hasTrailingTruncation) {
                  return <TruncationStep key={`truncation-${i}`} />
                }

                const page = offsetStartIndex + i
                return (
                  <Step key={i}>
                    <Page
                      active={pageIndex === page}
                      onClick={() => {
                        selectPage(page)
                      }}
                    >
                      {page + 1}
                      {i === truncatedPageCount - 2 && hasTrailingTruncation ? (
                        <VisuallyHidden>…</VisuallyHidden>
                      ) : null}
                    </Page>
                  </Step>
                )
              })
            : null}
          {pageCount > 1 ? (
            <Step>
              <Page
                active={pageIndex === pageCount - 1}
                onClick={() => {
                  selectPage(pageCount - 1)
                  setOffsetStartIndex(pageCount - 1 - truncatedPageCount)
                }}
              >
                {pageCount}
              </Page>
            </Step>
          ) : null}
          <Step>
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
          </Step>
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

function TruncationStep() {
  return (
    <li aria-hidden="true" className="TablePaginationTruncationStep">
      …
    </li>
  )
}

function Step({children}: React.PropsWithChildren) {
  return <li className="TablePaginationStep">{children}</li>
}

type PageProps = React.PropsWithChildren<{
  active: boolean
  onClick: () => void
}>

function Page({active, children, onClick}: PageProps) {
  return (
    <Button
      className="TablePaginationPage"
      type="button"
      data-active={active ? true : undefined}
      aria-current={active ? true : undefined}
      onClick={onClick}
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
  const [pageIndex, setPageIndex] = useState(() => {
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
  const pageStart = pageIndex * pageSize
  const pageEnd = Math.min(pageIndex * pageSize + pageSize, totalCount - 1)
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
