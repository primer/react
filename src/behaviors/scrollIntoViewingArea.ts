export const scrollIntoViewingArea = (
  child: HTMLElement,
  viewingArea: HTMLElement,
  direction: 'horizontal' | 'vertical' = 'vertical',
  startMargin = 8,
  endMargin = 0,
  behavior: ScrollBehavior = 'smooth'
) => {
  const startSide = direction === 'vertical' ? 'top' : 'left'
  const endSide = direction === 'vertical' ? 'bottom' : 'right'
  const scrollSide = direction === 'vertical' ? 'scrollTop' : 'scrollLeft'
  const {[startSide]: childStart, [endSide]: childEnd} = child.getBoundingClientRect()
  const {[startSide]: viewingAreaStart, [endSide]: viewingAreaEnd} = viewingArea.getBoundingClientRect()

  const isChildStartAboveViewingArea = childStart < viewingAreaStart + endMargin
  const isChildBottomBelowViewingArea = childEnd > viewingAreaEnd - startMargin

  if (isChildStartAboveViewingArea) {
    const scrollHeightToChildStart = childStart - viewingAreaStart + viewingArea[scrollSide]
    viewingArea.scrollTo({behavior, [startSide]: scrollHeightToChildStart - endMargin})
  } else if (isChildBottomBelowViewingArea) {
    const scrollHeightToChildBottom = childEnd - viewingAreaEnd + viewingArea[scrollSide]
    viewingArea.scrollTo({behavior, [startSide]: scrollHeightToChildBottom + startMargin})
  }

  // either completely in view or outside viewing area on both ends, don't scroll
}
