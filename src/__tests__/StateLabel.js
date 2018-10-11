import React from 'react'
import StateLabel from '../StateLabel'
import {render} from '../utils/testing'
import {COMMON} from '../system-props'

describe('StateLabel', () => {
  it('is a system component', () => {
    expect(StateLabel.systemComponent).toEqual(true)
  })

  it('implements common system props', () => {
    expect(StateLabel).toImplementSystemProps(COMMON)
  })

  it('respects the scheme prop', () => {
    expect(render(<StateLabel scheme="issueOpened" />)).toMatchSnapshot()
    expect(render(<StateLabel scheme="issueClosed" />)).toMatchSnapshot()
    expect(render(<StateLabel scheme="pullMerged" />)).toMatchSnapshot()
  })

  it('respects the small flag', () => {
    expect(render(<StateLabel small />)).toMatchSnapshot()
    expect(render(<StateLabel small={false} />)).toMatchSnapshot()
  })

  it('renders children', () => {
    expect(render(<StateLabel>hi</StateLabel>)).toMatchSnapshot()
  })

  it('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<StateLabel />)
    expect(render(<StateLabel data-foo="bar" />)).toEqual(defaultOutput)
    expect(render(<StateLabel hidden />)).toEqual(defaultOutput)
  })
})
