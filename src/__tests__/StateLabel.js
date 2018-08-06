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
    expect(render(<StateLabel scheme="green" />)).toMatchSnapshot()
    expect(render(<StateLabel scheme="red" />)).toMatchSnapshot()
    expect(render(<StateLabel scheme="purple" />)).toMatchSnapshot()
  })

  it('respects the small flag', () => {
    expect(render(<StateLabel small />)).toMatchSnapshot()
    expect(render(<StateLabel small={false} />)).toMatchSnapshot()
  })

  it('renders states as specific colors', () => {
    expect(render(<StateLabel state="open" />)).toMatchSnapshot()
    expect(render(<StateLabel state="reopened" />)).toMatchSnapshot()
    expect(render(<StateLabel state="merged" />)).toMatchSnapshot()
    expect(render(<StateLabel state="closed" />)).toMatchSnapshot()
  })

  it('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<StateLabel />)
    expect(render(<StateLabel data-foo="bar" />)).toEqual(defaultOutput)
    expect(render(<StateLabel hidden />)).toEqual(defaultOutput)
  })

  it('respects icon={false}', () => {
    expect(render(<StateLabel state="open" icon={false} />)).toMatchSnapshot()
  })
})
