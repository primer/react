/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import FilterListItem from '../FilterListItem'
import {render} from '../utils/testing'
import {COMMON} from '../system-props'

describe('FilterListItem', () => {
  it('is a system component', () => {
    expect(FilterListItem.systemComponent).toEqual(true)
  })

  it('implements common system props', () => {
    expect(FilterListItem).toImplementSystemProps(COMMON)
  })

  it('renders an <a> by default', () => {
    expect(render(<FilterListItem />).type).toEqual('a')
  })

  it('renders the given "tag" prop', () => {
    const Type = props => <b {...props} />
    expect(render(<FilterListItem tag={Type} />)).toMatchSnapshot()
  })

  it('respects the "selected" prop', () => {
    expect(render(<FilterListItem selected />)).toMatchSnapshot()
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Mock = jest.fn(() => <div />)
    expect(render(<FilterListItem tag={Mock} to="#" />)).toMatchSnapshot()
  })

  it('respects "count" prop', () => {
    const CountMock = render(<FilterListItem count="400" />).children.pop()
    expect(CountMock.type).toEqual('span')
    expect(CountMock.props.className).toEqual('count')
  })
})
