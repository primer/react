import React from 'react'
import Box from '../Box'
import {render} from '../utils/testing'

describe('Box', () => {
  it('renders default classes', () => {
    expect(render(<Box />)).toHaveClasses(['border', 'bg-white', 'round-1'])
  })

  it('renders margin', () => {
    expect(render(<Box m={1} />)).toHaveClasses(['m-1'])
    expect(render(<Box m={[0, 1, 2, 3, 4]} />)).toHaveClasses(['m-0', 'm-sm-1', 'm-md-2', 'm-lg-3', 'm-xl-4'])
    expect(render(<Box m={[null, 1, null, 3]} />)).toHaveClasses(['m-sm-1', 'm-lg-3'])
  })

  it('renders padding', () => {
    expect(render(<Box p={1} />)).toHaveClass('p-1')
    expect(render(<Box p={[0, 1, 2, 3, 4]} />)).toHaveClasses(['p-0', 'p-sm-1', 'p-md-2', 'p-lg-3', 'p-xl-4'])
    expect(render(<Box p={[null, 1, null, 3]} />)).toHaveClasses(['p-sm-1', 'p-lg-3'])
  })

  it('renders borders', () => {
    expect(render(<Box border />)).toHaveClasses(['border', 'bg-white', 'round-1'])
    expect(render(<Box border="left" borderColor="green" />)).toHaveClasses([
      'border-left',
      'border-green',
      'bg-white',
      'round-1'
    ])
  })
})
