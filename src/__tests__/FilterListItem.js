/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import {ITEM_CLASS, SELECTED_CLASS} from '../FilterList'
import FilterListItem from '../FilterListItem'
import {render, rendersClass} from '../utils/testing'

describe('FilterListItem', () => {
  it('renders an <a> by default', () => {
    expect(render(<FilterListItem />).type).toEqual('a')
  })

  it('renders the given "tag" prop', () => {
    const Type = props => <b {...props} />
    expect(render(<FilterListItem tag={Type} />)).toEqual(render(<b className={ITEM_CLASS} />))
  })

  it('respects the "selected" prop', () => {
    expect(render(<FilterListItem selected />)).toEqual(render(<a className={`${ITEM_CLASS} ${SELECTED_CLASS}`} />))
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Mock = jest.fn(() => <div />)
    render(<FilterListItem tag={Mock} to="#" />)
    expect(Mock.mock.calls[0][0]).toEqual({
      to: '#',
      className: 'filter-item',
      activeClassName: 'selected',
      children: [undefined, undefined]
    })
  })

  it('respects "count" prop', () => {
    const CountMock = render(<FilterListItem count="400" />).children.pop()
    expect(CountMock.type).toEqual('span')
    expect(CountMock.props.className).toEqual('count')
  })

  it('respects margin utility prop', () => {
    expect(rendersClass(<FilterListItem m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<FilterListItem p={4} />, 'p-4')).toEqual(true)
  })
})
