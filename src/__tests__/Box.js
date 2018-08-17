import React from 'react'
import Box from '../Box'
import theme from '../theme'
import {render} from '../utils/testing'
import {COMMON, LAYOUT} from '../system-props'

describe('Box', () => {
  it('is a system component', () => {
    expect(Box.systemComponent).toEqual(true)
  })

  it('implements layout system props', () => {
    expect(Box).toImplementSystemProps(COMMON)
    expect(Box).toImplementSystemProps(LAYOUT)
  })

  it('renders without any props', () => {
    expect(render(<Box />)).toMatchSnapshot()
  })

  it('renders margin', () => {
    expect(render(<Box m={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box m={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box m={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('renders padding', () => {
    expect(render(<Box p={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box p={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box p={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  describe('borders', () => {
    it('handles border prop', () => {
      expect(render(<Box border={1} theme={theme} />)).toMatchSnapshot()
    })
    it('handles a single border edge', () => {
      expect(render(<Box borderLeft={1} borderColor="green.5" theme={theme} />)).toMatchSnapshot()
    })
    it('handles multiple border edges', () => {
      expect(render(<Box borderLeft={1} borderRight={1} borderColor="gray.2" theme={theme} />)).toMatchSnapshot()
    })
    it('handles just a border color', () => {
      expect(render(<Box borderColor="red.5" theme={theme} />)).toMatchSnapshot()
    })
  })

  it('respects display', () => {
    expect(render(<Box display="inline" />)).toMatchSnapshot()
    expect(render(<Box display="inline-block" />)).toMatchSnapshot()
    expect(render(<Box display="none" />)).toMatchSnapshot()
    expect(render(<Box display={['none', 'none', 'block']} theme={theme} />)).toMatchSnapshot()
  })

  it('respects position', () => {
    expect(render(<Box position="absolute" />)).toMatchSnapshot()
    expect(render(<Box position="relative" />)).toMatchSnapshot()
  })

  it('respects bg', () => {
    expect(render(<Box bg="yellow.2" theme={theme} />)).toMatchSnapshot()
  })

  it('respects color', () => {
    expect(render(<Box color="red.5" theme={theme} />)).toMatchSnapshot()
  })

  it('renders shadow', () => {
    expect(render(<Box boxShadow="small" theme={theme} />)).toMatchSnapshot()
    expect(render(<Box boxShadow="medium" theme={theme} />)).toMatchSnapshot()
    expect(render(<Box boxShadow="large" theme={theme} />)).toMatchSnapshot()
    expect(render(<Box boxShadow="extra-large" theme={theme} />)).toMatchSnapshot()
  })
})
