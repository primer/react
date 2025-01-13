export type PaginationState = 'noEllipsis' | 'startEllipsis' | 'endEllipsis' | 'bothEllipsis'

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

  const pages: PageType[] = []

  const standardGap = surroundingPageCount + marginPageCount

  // initialize Offset and Gap to the same values
  let startGap
  let startOffset = (startGap = currentPage - standardGap - 1)
  let endGap
  let endOffset = (endGap = pageCount - currentPage - standardGap)

  // account for when gap is less than the minimum number of pages to show
  if (startOffset <= marginPageCount) {
    startOffset -= 1
    startGap = 0
  }

  // account for when gap is less than the minimum number of pages to show
  if (endOffset <= marginPageCount) {
    endOffset -= 1
    endGap = 0
  }

  // Display the ellipsis at the start of the list of pages if the current page is further away
  // than surroundingPageCount + marginPageCount from the first page.
  // NOTE: we expand ellipses that collapse only one page later on.

  // Example:
  // surroundingPageCount: 2
  // marginPageCount: 1
  // [1, ..., 3, 4, _5_, 6, 7]
  const hasStartEllipsis = startGap > 0

  // Display the ellipsis at the end of the list of pages if the current page is further away
  // than surroundingPageCount - marginPageCount from the last page.
  // NOTE: we expand ellipses that collapse only one page later on

  // Example:
  // surroundingPageCount: 2
  // marginPageCount: 1
  // [1, ..., 9, 10, _11_, 12, 13, ..., 15]
  const hasEndEllipsis = endGap > 0

  // TODO: remove console.log({endGap, pageCount, startOffset, standardGap, endOffset, startGap})

  // add pages "before" the start ellipsis (if any)
  addPages(1, marginPageCount, true)

  if (hasStartEllipsis) {
    // To keep the number of pages shown consistent, add the middleWindowCount
    // and marginPageCount instead of overlapping them.

    // middleWindowCount: 5
    // marginPageCount: 1
    // [1, ..., 9, 10, _11_, 12, 13, 14, 15]
    // [1, ..., 9, 10, 11, _12_, 13, 14, 15]
    // [1, ..., 9, 10, 11, 12, _13_, 14, 15]
    // [1, ..., 9, 10, 11, 12, 13, _14_, 15]
    // [1, ..., 9, 10, 11, 12, 13, 14, _15_]

    addEllipsis(marginPageCount)
  }

  // add middle pages
  addPages(
    marginPageCount + startGap + Math.min(endOffset, 0) + 1,
    pageCount - Math.min(startOffset, 0) - endGap - marginPageCount,
    hasEndEllipsis,
  )

  if (hasEndEllipsis) {
    // To keep the number of pages shown consistent, add the middleWindowCount
    // and marginPageCount instead of overlapping them.

    // middleWindowCount: 5
    // marginPageCount: 1
    // [1, 2, 3, 4, _5_, 6, 7, ..., 15]
    // [1, 2, 3, _4_, 5, 6, 7, ..., 15]
    // [1, 2, _3_, 4, 5, 6, 7, ..., 15]
    // [1, _2_, 3, 4, 5, 6, 7, ..., 15]
    // [_1_, 2, 3, 4, 5, 6, 7, ..., 15]

    addEllipsis(pageCount - Math.min(startOffset, 0) - endGap - marginPageCount)
  }

  // add pages "after" the start ellipsis (if any)
  addPages(pageCount - marginPageCount + 1, pageCount)

  // TODO: remove console.log([prev, ...pages, next])

  return [prev, ...pages, next]

  function addEllipsis(previousPage: number): void {
    pages.push({
      type: 'BREAK',
      num: previousPage + 1,
    })
  }

  function addPages(start: number, end: number, precedesBreak: boolean = false): void {
    // TODO: remove console.log('add pages', start, end)
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

export function buildComponentData(
  page: PageType,
  hrefBuilder: (n: number) => string,
  onClick: (e: React.MouseEvent) => void,
) {
  const props = {}
  let content = ''
  let key = ''

  switch (page.type) {
    case 'PREV': {
      key = 'page-prev'
      content = 'Previous'
      if (page.disabled) {
        Object.assign(props, {rel: 'prev', 'aria-hidden': 'true'})
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
        Object.assign(props, {rel: 'next', 'aria-hidden': 'true'})
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
