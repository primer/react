/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from '../Link'
import theme from '../theme'
import {render} from '../utils/testing'
import {COMMON} from '../system-props'

describe('Link', () => {
  it('implements layout system props', () => {
    expect(Link).toImplementSystemProps(COMMON)
  })

  it('renders without any props', () => {
    expect(render(<Link />)).toMatchSnapshot()
  })

  it('renders margin', () => {
    expect(render(<Link m={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Link m={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Link m={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })
})
