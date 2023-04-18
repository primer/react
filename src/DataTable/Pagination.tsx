import {useState} from 'react'
import {warning} from '../utils/warning'
import {useId} from '../hooks/useId'
import VisuallyHidden from '../_VisuallyHidden'
import Box from '../Box'
import styled from 'styled-components'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {get} from '../constants'

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
      warning(true, 'usePagination() expects `selectNextPage` to be called only when a next page is available.')
    }
  }

  function selectPreviousPage() {
    if (hasPreviousPage) {
      selectPage(pageIndex - 1)
    } else {
      warning(true, 'usePagination() expects `selectPreviousPage` to be called only when a previous page is available.')
    }
  }

  return {
    rangeStart: pageIndex * pageSize + 1,
    rangeEnd: Math.min(pageIndex * pageSize + pageSize, totalItems),
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

export function Pagination({defaultPageIndex, id, label, onChange, pageSize, totalItems}: PaginationProps) {
  const {
    pageIndex,
    rangeStart,
    rangeEnd,
    pageCount,
    hasPreviousPage,
    hasNextPage,
    selectPage,
    selectNextPage,
    selectPreviousPage,
  } = usePagination({
    defaultPageIndex,
    pageSize,
    totalItems,
    onChange,
  })

  const windowSize = 4
  const [windowStart, setWindowStart] = useState(0)
  const [windowEnd, setWindowEnd] = useState(() => {
    return Math.min(windowStart + windowSize, totalItems - 1)
  })
  const visibleSize = windowEnd - windowStart

  const pages = Array.from({length: visibleSize}).map((_, i) => {
    const offset = windowStart + i
    const active = offset === pageIndex
    const page = (
      <Box
        as="li"
        key={i}
        sx={
          active
            ? {
                backgroundColor: 'accent.emphasis',
                color: 'fg.onEmphasis',
                borderRadius: '6px',
              }
            : {}
        }
      >
        <Box
          as={Button}
          sx={{
            minWidth: '2rem',
            minHeight: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          type="button"
          onClick={() => {
            selectPage(offset)
          }}
        >
          <VisuallyHidden>Page&nbsp;</VisuallyHidden>
          {offset + 1}
        </Box>
      </Box>
    )

    return page
  })

  return (
    <Box
      as="nav"
      aria-label={label}
      className="TablePagination"
      id={id}
      tabIndex={-1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gridArea: 'footer',
        padding: '0.5rem 1rem',
        borderLeft: '1px solid',
        borderLeftColor: 'border.default',
        borderBottom: '1px solid',
        borderBottomColor: 'border.default',
        borderRight: '1px solid',
        borderRightColor: 'border.default',
        borderEndStartRadius: 6,
        borderEndEndRadius: 6,
      }}
    >
      <Box as="p" sx={{color: 'fg.muted', fontSize: '0.75rem', margin: 0}}>
        {rangeStart}
        <VisuallyHidden>&nbsp;through&nbsp;</VisuallyHidden>
        <span aria-hidden="true">‒</span>
        {rangeEnd} of {totalItems}
      </Box>
      <Box sx={{display: 'flex', listStyle: 'none', alignItems: 'center', color: 'fg.default', fontSize: '0.875rem'}}>
        <Box
          as="li"
          sx={{
            color: hasPreviousPage ? 'accent.fg' : 'fg.muted',
            marginInlineEnd: '1rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            type="button"
            onClick={() => {
              if (!hasPreviousPage) {
                return
              }

              selectPreviousPage()

              if (pageIndex - 1 < windowStart) {
                setWindowStart(windowStart - 1)
                setWindowEnd(windowEnd - 1)
              }
            }}
          >
            {hasPreviousPage ? <ChevronLeftIcon /> : null}
            <Box as="span" sx={{lineHeight: 'calc(20 / 14)'}}>
              Previous
            </Box>
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
          </Button>
        </Box>
        {pages}
        <Box as="li" sx={{color: hasNextPage ? 'accent.fg' : 'fg.muted', marginInlineStart: '1rem'}}>
          <Button
            type="button"
            onClick={() => {
              if (!hasNextPage) {
                return
              }

              selectNextPage()

              if (pageIndex + 1 >= windowEnd) {
                setWindowStart(windowStart + 1)
                setWindowEnd(windowEnd + 1)
              }
            }}
          >
            <Box as="span" sx={{lineHeight: 'calc(20 / 14)'}}>
              Next
            </Box>
            <VisuallyHidden>&nbsp;page</VisuallyHidden>
            {hasNextPage ? <ChevronRightIcon /> : null}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

// Button "reset" component that provides an unstyled <button> element for use
// in the table
const Button = styled.button`
  padding: 0;
  border: 0;
  margin: 0;
  display: inline-flex;
  padding: 0;
  border: 0;
  appearance: none;
  background: none;
  cursor: pointer;
  text-align: start;
  font: inherit;
  color: inherit;
  column-gap: 0.25rem;
  align-items: center;
  &::-moz-focus-inner {
    border: 0;
  }
`
