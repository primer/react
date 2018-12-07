/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import CircleBadge from '../CircleBadge'
import {render, mount} from '../utils/testing'

const imgInput = <img alt="" src="primer.jpg" />

describe('CircleBadge', () => {
  it('respects "as" prop', () => {
    const item = render(<CircleBadge as="a" />)
    expect(item.type).toEqual('a')
    expect(item).toMatchSnapshot()
  })

  it('applies title', () => {
    expect(
      render(
        <CircleBadge is="a" title="primer logo">
          {imgInput}
        </CircleBadge>
      ).props['title']
    ).toEqual('primer logo')
  })

  it('adds CircleBadge-icon class to children', () => {
    const comp = mount(<CircleBadge>{imgInput}</CircleBadge>)
    expect(comp.find('img').hasClass('CircleBadge-icon')).toEqual(true)
  })

  it('does not duplicate "CircleBadge-icon" classes', () => {
    const comp = mount(
      <CircleBadge>
        <img className="CircleBadge-icon" alt="" src="primer.jpg" />
      </CircleBadge>
    )
    expect(comp.find('img').props().className).toEqual('CircleBadge-icon')
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
