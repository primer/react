import {scrollIntoViewingArea} from '../../behaviors/scrollIntoViewingArea'

function scrollPositionFormula(
  positionData: {viewingAreaEdgePosition: number; childEdgePosition: number; margin: number},
  isChildAboveViewingArea: boolean
) {
  const {viewingAreaEdgePosition, childEdgePosition, margin} = positionData
  const marginOffset = margin * (isChildAboveViewingArea ? -1 : 1)

  return childEdgePosition - viewingAreaEdgePosition + marginOffset
}

// The DOMRect constructor isn't available in JSDOM, so we improvise here.
function makeDOMRect(x: number, y: number, width: number, height: number): DOMRect {
  return {
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    toJSON() {
      return this
    }
  }
}

// Since Jest/JSDOM doesn't support layout, we can stub out getBoundingClientRect if we know the
// correct dimensions. JSDOM will handle the rest of the DOM API used by getAnchoredPosition.
function createVirtualDOM(viewingAreaRect: DOMRect, childRect: DOMRect) {
  const viewingArea = document.createElement('div')
  viewingArea.style.overflow = 'auto'
  viewingArea.id = 'viewingArea'
  // eslint-disable-next-line github/unescaped-html-literal
  viewingArea.innerHTML = '<div id="child"></div>'
  const child = viewingArea.querySelector('#child')!
  child.getBoundingClientRect = () => childRect
  viewingArea.getBoundingClientRect = () => viewingAreaRect
  return {viewingArea, child}
}

describe('scrollIntoViewingArea', () => {
  it('scrolls the expected amount when only the viewingArea element and child element are passed to the function', () => {
    const scrollToMock = jest.fn()
    Object.defineProperty(window.Element.prototype, 'scrollTo', {
      writable: true,
      value: scrollToMock
    })
    const childHeight = 50
    const viewAreaHeight = 100
    const childStart = viewAreaHeight + 10
    const expectedScrollPosition = scrollPositionFormula(
      {viewingAreaEdgePosition: viewAreaHeight, childEdgePosition: childStart + childHeight, margin: 8},
      false
    )

    const viewingAreaRect = makeDOMRect(0, 0, 100, viewAreaHeight)
    const childRect = makeDOMRect(0, childStart, 100, childHeight)
    const {viewingArea, child} = createVirtualDOM(viewingAreaRect, childRect)

    viewingArea.getBoundingClientRect = () => viewingAreaRect
    viewingArea.scrollTop = 0
    child.getBoundingClientRect = () => childRect

    scrollIntoViewingArea(child as HTMLDivElement, viewingArea)
    expect(scrollToMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: expectedScrollPosition
    })
  })

  describe('y-axis', () => {
    it('scrolls the child into the viewing area when it is AFTER the overflow cutoff point', () => {
      const scrollToMock = jest.fn()
      Object.defineProperty(window.Element.prototype, 'scrollTo', {
        writable: true,
        value: scrollToMock
      })
      const childHeight = 50
      const viewAreaHeight = 100
      const childStart = viewAreaHeight + 10
      const scrollMargin = 10
      const expectedScrollPosition = scrollPositionFormula(
        {viewingAreaEdgePosition: viewAreaHeight, childEdgePosition: childStart + childHeight, margin: scrollMargin},
        false
      )

      const viewingAreaRect = makeDOMRect(0, 0, 100, viewAreaHeight)
      const childRect = makeDOMRect(0, childStart, 100, childHeight)
      const {viewingArea, child} = createVirtualDOM(viewingAreaRect, childRect)

      viewingArea.getBoundingClientRect = () => viewingAreaRect
      viewingArea.scrollTop = 0
      child.getBoundingClientRect = () => childRect

      scrollIntoViewingArea(child as HTMLDivElement, viewingArea, 'vertical', scrollMargin, scrollMargin, 'auto')
      expect(scrollToMock).toHaveBeenCalledWith({
        behavior: 'auto',
        top: expectedScrollPosition
      })
    })

    it('scrolls the child into the viewing area when it is BEFORE the overflow cutoff point', () => {
      const scrollToMock = jest.fn()
      Object.defineProperty(window.Element.prototype, 'scrollTo', {
        writable: true,
        value: scrollToMock
      })
      const childHeight = 50
      const childStart = childHeight * -1 - 10
      const scrollMargin = 10
      const expectedScrollPosition = scrollPositionFormula(
        {viewingAreaEdgePosition: 0, childEdgePosition: childStart, margin: scrollMargin},
        true
      )

      const viewingAreaRect = makeDOMRect(0, 0, 100, 100)
      const childRect = makeDOMRect(0, childStart, 100, childHeight)
      const {viewingArea, child} = createVirtualDOM(viewingAreaRect, childRect)

      viewingArea.getBoundingClientRect = () => viewingAreaRect
      viewingArea.scrollTop = 0
      child.getBoundingClientRect = () => childRect

      scrollIntoViewingArea(child as HTMLDivElement, viewingArea, 'vertical', scrollMargin, scrollMargin, 'auto')
      expect(scrollToMock).toHaveBeenCalledWith({
        behavior: 'auto',
        top: expectedScrollPosition
      })
    })
  })

  describe('x-axis', () => {
    it('scrolls the child into the viewing area when it is AFTER the overflow cutoff point', () => {
      const scrollToMock = jest.fn()
      Object.defineProperty(window.Element.prototype, 'scrollTo', {
        writable: true,
        value: scrollToMock
      })
      const childWidth = 50
      const viewAreaWidth = 100
      const childStart = viewAreaWidth + 10
      const scrollMargin = 10
      const expectedScrollPosition = scrollPositionFormula(
        {viewingAreaEdgePosition: viewAreaWidth, childEdgePosition: childStart + childWidth, margin: scrollMargin},
        false
      )

      const viewingAreaRect = makeDOMRect(0, 0, 100, viewAreaWidth)
      const childRect = makeDOMRect(childStart, 0, childWidth, 100)
      const {viewingArea, child} = createVirtualDOM(viewingAreaRect, childRect)

      viewingArea.getBoundingClientRect = () => viewingAreaRect
      viewingArea.scrollLeft = 0
      child.getBoundingClientRect = () => childRect

      scrollIntoViewingArea(child as HTMLDivElement, viewingArea, 'horizontal', scrollMargin, scrollMargin, 'auto')
      expect(scrollToMock).toHaveBeenCalledWith({
        behavior: 'auto',
        left: expectedScrollPosition
      })
    })

    it('scrolls the child into the viewing area when it is BEFORE the overflow cutoff point', () => {
      const scrollToMock = jest.fn()
      Object.defineProperty(window.Element.prototype, 'scrollTo', {
        writable: true,
        value: scrollToMock
      })
      const childWidth = 50
      const childStart = childWidth * -1 - 10
      const scrollMargin = 10
      const expectedScrollPosition = scrollPositionFormula(
        {viewingAreaEdgePosition: 0, childEdgePosition: childStart, margin: scrollMargin},
        true
      )

      const viewingAreaRect = makeDOMRect(0, 0, 100, 100)
      const childRect = makeDOMRect(childStart, 0, childWidth, 100)
      const {viewingArea, child} = createVirtualDOM(viewingAreaRect, childRect)

      viewingArea.getBoundingClientRect = () => viewingAreaRect
      viewingArea.scrollTop = 0
      child.getBoundingClientRect = () => childRect

      scrollIntoViewingArea(child as HTMLDivElement, viewingArea, 'horizontal', scrollMargin, scrollMargin, 'auto')
      expect(scrollToMock).toHaveBeenCalledWith({
        behavior: 'auto',
        left: expectedScrollPosition
      })
    })
  })
})
