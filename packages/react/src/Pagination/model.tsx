export function buildPaginationModel(
  pageCount: number,
  currentPage: number,
  showPages: boolean,
  marginPageCount: number,
  surroundingPageCount: number,
) {
  const pages = []

  if (showPages) {
    const pageNums: Array<number> = []
    const addPage = (n: number) => {
      if (n >= 1 && n <= pageCount) {
        pageNums.push(n)
      }
    }

    // Start by defining the window of pages to show around the current page.
    // If the window goes off either edge, shift it until it fits.
    let extentLeft = currentPage - surroundingPageCount
    let extentRight = currentPage + surroundingPageCount
    if (extentLeft < 1 && extentRight > pageCount) {
      // Our window is larger than the entire range,
      // so simply display every page.
      extentLeft = 1
      extentRight = pageCount
    } else if (extentLeft < 1) {
      while (extentLeft < 1) {
        extentLeft++
        extentRight++
      }
    } else if (extentRight > pageCount) {
      while (extentRight > pageCount) {
        extentLeft--
        extentRight--
      }
    }

    // Next, include the pages in the margins.
    // If a margin page is already covered in the window,
    // extend the window to the other direction.
    for (let i = 1; i <= marginPageCount; i++) {
      const leftPage = i
      const rightPage = pageCount - (i - 1)
      if (leftPage >= extentLeft) {
        extentRight++
      } else {
        addPage(leftPage)
      }
      if (rightPage <= extentRight) {
        extentLeft--
      } else {
        addPage(rightPage)
      }
    }

    for (let i = extentLeft; i <= extentRight; i++) {
      addPage(i)
    }

    const sorted = pageNums
      .slice()
      .sort((a, b) => a - b)
      .filter((item, idx, ary) => !idx || item !== ary[idx - 1])
    for (let idx = 0; idx < sorted.length; idx++) {
      const num = sorted[idx]
      const selected = num === currentPage
      const last = sorted[idx - 1]
      const next = sorted[idx + 1]
      const lastDelta = num - last
      const nextDelta = num - next
      const precedesBreak = nextDelta !== -1

      if (idx === 0) {
        if (num !== 1) {
          // If the first page isn't page one,
          // we need to add a break
          pages.push({
            type: 'BREAK',
            num: 1,
          })
        }
        pages.push({
          type: 'NUM',
          num,
          selected,
          precedesBreak,
        })
      } else {
        if (lastDelta === 1) {
          pages.push({
            type: 'NUM',
            num,
            selected,
            precedesBreak,
          })
        } else {
          // We skipped some, so add a break
          pages.push({
            type: 'BREAK',
            num: num - 1,
          })
          pages.push({
            type: 'NUM',
            num,
            selected,
            precedesBreak: false,
          })
        }
      }
    }

    const lastPage = pages[pages.length - 1]
    if (lastPage.type === 'NUM' && lastPage.num !== pageCount) {
      // The last page we rendered wasn't the actual last page,
      // so we need an additional break
      pages.push({
        type: 'BREAK',
        num: pageCount,
      })
    }
  }

  const prev = {type: 'PREV', num: currentPage - 1, disabled: currentPage === 1}
  const next = {type: 'NEXT', num: currentPage + 1, disabled: currentPage === pageCount}
  return [prev, ...pages, next]
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
        Object.assign(props, {'aria-disabled': 'true', role: 'link'})
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
        Object.assign(props, {'aria-disabled': 'true', role: 'link'})
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
