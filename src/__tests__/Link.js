/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from '../Link'
import {render, mount} from '../utils/testing'
import {COMMON, TYPOGRAPHY} from '../system-props'

describe('Link', () => {

  it('implements common system props', () => {
    expect(Link).toImplementSystemProps(COMMON)
  })

  it('implements typography system props', () => {
    expect(Link).toImplementSystemProps(TYPOGRAPHY)
  })

  it('passes href down to link element', () => {
    expect(render(mount(<Link href="https://github.com" />))).toMatchSnapshot()
  })

  it('renders without any props', () => {
    expect(render(mount(<Link />))).toMatchSnapshot()
  })

  it('respects hoverColor prop', () => {
    expect(render(mount(<Link hoverColor="blue.4" />))).toMatchSnapshot()
  })
})
