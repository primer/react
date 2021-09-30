export const scrollIntoViewingArea = (
    child: HTMLElement,
    container: HTMLElement,
    direction: 'horizontal' | 'vertical' = 'vertical',
    startMargin = 8,
    endMargin = 0,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    const startSide = direction === 'vertical' ? 'top' : 'left';
    const endSide = direction === 'vertical' ? 'bottom' : 'right';
    const scrollSide = direction === 'vertical' ? 'scrollTop' : 'scrollLeft';
    const {[startSide]: childStart, [endSide]: childEnd} = child.getBoundingClientRect()
    const {[startSide]: containerStart, [endSide]: containerEnd} = container.getBoundingClientRect()
  
    const isChildStartAboveViewingArea = childStart < containerStart + endMargin
    const isChildBottomBelowViewingArea = childEnd > containerEnd - startMargin
  
    if (isChildStartAboveViewingArea) {
      const scrollHeightToChildStart = childStart - containerStart + container[scrollSide]
      container.scrollTo({behavior, [startSide]: scrollHeightToChildStart - endMargin})
    } else if (isChildBottomBelowViewingArea) {
      const scrollHeightToChildBottom = childEnd - containerEnd + container[scrollSide]
      container.scrollTo({behavior, [startSide]: scrollHeightToChildBottom + startMargin})
    }
  
    // either completely in view or outside viewing area on both ends, don't scroll
}
