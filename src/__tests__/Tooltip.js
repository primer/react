import React from 'react'
import Tooltip from '../Tooltip'
import {render, renderClasses} from '../utils/testing'

describe('Tooltip', () => {
  it('renders a <span> with the "tooltipped" class', () => {
    expect(render(<Tooltip />).type).toEqual('span')
    expect(renderClasses(<Tooltip />)).toEqual(['tooltipped', 'tooltipped-n'])
  })

  it('respects the "align" prop', () => {
    expect(renderClasses(<Tooltip align="ne" />).includes('tooltipped-align-ne-2')).toBe(true)
    expect(renderClasses(<Tooltip align="se" />).includes('tooltipped-align-se-2')).toBe(true)
    expect(renderClasses(<Tooltip align="nw" />).includes('tooltipped-align-nw-2')).toBe(true)
    expect(renderClasses(<Tooltip align="sw" />).includes('tooltipped-align-sw-2')).toBe(true)
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
