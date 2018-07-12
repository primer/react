/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import {ITEM_CLASS, SELECTED_CLASS} from '../UnderlineNav'
import UnderlineNavLink from '../UnderlineNavLink'
import {render} from '../utils/testing'

describe('Caret', () => {
  it('renders an <a> by default', () => {
    expect(render(<UnderlineNavLink />).type).toEqual('a')
  })

  it('renders the given "tag" prop', () => {
    const Type = props => <b {...props} />
    expect(render(<UnderlineNavLink tag={Type} />)).toEqual(render(<b className={ITEM_CLASS} />))
  })

  it('respects the "selected" prop', () => {
    expect(render(<UnderlineNavLink selected />)).toEqual(render(<a className={`${ITEM_CLASS} ${SELECTED_CLASS}`} />))
  })
})
