/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from '../Link'
import {render, mount} from '../utils/testing'
import theme from  '../theme'
import {COMMON, TYPOGRAPHY} from '../constants'

describe('Link', () => {
  it('implements system props', () => {
    expect(Link).toImplementSystemProps(COMMON)
    expect(Link).toImplementSystemProps(TYPOGRAPHY)
  })

  it('has default theme', () => {
    expect(Link).toSetDefaultTheme()
  })

  it('passes href down to link element', () => {
    expect(render(<Link href="https://github.com" />)).toMatchSnapshot()
  })

  it('renders without any props', () => {
    expect(render(<Link />)).toMatchSnapshot()
  })

  it('respects hoverColor prop', () => {
    expect(render(<Link hoverColor="blue.4" />)).toMatchSnapshot()
  })
})
