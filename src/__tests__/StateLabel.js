import React from 'react'
import Octicon, {Check} from '@githubprimer/octicons-react'
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
    for (const state of ['open', 'reopened', 'merged', 'closed']) {
      expect(render(<StateLabel state={state} />)).toMatchSnapshot()
    }
  })

  it('renders children', () => {
    expect(render(<StateLabel>hi</StateLabel>)).toMatchSnapshot()
  })

  it('renders icon with children', () => {
    expect(render(<StateLabel state="open">hi</StateLabel>)).toMatchSnapshot()
  })

  it('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<StateLabel />)
    expect(render(<StateLabel data-foo="bar" />)).toEqual(defaultOutput)
    expect(render(<StateLabel hidden />)).toEqual(defaultOutput)
  })

  it('respects the icon prop', () => {
    expect(render(<StateLabel icon={<Octicon icon={Check} />} state="open" />)).toMatchSnapshot()
  })

  it('respects icon={false}', () => {
    expect(render(<StateLabel state="open" icon={false} />)).toMatchSnapshot()
  })
})
