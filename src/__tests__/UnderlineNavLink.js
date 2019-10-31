import React from 'react'
import UnderlineNav from '../UnderlineNav'
import {render} from '../utils/testing'

describe('UnderlineNav.Link', () => {
  it('renders an <a> by default', () => {
    expect(render(<UnderlineNav.Link />).type).toEqual('a')
  })

  it('has default theme', () => {
    expect(UnderlineNav.Link).toSetDefaultTheme()
  })

  it('renders the given "as" prop', () => {
    const Type = props => <b {...props} />
    expect(render(<UnderlineNav.Link as={Type} />)).toMatchSnapshot()
  })

  it('respects the "selected" prop', () => {
    expect(render(<UnderlineNav.Link selected />)).toMatchSnapshot()
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Mock = jest.fn(() => <div />)
    render(<UnderlineNav.Link as={Mock} to="#" />)
    expect(Mock.mock.calls[0][0].to).toEqual('#')
    expect(Mock.mock.calls[0][0].activeClassName).toEqual('selected')
  })
})
