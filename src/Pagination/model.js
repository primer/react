const DEBUG = false

const debug = (...args) => {
  if (DEBUG) console.log(...args)
}

export function buildPaginationModel(pageCount, currentPage, showPages, marginPageCount, surroundingPageCount) {
  const pages = []

  if (showPages) {
    const pageNums = new Set()
    const addPage = n => {
      if (n >= 1 && n <= pageCount) {
        pageNums.add(n)
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

    const sorted = [...pageNums.values()].sort((a, b) => a - b)
    debug('sorted', sorted)
    for (const [idx, num] of sorted.entries()) {
      const selected = num === currentPage
      if (idx === 0) {
        pages.push({
          type: 'NUM',
          num,
          selected
        })
      } else {
        const last = sorted[idx - 1]
        const delta = num - last
        if (delta === 1) {
          pages.push({
            type: 'NUM',
            num,
            selected
          })
        } else {
          // We skipped some, so add a break
          pages.push({
            type: 'BREAK',
            num: num - 1
          })
          pages.push({
            type: 'NUM',
            num,
            selected
          })
        }
      }
    }
  }

  debug(pages)
  const prev = {type: 'PREV', num: currentPage - 1, disabled: currentPage === 1}
  const next = {type: 'NEXT', num: currentPage + 1, disabled: currentPage === pageCount}
  return [prev, ...pages, next]
}
