import React from 'react'
import Block from '../Block'
import {render, renderClasses} from '../utils/testing'

describe('Block', () => {
  it('renders default classes', () => {
    expect(renderClasses(<Block />)).toEqual([])
  })

  it('renders margin', () => {
    expect(render(<Block m={1} />)).toHaveClasses(['m-1'], true)
    expect(render(<Block m={[0, 1, 2, 3, 4]} />)).toHaveClasses([
      'm-0',
      'm-sm-1',
      'm-md-2',
      'm-lg-3',
      'm-xl-4'
    ], true)
    expect(render(<Block m={[null, 1, null, 3]} />)).toHaveClasses(['m-sm-1', 'm-lg-3'], true)
  })

  it('renders padding', () => {
    expect(render(<Block p={1} />)).toHaveClasses(['p-1'], true)
    expect(render(<Block p={[0, 1, 2, 3, 4]} />)).toHaveClasses([
      'p-0',
      'p-sm-1',
      'p-md-2',
      'p-lg-3',
      'p-xl-4'
    ], true)
    expect(render(<Block p={[null, 1, null, 3]} />)).toHaveClasses(['p-sm-1', 'p-lg-3'], true)
  })

  describe('borders', () => {
    it('handles border prop as true', () => {
      expect(render(<Block border />)).toHaveClasses(['border'], true)
    })
    it('handles border prop as false', () => {
      expect(render(<Block border={false} />)).toHaveClasses(['border-0'], true)
    })
    it('handles a single border edge', () => {
      expect(render(<Block border="left" borderColor="green" />)).toHaveClasses(['border-left', 'border-green'], true)
    })
    it('handles multiple border edges', () => {
      expect(render(<Block border={['top', 'left']} />)).toHaveClasses(['border-top', 'border-left'], true)
    })
    it('handles just a border color', () => {
      expect(render(<Block borderColor="red" />)).toHaveClasses(['border', 'border-red'], true)
    })
  })

  it('respects display', () => {
    expect(renderClasses(<Block display="inline" />)).toEqual(['d-inline'])
    expect(renderClasses(<Block display="inline-block" />)).toEqual(['d-inline-block'])
    expect(renderClasses(<Block display="none" />)).toEqual(['d-none'])
  })

  it('respects position', () => {
    expect(renderClasses(<Block position="absolute" />)).toEqual(['position-absolute'])
    expect(renderClasses(<Block position="relative" />)).toEqual(['position-relative'])
  })

  it('respects bg', () => {
    expect(render(<Block bg="yellow" />)).toHaveClass('bg-yellow')
  })

  it('respects color prop', () => {
    expect(render(<Block color="red" />)).toHaveClass('color-red-5')
  })

  it('renders shadow', () => {
    expect(render(<Block shadow="small" />)).toHaveClass('box-shadow')
    expect(render(<Block shadow="medium" />)).toHaveClass('box-shadow-medium')
    expect(render(<Block shadow="large" />)).toHaveClass('box-shadow-large')
    expect(render(<Block shadow="extra-large" />)).toHaveClass('box-shadow-extra-large')
  })
})
