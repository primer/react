import React from 'react'
import CircleBadge from '../CircleBadge'
import {render, mount} from '../utils/testing'
import {COMMON} from '../constants'

const imgInput = <img alt="" src="primer.jpg" />

describe('CircleBadge', () => {
  it('respects "as" prop', () => {
    const item = render(<CircleBadge as="a" />)
    expect(item.type).toEqual('a')
    expect(item).toMatchSnapshot()
  })

  it('has default theme', () => {
    expect(CircleBadge).toSetDefaultTheme()
  })

  it('implements system props', () => {
    expect(CircleBadge).toImplementSystemProps(COMMON)
  })

  it('applies title', () => {
    expect(
      render(
        <CircleBadge as="a" title="primer logo">
          {imgInput}
        </CircleBadge>
      ).props['title']
    ).toEqual('primer logo')
  })

  it('preserves child class names', () => {
    const comp = mount(
      <CircleBadge>
        <img className="primer" alt="" src="primer.jpg" />
      </CircleBadge>
    )
    expect(comp.find('img').hasClass('primer')).toEqual(true)
  })
})
