import React from 'react'
import Box from '../Box'
import theme from '../theme'
import {render} from '../utils/testing'
import {LAYOUT} from '../system-props'

describe('Box', () => {
  it('is a system component', () => {
    expect(Box.systemComponent).toEqual(true)
  })

  it('implements layout system props', () => {
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

  it('respects display', () => {
    expect(render(<Box display="inline" />)).toMatchSnapshot()
    expect(render(<Box display="inline-block" />)).toMatchSnapshot()
    expect(render(<Box display="none" />)).toMatchSnapshot()
    expect(render(<Box display={['none', 'none', 'block']} theme={theme} />)).toMatchSnapshot()
  })
})
