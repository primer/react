/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from '../Link'
import theme from '../theme'
import {render, renderClasses} from '../utils/testing'
import {COMMON} from '../system-props'

describe('Link', () => {
  it('is a system component', () => {
    expect(Link.systemComponent).toEqual(true)
  })

  it('implements common system props', () => {
    expect(Link).toImplementSystemProps(COMMON)
  })

  it('respects the "scheme" prop', () => {
    expect(renderClasses(<Link scheme="gray" />)).toContain('link-gray')
    expect(renderClasses(<Link scheme="gray-dark" />)).toContain('link-gray-dark')
  })

  it('respects the "muted" prop', () => {
    expect(renderClasses(<Link muted />)).toContain('muted-link')
  })

  it('respects the "nounderline" prop', () => {
    expect(renderClasses(<Link nounderline />)).toContain('no-underline')
  })

  it('passes href down to link element', () => {
    expect(render(<Link href="https://github.com" />)).toMatchSnapshot()
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
