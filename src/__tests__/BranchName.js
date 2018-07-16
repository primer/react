import React from 'react'
import BranchName from '../BranchName'
import {render, renderClasses, rendersClass} from '../utils/testing'

describe('BranchName', () => {
  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })

  it('renders class="branch-name"', () => {
    expect(render(<BranchName />).props.className).toEqual('branch-name')
  })

  it('respects the "tag" prop', () => {
    expect(render(<BranchName tag="span" />).type).toEqual('span')
  })

  it('renders href={null} if tag != "a"', () => {
    expect(render(<BranchName tag="span" href="#" />).props.href).toEqual(null)
  })

  it('respects margin utility prop', () => {
    expect(rendersClass(<BranchName m={1} />, 'm-1')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<BranchName p={1} />, 'p-1')).toEqual(true)
  })
})
