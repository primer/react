import React from 'react'
import StateLabel from '../StateLabel'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

describe('StateLabel', () => {
  it('implements common system props', () => {
    expect(StateLabel).toImplementSystemProps(COMMON)
  })

  it('respects the status prop', () => {
    expect(render(mount(<StateLabel status="issueOpened" />))).toMatchSnapshot()
    expect(render(mount(<StateLabel status="issueClosed" />))).toMatchSnapshot()
    expect(render(mount(<StateLabel status="pullMerged" />))).toMatchSnapshot()
  })

  it('respects the small flag', () => {
    expect(render(mount(<StateLabel small />))).toMatchSnapshot()
    expect(render(mount(<StateLabel small={false} />))).toMatchSnapshot()
  })

  it('renders children', () => {
    expect(render(mount(<StateLabel>hi</StateLabel>))).toMatchSnapshot()
  })

  it('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<StateLabel />)
    expect(render(mount(<StateLabel data-foo="bar" />))).toEqual(defaultOutput)
    expect(render(mount(<StateLabel hidden />))).toEqual(defaultOutput)
  })
})
