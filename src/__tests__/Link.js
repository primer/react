/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from '../Link'
import {colors} from '../theme'
import {render} from '../utils/testing'
import {COMMON, TYPOGRAPHY} from '../system-props'

describe('Link', () => {
  it('is a system component', () => {
    expect(Link.systemComponent).toEqual(true)
  })

  it('implements common system props', () => {
    expect(Link).toImplementSystemProps(COMMON)
  })

  it('implements typography system props', () => {
    expect(Link).toImplementSystemProps(TYPOGRAPHY)
  })

  it('passes href down to link element', () => {
    expect(render(<Link href="https://github.com" />)).toMatchSnapshot()
  })

  it('renders without any props', () => {
    expect(render(<Link />)).toMatchSnapshot()
  })
})
