/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {getAnchoredPosition, PositionSettings} from '../../behaviors/anchoredPosition'

/*

Note: In each test below, we check the calculation from getAnchoredPosition against exact
values. For each `expect` call, there is an accompanying comment that distills the effective
calculation from the inputs, which may help debugging in the event of a test failure.

*/

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
function createVirtualDOM(
  parentRect: DOMRect,
  anchorRect: DOMRect,
  floatingRect: DOMRect,
  parentBorders: {top: number; right: number; bottom: number; left: number} = {top: 0, right: 0, bottom: 0, left: 0}
) {
  const parent = document.createElement('div')
  parent.style.position = 'relative'
  parent.style.borderTopWidth = parentBorders.top + 'px'
  parent.style.borderRightWidth = parentBorders.right + 'px'
  parent.style.borderBottomWidth = parentBorders.bottom + 'px'
  parent.style.borderLeftWidth = parentBorders.left + 'px'
  parent.id = 'parent'
  parent.innerHTML = `<div id="float"></div><div id="anchor"></div>`
  const float = parent.querySelector('#float')!
  const anchor = parent.querySelector('#anchor')!
  anchor.getBoundingClientRect = () => anchorRect
  parent.getBoundingClientRect = () => parentRect
  float.getBoundingClientRect = () => floatingRect
  return {float, parent, anchor}
}

describe('getAnchoredPosition', () => {
  it('returns the correct position in the default case with no overflow', () => {
    const parentElement = makeDOMRect(20, 20, 500, 500)
    const anchorElement = makeDOMRect(300, 200, 50, 50)
    const floatingElement = makeDOMRect(-9999, -9999, 100, 100)
    const {float, anchor} = createVirtualDOM(parentElement, anchorElement, floatingElement)
    const settings: Partial<PositionSettings> = {anchorOffset: 4}

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(234)
    expect(left).toEqual(280)
  })

  it('returns the correct position for different outside side settings with no overflow', () => {
    const parentElement = makeDOMRect(20, 20, 500, 500)
    const anchorElement = makeDOMRect(300, 200, 50, 50)
    const floatingElement = makeDOMRect(-9999, -9999, 100, 100)
    const {float, anchor} = createVirtualDOM(parentElement, anchorElement, floatingElement)
    const settings: Partial<PositionSettings> = {}
    let top = 0
    let left = 0

    // should be the same calculation as the default settings test above
    settings.side = 'outside-bottom'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(234) // anchorElement.top + anchorElement.height + (settings.anchorOffset ?? 4) - parentElement.top
    expect(left).toEqual(280) // anchorElement.left - parentElement.left

    settings.side = 'outside-left'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(180) // anchorElement.top - parentElement.top
    expect(left).toEqual(176) // anchorElement.left - floatingElement.width - (settings.anchorOffset ?? 4) - parentElement.left

    settings.side = 'outside-right'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(180) // anchorElement.top - parentElement.top
    expect(left).toEqual(334) // anchorElement.left + anchorElement.width + (settings.anchorOffset ?? 4) - parentElement.left

    settings.side = 'outside-top'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(76) // anchorElement.top - floatingElement.height - (settings.anchorOffset ?? 4) - parentElement.top
    expect(left).toEqual(280) // anchorElement.left - parentElement.left
  })

  it('returns the correct position for different inside side settings', () => {
    const parentElement = makeDOMRect(20, 20, 500, 500)
    const anchorElement = makeDOMRect(300, 200, 50, 50)
    const floatingElement = makeDOMRect(-9999, -9999, 100, 100)
    const {float, anchor} = createVirtualDOM(parentElement, anchorElement, floatingElement)
    const settings: Partial<PositionSettings> = {}
    let top = 0
    let left = 0

    settings.side = 'inside-bottom'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorElement.top + anchorElement.height - (settings.anchorOffset ?? 4) - floatingElement.height - parentElement.top
    expect(top).toEqual(126)
    // anchorElement.left + (settings.alignmentOffset ?? 4) - parentElement.left
    expect(left).toEqual(284)

    settings.side = 'inside-left'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(184) // anchorElement.top + (settings.alignmentOffset ?? 4) - parentElement.top
    expect(left).toEqual(284) // anchorElement.left + (settings.anchorOffset ?? 4) - parentElement.left

    settings.side = 'inside-right'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorElement.top + (settings.alignmentOffset ?? 4) - parentElement.top
    expect(top).toEqual(184)
    // anchorElement.left + anchorElement.width - (settings.anchorOffset ?? 4) - floatingElement.width - parentElement.left
    expect(left).toEqual(226)

    // almost the same as inside-left, with the exception of offsets
    settings.side = 'inside-top'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(184) // anchorElement.top + (settings.anchorOffset ?? 4) - parentElement.top
    expect(left).toEqual(284) // anchorElement.left + (settings.alignmentOffset ?? 4) - parentElement.left

    settings.side = 'inside-center'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(184) // anchorElement.top + (settings.alignmentOffset ?? 4) - parentElement.top
    expect(left).toEqual(255) // anchorElement.left + anchorElement.width / 2 - floatingElement.width / 2 - parentElement.left
  })

  it('returns the correct position for different alignment settings with no overflow', () => {
    const parentElement = makeDOMRect(20, 20, 500, 500)
    const anchorElement = makeDOMRect(300, 200, 50, 50)
    const floatingElement = makeDOMRect(-9999, -9999, 100, 100)
    const {float, anchor} = createVirtualDOM(parentElement, anchorElement, floatingElement)
    const settings: Partial<PositionSettings> = {}
    let top = 0
    let left = 0

    settings.align = 'first'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(234) // anchorElement.top + anchorElement.height + (settings.anchorOffset ?? 4) - parentElement.top
    expect(left).toEqual(280) // anchorElement.left + (settings.alignmentOffset ?? 0) - parentElement.left

    settings.align = 'center'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorElement.top + anchorElement.height + (settings.anchorOffset ?? 4) - parentElement.top
    expect(top).toEqual(234)
    // anchorElement.left + anchorElement.width / 2 - floatingElement.width / 2 + (settings.anchorOffset ?? 0) - parentElement.left
    expect(left).toEqual(255)

    settings.align = 'last'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorElement.top + anchorElement.height + (settings.anchorOffset ?? 4) - parentElement.top
    expect(top).toEqual(234)
    // anchorElement.left + anchorElement.width - floatingElement.width - (settings.alignmentOffset ?? 0) - parentElement.left
    expect(left).toEqual(230)
  })

  it('properly flips to the opposite side if the calculated position overflows along the same axis', () => {
    const parentElement = makeDOMRect(20, 20, 500, 500)
    const anchorElement = makeDOMRect(300, 400, 50, 50)
    const floatingElement = makeDOMRect(-9999, -9999, 100, 100)
    const {float, anchor} = createVirtualDOM(parentElement, anchorElement, floatingElement)
    const settings: Partial<PositionSettings> = {}
    
    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(anchorElement.top - floatingElement.height - (settings.anchorOffset ?? 4) - parentElement.top) // anchorElement.top - floatingElement.height - (settings.anchorOffset ?? 4) - parentElement.top
    expect(left).toEqual(anchorElement.left - parentElement.left) // anchorElement.left - parentElement.left
  })
})
