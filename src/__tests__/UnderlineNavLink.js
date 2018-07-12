import React from 'react'
import {ITEM_CLASS} from '../UnderlineNav'
import UnderlineNavLink from '../UnderlineNavLink'
import {render} from '../utils/testing'

describe('Caret', () => {
  it('renders an <a> by default', () => {
    expect(render(<UnderlineNavLink />).type).toEqual('a')
  })

  it('renders the given tag prop', () => {
    const Type = props => <b {...props} />
    expect(render(<UnderlineNavLink tag={Type} />)).toEqual(
      render(<b className={ITEM_CLASS} />)
    )
  })
})
