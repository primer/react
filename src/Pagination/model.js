const DEBUG = false

const debug = (...args) => {
  if (DEBUG) console.log(...args)
}

class Range {
  constructor(start, end) {
    if (start > end) {
      throw new Error('Range start must be less than or equal to end')
    }

    this.start = start
    this.end = end
  }

  includes(n) {
    return n >= this.start && n <= this.end
  }

  count() {
    return this.end - this.start + 1
  }

  toArray() {
    const arr = []
    for (let i = this.start; i <= this.end; i++) {
      arr.push(i)
    }
    return arr
  }
}

export function buildPaginationModel(pageCount, currentPage, showPages, marginPageCount, surroundingPageCount) {
  const pages = []
  const pageRange = new Range(1, pageCount)

  const prev = {type: 'PREV', num: currentPage - 1, disabled: currentPage === 1}

  if (showPages) {
    const pageNums = new Set()
    const addPage = n => (pageRange.includes(n) ? pageNums.add(n) : null)
    // const marginLeft = new Range(0, marginPageCount)
    // const marginRight = new Range(pageCount + 1 - marginPageCount, pageCount + 1)
    for (let i = 1; i <= marginPageCount; i++) {
      addPage(i)
      addPage(pageCount - (i - 1))
    }
    debug([...pageNums.values()])

    const centerLeft = currentPage - surroundingPageCount
    const centerRight = currentPage + surroundingPageCount
    debug('left & right', centerLeft, centerRight)
    let overflow = 0
    for (let i = currentPage - 1; i >= centerLeft; i--) {
      console.log('checking left', i)
      if (!pageRange.includes(i)) {
        console.log('trying to add page', i, 'but it is alrady there')
        // the page to the left of center is already shown or out of bounds
        // make up for it to the right
        const diff = currentPage - i
        overflow++
        console.log('adding', centerRight + overflow, ' instead:', centerRight, overflow)
        addPage(centerRight + overflow)
      } else {
        addPage(i)
      }
    }
    overflow = 0
    for (let i = currentPage + 1; i <= centerRight; i++) {
      debug('checking right', i)
      if (!pageRange.includes(i)) {
        // the page to the right of center is already shown or out of bounds
        // make up for it to the left
        overflow++
        const diff = i - centerRight
        addPage(centerLeft - overflow)
      } else {
        addPage(i)
      }
    }
    addPage(currentPage)

    // // If we only skipped one page between the margin and center,
    // // then just render that page instead of rendering a break
    // const leftOfCenter = centerLeft - 1
    // const rightOfCenter = centerRight + 1
    // if (pageNums.has(leftOfCenter - 1)) {
    //   addPage(leftOfCenter)
    // }
    // if (pageNums.has(rightOfCenter + 1)) {
    //   addPage(rightOfCenter)
    // }

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
          // } else if (delta === 2) {
          //   // We skipped one number;
          //   // render it instead of a break
          //   pages.push({
          //     type: 'NUM',
          //     num: num - 1,
          //     selected
          //   })
          //   pages.push({
          //     type: 'NUM',
          //     num,
          //     selected
          //   })
        } else {
          // We skipped more than one;
          // render a break
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
  const next = {type: 'NEXT', num: currentPage + 1, disabled: currentPage === pageCount}

  return [prev, ...pages, next]
}
