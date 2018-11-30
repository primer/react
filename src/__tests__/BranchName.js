import React from 'react'
import BranchName from '../BranchName'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

describe('BranchName', () => {
  it('renders an <a> by default', () => {
    const comp = mount(<BranchName />)
    expect(render(comp).type).toEqual('a')
  })

  it('respects the "as" prop', () => {
    const comp = mount(<BranchName as="span" />)
    expect(render(comp).type).toEqual('span')
  })

  it('implements common system props', () => {
    expect(BranchName).toImplementSystemProps(COMMON)
  })
})
