import React from 'react'
import Tooltip from '../Tooltip'
import {render, renderClasses} from '../utils/testing'

describe('Tooltip', () => {
  it('renders a <span> with the "tooltipped" class', () => {
    expect(render(<Tooltip />).type).toEqual('span')
    expect(renderClasses(<Tooltip />)).toEqual(['tooltipped', 'tooltipped-n'])
  })

  it('respects the "align" prop', () => {
    expect(rendersClass(<Tooltip align="left" />, 'tooltipped-align-left-2')).toBe(true)
    expect(rendersClass(<Tooltip align="right" />, 'tooltipped-align-right-2')).toBe(true)
  })

  it('respects the "direction" prop', () => {
    for (const direction of Tooltip.directions) {
      expect(renderClasses(<Tooltip direction={direction} />).includes(`tooltipped-${direction}`)).toBe(true)
    }
  })

  it('respects the "noDelay" prop', () => {
    expect(renderClasses(<Tooltip noDelay />).includes(`tooltipped-no-delay`)).toBe(true)
  })

  it('respects the "text" prop', () => {
    expect(render(<Tooltip text="hi" />).props['aria-label']).toEqual('hi')
  })

  it('respects the "wrap" prop', () => {
    expect(renderClasses(<Tooltip wrap />).includes('tooltipped-multiline')).toBe(true)
  })
})
