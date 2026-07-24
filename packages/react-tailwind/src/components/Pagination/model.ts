export type PageType = 'previous' | 'next' | 'page' | 'ellipsis'
export type PageModel = {
  type: PageType
  number: number
  selected?: boolean
  disabled?: boolean
  precedesBreak?: boolean
}

export function buildPaginationModel(
  pageCount: number,
  currentPage: number,
  showPages: boolean,
  marginPageCount: number,
  surroundingPageCount: number,
): PageModel[] {
  const previous: PageModel = {type: 'previous', number: currentPage - 1, disabled: currentPage <= 1}
  const next: PageModel = {type: 'next', number: currentPage + 1, disabled: currentPage >= pageCount}
  if (!showPages) return [previous, next]
  if (pageCount <= 0) return [previous, {...next, disabled: true}]

  const pages: PageModel[] = []
  const margins = Math.max(0, marginPageCount)
  const surrounding = Math.max(0, surroundingPageCount)
  const standardGap = surrounding + margins
  const maxVisiblePages = standardGap * 2 + 3

  const addPages = (start: number, end: number, precedesBreak = false) => {
    for (let page = start; page <= end; page += 1) {
      pages.push({
        type: 'page',
        number: page,
        selected: page === currentPage,
        precedesBreak: page === end && precedesBreak,
      })
    }
  }
  const addEllipsis = (previousPage: number) => pages.push({type: 'ellipsis', number: previousPage + 1})

  if (pageCount <= maxVisiblePages) {
    addPages(1, pageCount)
    return [previous, ...pages, next]
  }

  const current = Math.min(Math.max(currentPage, 1), pageCount)
  const startGap = Math.max(0, current - standardGap - 1)
  const startOffset = startGap ? 0 : current - standardGap - 2
  const endGap = Math.max(0, pageCount - current - standardGap)
  const endOffset = endGap ? 0 : pageCount - current - standardGap - 1
  const hasStartEllipsis = startGap > 0
  const hasEndEllipsis = endGap > 0

  addPages(1, margins, hasStartEllipsis)
  if (hasStartEllipsis) addEllipsis(margins)
  addPages(margins + startGap + endOffset + 1, pageCount - startOffset - endGap - margins, hasEndEllipsis)
  if (hasEndEllipsis) addEllipsis(pageCount - startOffset - endGap - margins)
  addPages(pageCount - margins + 1, pageCount)

  return [previous, ...pages, next]
}
