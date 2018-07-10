import React from 'react'
import UnderlineNavItem from '../UnderlineNavItem'
import {render} from '../utils/testing'

describe('Caret', () => {
  it('renders an <a> by default', () => {
    expect(render(<UnderlineNavItem />).type).toEqual('a')
  })

  it('renders the given tag prop', () => {
    const Type = props => <b {...props} />
    expect(render(<UnderlineNavItem tag={Type} />)).toEqual(
      render(<b className="UnderlineNav-item no-underline px-3" activeClassName="selected" />)
    )
  })
})
