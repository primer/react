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
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 200, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {anchorOffset: 4}

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(234)
    expect(left).toEqual(280)
  })

  it('returns the correct position for different outside side settings with no overflow', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 200, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {}
    let top = 0
    let left = 0

    // should be the same calculation as the default settings test above
    settings.side = 'outside-bottom'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(234) // anchorRect.top + anchorRect.height + (settings.anchorOffset ?? 4) - parentRect.top
    expect(left).toEqual(280) // anchorRect.left - parentRect.left

    settings.side = 'outside-left'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(180) // anchorRect.top - parentRect.top
    expect(left).toEqual(176) // anchorRect.left - floatingRect.width - (settings.anchorOffset ?? 4) - parentRect.left

    settings.side = 'outside-right'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(180) // anchorRect.top - parentRect.top
    expect(left).toEqual(334) // anchorRect.left + anchorRect.width + (settings.anchorOffset ?? 4) - parentRect.left

    settings.side = 'outside-top'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(76) // anchorRect.top - floatingRect.height - (settings.anchorOffset ?? 4) - parentRect.top
    expect(left).toEqual(280) // anchorRect.left - parentRect.left
  })

  it('returns the correct position for different inside side settings', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 200, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {}
    let top = 0
    let left = 0

    settings.side = 'inside-bottom'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorRect.top + anchorRect.height - (settings.anchorOffset ?? 4) - floatingRect.height - parentRect.top
    expect(top).toEqual(126)
    // anchorRect.left + (settings.alignmentOffset ?? 4) - parentRect.left
    expect(left).toEqual(284)

    settings.side = 'inside-left'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(184) // anchorRect.top + (settings.alignmentOffset ?? 4) - parentRect.top
    expect(left).toEqual(284) // anchorRect.left + (settings.anchorOffset ?? 4) - parentRect.left

    settings.side = 'inside-right'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorRect.top + (settings.alignmentOffset ?? 4) - parentRect.top
    expect(top).toEqual(184)
    // anchorRect.left + anchorRect.width - (settings.anchorOffset ?? 4) - floatingRect.width - parentRect.left
    expect(left).toEqual(226)

    // almost the same as inside-left, with the exception of offsets
    settings.side = 'inside-top'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(184) // anchorRect.top + (settings.anchorOffset ?? 4) - parentRect.top
    expect(left).toEqual(284) // anchorRect.left + (settings.alignmentOffset ?? 4) - parentRect.left

    settings.side = 'inside-center'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(184) // anchorRect.top + (settings.alignmentOffset ?? 4) - parentRect.top
    expect(left).toEqual(255) // anchorRect.left + anchorRect.width / 2 - floatingRect.width / 2 - parentRect.left
  })

  it('returns the correct position inside centering along both axes', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 200, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {side: 'inside-center', align: 'center'}

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(155) // anchorRect.top + anchorRect.height / 2 - floatingRect.height / 2 - parentRect.top
    expect(left).toEqual(255) // anchorRect.left + anchorRect.width / 2 - floatingRect.width / 2 - parentRect.left
  })

  it('returns the correct position for different alignment settings with no overflow', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 200, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {}
    let top = 0
    let left = 0

    settings.align = 'start'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))
    expect(top).toEqual(234) // anchorRect.top + anchorRect.height + (settings.anchorOffset ?? 4) - parentRect.top
    expect(left).toEqual(280) // anchorRect.left + (settings.alignmentOffset ?? 0) - parentRect.left

    settings.align = 'center'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorRect.top + anchorRect.height + (settings.anchorOffset ?? 4) - parentRect.top
    expect(top).toEqual(234)
    // anchorRect.left + anchorRect.width / 2 - floatingRect.width / 2 + (settings.anchorOffset ?? 0) - parentRect.left
    expect(left).toEqual(255)

    settings.align = 'end'
    ;({top, left} = getAnchoredPosition(float, anchor, settings))

    // anchorRect.top + anchorRect.height + (settings.anchorOffset ?? 4) - parentRect.top
    expect(top).toEqual(234)
    // anchorRect.left + anchorRect.width - floatingRect.width - (settings.alignmentOffset ?? 0) - parentRect.left
    expect(left).toEqual(230)
  })

  it('properly flips to the opposite side if the calculated position overflows along the same axis', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 400, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {}

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(276) // anchorRect.top - floatingRect.height - (settings.anchorOffset ?? 4) - parentRect.top
    expect(left).toEqual(280) // anchorRect.left - parentRect.left
  })

  it('properly moves to an adjacent side if overflow happens along side edge and flipped edge', () => {
    const parentRect = makeDOMRect(20, 20, 500, 200)
    const anchorRect = makeDOMRect(300, 100, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {}

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(80) // anchorRect.top - parentRect.top
    expect(left).toEqual(334) // anchorRect.left + anchorRect.width + (settings.anchorOffset ?? 4) - parentRect.left
  })

  it('properly adjusts the position using an alignment offset if overflow happens along the alignment edge', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 200, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 400, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {}

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(234) // anchorRect.top + anchorRect.height + (settings.anchorOffset ?? 4) - parentRect.top
    expect(left).toEqual(100) // parentRect.width - floatingRect.width
  })

  it('properly calculates the position that needs to be flipped and offset-adjusted', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(300, 400, 50, 50)
    const floatingRect = makeDOMRect(NaN, NaN, 400, 100)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {}

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    expect(top).toEqual(276) // anchorRect.top - floatingRect.height - (settings.anchorOffset ?? 4) - parentRect.top
    expect(left).toEqual(100) // parentRect.width - floatingRect.width
  })

  it('properly calculates the outside position with many simultaneous settings interactions (stress test)', () => {
    const parentRect = makeDOMRect(20, 20, 200, 500)
    const anchorRect = makeDOMRect(95, 295, 100, 200)
    const floatingRect = makeDOMRect(NaN, NaN, 175, 200)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {
      side: 'outside-right',
      align: 'center',
      alignmentOffset: 10,
      anchorOffset: -10
    }

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    // expect to try right, left, and bottom before ending on top
    expect(top).toEqual(85) // anchorRect.top - floatingRect.height - (settings.anchorOffset ?? 4) - parentRect.top

    // expect center alignment to run against edge, so ignored. Also causes alignment offset to be ignored.
    expect(left).toEqual(25) // parentRect.width - floatingRect.width
  })

  it('properly calculates the inside position with many simultaneous settings interactions (stress test)', () => {
    const parentRect = makeDOMRect(20, 20, 500, 500)
    const anchorRect = makeDOMRect(100, 100, 300, 300)
    const floatingRect = makeDOMRect(NaN, NaN, 100, 200)
    const {float, anchor} = createVirtualDOM(parentRect, anchorRect, floatingRect)
    const settings: Partial<PositionSettings> = {
      side: 'inside-right',
      align: 'center',
      alignmentOffset: 10,
      anchorOffset: -10
    }

    const {top, left} = getAnchoredPosition(float, anchor, settings)

    // anchorRect.top + anchorRect.height / 2 - floatingRect.height / 2 + (settings.alignmentOffset ?? 4) - parentRect.top
    expect(top).toEqual(140)

    // anchorRect.left + anchorRect.width - floatingRect.width - (settings.anchorOffset ?? 4) - parentRect.left
    expect(left).toEqual(290)
  })
})
