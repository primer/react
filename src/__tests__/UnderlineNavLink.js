/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import UnderlineNav from '../UnderlineNav'
import {render, mount} from '../utils/testing'

describe('UnderlineNav.Link', () => {
  it('renders an <a> by default', () => {
    expect(render(mount(<UnderlineNav.Link />)).type).toEqual('a')
  })

  it('renders the given "is" prop', () => {
    const Type = props => <b {...props} />
    expect(render(mount(<UnderlineNav.Link is={Type} />))).toMatchSnapshot()
  })

  it('respects the "selected" prop', () => {
    expect(render(mount(<UnderlineNav.Link selected />))).toMatchSnapshot()
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Mock = jest.fn(() => <div />)
    render(mount(<UnderlineNav.Link is={Mock} to="#" />))
    expect(Mock.mock.calls[0][0].to).toEqual('#')
    expect(Mock.mock.calls[0][0].activeClassName).toEqual('selected')
  })
})
