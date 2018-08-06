import React from 'react'
import BranchName from '../BranchName'
import {render, rendersClass} from '../utils/testing'
import {COMMON} from '../system-props'

describe('BranchName', () => {
  xit('is a system component', () => {
    expect(BranchName.systemComponent).toEqual(true)
  })

  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })

  it('renders class="branch-name"', () => {
    expect(render(<BranchName />).props.className).toContain('branch-name')
  })

  it('respects the "tag" prop', () => {
    expect(render(<BranchName tag="span" />).type).toEqual('span')
  })

  it('renders href={null} if tag != "a"', () => {
    expect(render(<BranchName tag="span" href="#" />).props.href).toEqual(null)
  })

  xit('respects margin utility prop', () => {
    expect(rendersClass(<BranchName m={1} />, 'm-1')).toEqual(true)
  })

  xit('respects padding utility prop', () => {
    expect(rendersClass(<BranchName p={1} />, 'p-1')).toEqual(true)
  })
  it('implements common system props', () => {
    expect(BranchName).toImplementSystemProps(COMMON)
  })
})
