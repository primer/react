import React from 'react'
import UnderlineNavItem from '../UnderlineNavItem'
import {render, renderClasses} from '../utils/testing'

describe('Caret', () => {
  it('renders an <a> by default', () => {
    expect(render(<UnderlineNavItem />).type).toEqual('a')
  })

  it('renders the given tag prop', () => {
    const Type = jest.fn()
    render(<UnderlineNavItem tag={Type} />)
    expect(Type.mock.calls.length).toBe(1)
  })
})
