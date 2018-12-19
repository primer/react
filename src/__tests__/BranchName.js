import React from 'react'
import BranchName from '../BranchName'
import {render} from '../utils/testing'
import {COMMON} from '../constants'

describe('BranchName', () => {
  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })

  it('respects the "is" prop', () => {
    expect(render(<BranchName is="span" />).type).toEqual('span')
  })

  it('implements common system props', () => {
    expect(BranchName).toImplementSystemProps(COMMON)
  })
})
