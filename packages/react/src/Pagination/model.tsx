export function buildPaginationModel(
  pageCount: number,
  currentPage: number,
  showPages: boolean,
  marginPageCount: number,
  surroundingPageCount: number,
) {
  const prev: PageType = {type: 'PREV', num: currentPage - 1, disabled: currentPage === 1}
  const next: PageType = {type: 'NEXT', num: currentPage + 1, disabled: currentPage === pageCount}
  if (!showPages) {
    return [prev, next]
  }

  if (pageCount <= 0) {
    return [prev, {...next, disabled: true}]
  }

  const pages: PageType[] = []

  // number of pages shown on each side of the current page
  // [1, ..., 7, 8, _9_, 10, 11, ..., 15]
  // standardGap: 3
  const standardGap = surroundingPageCount + marginPageCount

  // the maximum number of pages that can be shown at a given time (account for current page, left and right ellipsis)
  // [1, ..., 7, 8, _9_, 10, 11, ..., 15]
  // maxVisiblePages: 9
  const maxVisiblePages = standardGap + standardGap + 3

  // if the number of pages is less than the maximum number of pages that can be shown just return all of them
  if (pageCount <= maxVisiblePages) {
    addPages(1, pageCount, false)
    return [prev, ...pages, next]
  }

  // startGap is the number of pages hidden by the start ellipsis
  // startOffset is the number of pages to offset at the start to compensate
  // [1, ..., 7, 8, _9_, 10, 11, ..., 15]
  // startGap: 5
  // startOffset: 0
  // when the margin and the surrounding windows overlap.
  // [1, _2_, 3, 4, 5, 6, ..., 15]
  // startGap = 0
  // startOffset: -3 <--
  let startGap = 0
  let startOffset = 0

  // When there is overlap
  if (currentPage - standardGap - 1 <= 1) {
    startOffset = currentPage - standardGap - 2
  } else {
    startGap = currentPage - standardGap - 1
  }

  // These are equivalent to startGap and startOffset but at the end of the list
  let endGap = 0
  let endOffset = 0

  // When there is overlap
  if (pageCount - currentPage - standardGap <= 1) {
    endOffset = pageCount - currentPage - standardGap - 1
  } else {
    endGap = pageCount - currentPage - standardGap
  }

  const hasStartEllipsis = startGap > 0
  const hasEndEllipsis = endGap > 0

  // add pages "before" the start ellipsis (if any)
  // [1, ..., 7, 8, _9_, 10, 11, ..., 15]
  // marginPageCount: 1
  // addPages(1, 1, true)
  addPages(1, marginPageCount, hasStartEllipsis)

  if (hasStartEllipsis) {
    addEllipsis(marginPageCount)
  }

  // add middle pages
  // [1, ..., 7, 8, _9_, 10, 11, ..., 15]
  // marginPageCount: 1
  // surroundingPageCount: 2
  // startGap: 5
  // startOffset: 0
  // endGap: 3
  // endOffset: 0
  // addPages(7, 11, true)
  addPages(
    marginPageCount + startGap + endOffset + 1,
    pageCount - startOffset - endGap - marginPageCount,
    hasEndEllipsis,
  )

  if (hasEndEllipsis) {
    addEllipsis(pageCount - startOffset - endGap - marginPageCount)
  }

  // add pages "after" the start ellipsis (if any)
  // [1, ..., 7, 8, _9_, 10, 11, ..., 15]
  // marginPageCount: 1
  // surroundingPageCount: 2
  // startGap: 5
  // startOffset: 0
  // endGap: 3
  // endOffset: 0
  // addPages(15, 15)
  addPages(pageCount - marginPageCount + 1, pageCount)

  return [prev, ...pages, next]

  function addEllipsis(previousPage: number): void {
    pages.push({
      type: 'BREAK',
      num: previousPage + 1,
    })
  }

  function addPages(start: number, end: number, precedesBreak: boolean = false): void {
    for (let i = start; i <= end; i++) {
      pages.push({
        type: 'NUM',
        num: i,
        selected: i === currentPage,
        precedesBreak: i === end && precedesBreak,
      })
    }
  }
}

type PageType = {
  type: string
  num: number
  disabled?: boolean
  selected?: boolean
  precedesBreak?: boolean
}

export type PageDataProps = {
  props: {
    href?: string
    rel?: string
    'aria-label'?: string
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
    'aria-hidden'?: boolean
    'aria-disabled'?: boolean
    onClick?: (e: React.MouseEvent) => void
    as?: string
    role?: string
  }
  key: string
  content: string
}

export function buildComponentData(
  page: PageType,
  hrefBuilder: (n: number) => string,
  onClick: (e: React.MouseEvent) => void,
): PageDataProps {
  const props = {}
  let content = ''
  let key = ''

  switch (page.type) {
    case 'PREV': {
      key = 'page-prev'
      content = 'Previous'
      if (page.disabled) {
        Object.assign(props, {rel: 'prev', 'aria-hidden': 'true', 'aria-disabled': 'true'})
      } else {
        Object.assign(props, {
          rel: 'prev',
          href: hrefBuilder(page.num),
          'aria-label': 'Previous Page',
          onClick,
        })
      }
      break
    }
    case 'NEXT': {
      key = 'page-next'
      content = 'Next'
      if (page.disabled) {
        Object.assign(props, {rel: 'next', 'aria-hidden': 'true', 'aria-disabled': 'true'})
      } else {
        Object.assign(props, {
          rel: 'next',
          href: hrefBuilder(page.num),
          'aria-label': 'Next Page',
          onClick,
        })
      }
      break
    }
    case 'NUM': {
      key = `page-${page.num}`
      content = String(page.num)
      Object.assign(props, {
        href: hrefBuilder(page.num),
        // We append "..." to the aria-label for pages that preceed a break because screen readers will
        // change the tone the text is read in.
        // This is a slightly nicer experience than skipping a bunch of numbers unexpectedly.
        'aria-label': `Page ${page.num}${page.precedesBreak ? '...' : ''}`,
        onClick,
        'aria-current': page.selected ? 'page' : undefined,
      })
      break
    }
    case 'BREAK': {
      key = `page-${page.num}-break`
      content = '…'
      Object.assign(props, {as: 'span', role: 'presentation'})
    }
  }

  return {props, key, content}
}
