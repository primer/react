/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from '../Link'
import theme from '../theme'
import {render, renderClasses, px} from '../utils/testing'
import {COMMON} from '../system-props'

describe('Link', () => {
  it('is a system component', () => {
    expect(Link.systemComponent).toEqual(true)
  })

  it('implements common system props', () => {
    expect(Link).toImplementSystemProps(COMMON)
  })

  it('respects the "scheme" prop', () => {
    expect(render(<Link scheme="gray" />)).toHaveStyleRule('color', theme.colors.gray[6])
    expect(render(<Link scheme="gray-dark" />)).toHaveStyleRule('color', theme.colors.gray[9])
  })

  it('respects the "muted" prop', () => {
    expect(render(<Link muted />)).toHaveStyleRule('color', theme.colors.gray[6])
  })

  it('respects the "nounderline" prop', () => {
    expect(render(<Link nounderline />)).toHaveStyleRule('text-decoration', 'none')
  })

  it('passes href down to link element', () => {
    expect(render(<Link href="https://github.com" />)).toMatchSnapshot()
  })

  it('renders without any props', () => {
    expect(render(<Link />)).toMatchSnapshot()
  })
})
