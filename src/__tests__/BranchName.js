import React from 'react'
import BranchName from '../BranchName'
import {render} from '../utils/testing'
import {COMMON} from '../system-props'

describe('BranchName', () => {
  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })

  it('renders class="branch-name"', () => {
    expect(render(<BranchName />).props.className).toContain('branch-name')
  })

  it('respects the "is" prop', () => {
    expect(render(<BranchName is="span" />).type).toEqual('span')
  })

  it('renders href={null} if "is" != "a"', () => {
    expect(render(<BranchName is="span" href="#" />).props.href).toEqual(null)
  })

  it('implements common system props', () => {
    expect(BranchName).toImplementSystemProps(COMMON)
  })
})
