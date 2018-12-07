/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import FilterList from '../FilterList'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

describe('FilterList.Item', () => {
  it('implements common system props', () => {
    expect(FilterList.Item).toImplementSystemProps(COMMON)
  })

  it('renders an <a> by default', () => {
    expect(render(<FilterList.Item />).type).toEqual('a')
  })

  it('renders the given "is" prop', () => {
    const Type = props => <b {...props} />
    expect(render(<FilterList.Item is={Type} />)).toMatchSnapshot()
  })

  it('respects the "selected" prop', () => {
    expect(render(<FilterList.Item selected />)).toMatchSnapshot()
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Mock = jest.fn(() => <div />)
    expect(render(<FilterList.Item is={Mock} to="#" />)).toMatchSnapshot()
  })

  it('respects "count" prop', () => {
    const CountMock = render(<FilterList.Item count="400" />).children.pop()
    expect(CountMock.type).toEqual('span')
    expect(CountMock.props.className).toEqual('count')
  })
})
