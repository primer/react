/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import {ITEM_CLASS, SELECTED_CLASS} from '../UnderlineNav'
import UnderlineNavLink from '../UnderlineNavLink'
import {render, rendersClass} from '../utils/testing'

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

  it('respects margin utility prop', () => {
    expect(rendersClass(<UnderlineNavLink m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<UnderlineNavLink p={4} />, 'p-4')).toEqual(true)
  })

  it('has the right displayName', () => {
    expect(UnderlineNavLink.displayName).toEqual('UnderlineNavLink')
  })
})
