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

  // The number of pages shown in the middle window; the current page is always in the middle
  // and we show surroundingPageCount pages on either side
  const middleWindowCount = surroundingPageCount + 1 + surroundingPageCount

  // The total number of pages shown including the margin pages
  const totalPagesShown = marginPageCount + middleWindowCount + marginPageCount

  // Only needs ellipsis if there are more pages than we can display
  const needEllipsis = pageCount > totalPagesShown

  // Display the ellipsis at the start of the list of pages if the current page is further away
  // than surroundingPageCount + marginPageCount from the first page.
  // NOTE: we expand ellipses that collapse only one page later on.

  // Example:
  // surroundingPageCount: 2
  // marginPageCount: 1
  // [1, ..., 3, 4, _5_, 6, 7]
  const hasStartEllipsis = currentPage > surroundingPageCount + marginPageCount + 1

  // Display the ellipsis at the end of the list of pages if the current page is further away
  // than surroundingPageCount - marginPageCount from the last page.
  // NOTE: we expand ellipses that collapse only one page later on

  // Example:
  // surroundingPageCount: 2
  // marginPageCount: 1
  // [1, ..., 9, 10, _11_, 12, 13, ..., 15]
  const hasEndEllipsis = currentPage < pageCount - surroundingPageCount - marginPageCount

  let state: PaginationState = 'noEllipsis'
  if (needEllipsis) {
    if (hasStartEllipsis && hasEndEllipsis) {
      state = 'bothEllipsis'
    } else if (hasStartEllipsis) {
      state = 'startEllipsis'
    } else if (hasEndEllipsis) {
      state = 'endEllipsis'
    }
  }

  const pages: PageType[] = []

  switch (state) {
    case 'noEllipsis': {
      // [1, 2, 3, 4]
      addPages(1, pageCount)
      break
    }
    case 'startEllipsis': {
      addPages(1, marginPageCount, true)
      // To keep the number of pages shown consistent, add the middleWindowCount
      // and marginPageCount instead of overlapping them.

      // middleWindowCount: 5
      // marginPageCount: 1
      // [1, ..., 9, 10, _11_, 12, 13, 14, 15]
      // [1, ..., 9, 10, 11, _12_, 13, 14, 15]
      // [1, ..., 9, 10, 11, 12, _13_, 14, 15]
      // [1, ..., 9, 10, 11, 12, 13, _14_, 15]
      // [1, ..., 9, 10, 11, 12, 13, 14, _15_]

      addEllipsis(marginPageCount, pageCount - middleWindowCount - marginPageCount)

      addPages(pageCount - middleWindowCount - marginPageCount, pageCount)
      break
    }
    case 'endEllipsis': {
      // To keep the number of pages shown consistent, add the middleWindowCount
      // and marginPageCount instead of overlapping them.

      // middleWindowCount: 5
      // marginPageCount: 1
      // [1, 2, 3, 4, _5_, 6, 7, ..., 15]
      // [1, 2, 3, _4_, 5, 6, 7, ..., 15]
      // [1, 2, _3_, 4, 5, 6, 7, ..., 15]
      // [1, _2_, 3, 4, 5, 6, 7, ..., 15]
      // [_1_, 2, 3, 4, 5, 6, 7, ..., 15]

      addPages(1, middleWindowCount + marginPageCount + 1, true)

      addEllipsis(middleWindowCount + marginPageCount + 1, pageCount - marginPageCount + 1)

      addPages(pageCount - marginPageCount + 1, pageCount)
      break
    }
    case 'bothEllipsis': {
      // There is no window overlap in this case, it will always have this shape:
      // middleWindowCount: 5
      // marginPageCount: 1
      // [1, ..., 4, 5, 6, _7_, 8, 9, ..., 15]

      addPages(1, marginPageCount, true)

      addEllipsis(marginPageCount, currentPage - surroundingPageCount)

      addPages(currentPage - surroundingPageCount, currentPage + surroundingPageCount, true)

      addEllipsis(currentPage + surroundingPageCount, pageCount - marginPageCount + 1)

      addPages(pageCount - marginPageCount + 1, pageCount)
      break
    }
  }

  return [prev, ...pages, next]

  function addEllipsis(previousPage: number, nextPage: number): void {
    // If there's only one page between the previous and next page, we don't need an ellipsis
    // as it will take the same visual space as the page.

    // Example:
    // surroundingPageCount: 2
    // marginPageCount: 1
    // [1, 2, 3, 4, _5_, 6, 7]  <- no ellipsis, we render page 2 instead.
    if (previousPage + 2 === nextPage) {
      pages.push({
        type: 'NUM',
        num: previousPage + 1,
        selected: previousPage + 1 === currentPage,
        precedesBreak: false,
      })
    } else {
      pages.push({
        type: 'BREAK',
        num: previousPage + 1,
      })
    }
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
