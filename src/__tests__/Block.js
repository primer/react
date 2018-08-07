import React from 'react'
import Block from '../Block'
import theme from '../theme'
import {render} from '../utils/testing'
import {COMMON, LAYOUT} from '../system-props'

describe('Block', () => {
  it('is a system component', () => {
    expect(Block.systemComponent).toEqual(true)
  })

  it('implements layout system props', () => {
    expect(Block).toImplementSystemProps(COMMON)
    expect(Block).toImplementSystemProps(LAYOUT)
  })

  it('renders without any props', () => {
    expect(render(<Block />)).toMatchSnapshot()
  })

  it('renders margin', () => {
    expect(render(<Block m={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Block m={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Block m={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('renders padding', () => {
    expect(render(<Block p={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Block p={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Block p={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  describe('borders', () => {
    it('handles border prop', () => {
      expect(render(<Block border={1} theme={theme} />)).toMatchSnapshot()
    })
    it('handles a single border edge', () => {
      expect(render(<Block borderLeft={1} borderColor="green.5" theme={theme} />)).toMatchSnapshot()
    })
    it('handles multiple border edges', () => {
      expect(render(<Block borderLeft={1} borderRight={1} borderColor="gray.2" theme={theme} />)).toMatchSnapshot()
    })
    it('handles just a border color', () => {
      expect(render(<Block borderColor="red.5" theme={theme} />)).toMatchSnapshot()
    })
  })

  it('respects display', () => {
    expect(render(<Block display="inline" />)).toMatchSnapshot()
    expect(render(<Block display="inline-block" />)).toMatchSnapshot()
    expect(render(<Block display="none" />)).toMatchSnapshot()
    expect(render(<Block display={['none', 'none', 'block']} theme={theme} />)).toMatchSnapshot()
  })

  it('respects position', () => {
    expect(render(<Block position="absolute" />)).toMatchSnapshot()
    expect(render(<Block position="relative" />)).toMatchSnapshot()
  })

  it('respects bg', () => {
    expect(render(<Block bg="yellow.2" theme={theme} />)).toMatchSnapshot()
  })

  it('respects color', () => {
    expect(render(<Block color="red.5" theme={theme} />)).toMatchSnapshot()
  })

  it('renders shadow', () => {
    expect(render(<Block boxShadow="small" theme={theme} />)).toMatchSnapshot()
    expect(render(<Block boxShadow="medium" theme={theme} />)).toMatchSnapshot()
    expect(render(<Block boxShadow="large" theme={theme} />)).toMatchSnapshot()
    expect(render(<Block boxShadow="extra-large" theme={theme} />)).toMatchSnapshot()
  })
})
