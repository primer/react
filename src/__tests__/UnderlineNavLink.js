import React from 'react'
import UnderlineNavLink from '../UnderlineNavLink'
import {render} from '../utils/testing'

describe('Caret', () => {
  it('renders an <a> by default', () => {
    expect(render(<UnderlineNavLink />).type).toEqual('a')
  })

  it('renders the given tag prop', () => {
    const Type = props => <b {...props} />
    expect(render(<UnderlineNavLink tag={Type} />)).toEqual(
      render(<b className="UnderlineNav-item no-underline px-3" activeClassName="selected" />)
    )
  })
})
