/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import CircleBadge from '../CircleBadge'
import {render, renderClasses, rendersClass, mount} from '../utils/testing'

const imgOutput = <img className="CircleBadge-icon" alt="" src="primer.jpg" />
const imgInput = <img alt="" src="primer.jpg" />

describe('CircleBadge', () => {
  it('renders medium by default', () => {
    expect(rendersClass(<CircleBadge />, 'CircleBadge--medium')).toEqual(true)
  })
  it('respects tag prop', () => {
    expect(
      render(
        <CircleBadge tag="a" href="https://github.com">
          {imgInput}
        </CircleBadge>
      )
    ).toEqual(
      render(
        <a className="CircleBadge CircleBadge--medium" href="https://github.com">
          {imgOutput}
        </a>
      )
    )
  })
  it('applies title', () => {
    expect(
      render(
        <CircleBadge tag="a" title="primer logo">
          {imgInput}
        </CircleBadge>
      ).props['title']
    ).toEqual('primer logo')
  })
  it('adds bg class', () => {
    expect(rendersClass(<CircleBadge bg="blue" />, 'bg-blue')).toEqual(true)
  })
  it('adds CircleBadge--icon class to children', () => {
    const comp = mount(<CircleBadge>{imgInput}</CircleBadge>).render()
    expect(
      comp
        .children()
        .first()
        .hasClass('CircleBadge-icon')
    ).toEqual(true)
  })
  it('preserves child class names', () => {
    const comp = mount(
      <CircleBadge>
        <img className="primer" alt="" src="primer.jpg" />
      </CircleBadge>
    ).render()
    expect(
      comp
        .children()
        .first()
        .hasClass('primer')
    ).toEqual(true)
  })
  it('respects margin utility prop', () => {
    expect(rendersClass(<CircleBadge m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<CircleBadge p={4} />, 'p-4')).toEqual(true)
  })
})
