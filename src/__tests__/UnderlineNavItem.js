import React from 'react'
import UnderlineNavItem from '../UnderlineNavItem'
import {render} from '../utils/testing'

describe('Caret', () => {
  it('renders an <a> by default', () => {
    expect(render(<UnderlineNavItem />).type).toEqual('a')
  })

  it('renders the given tag prop', () => {
    const Type = props => <div />
    expect(render(<UnderlineNavItem tag={Type} />)).toEqual(render(<div />))
  })
})
