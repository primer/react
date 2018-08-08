import React from 'react'
import MergeStatus from '../MergeStatus'
import {render, renderClasses} from '../utils/testing'
import {COMMON} from '../system-props'

describe('MergeStatus', () => {
  it('is a system component', () => {
    expect(MergeStatus.systemComponent).toEqual(true)
  })

  it('implements common system props', () => {
    expect(MergeStatus).toImplementSystemProps(COMMON)
  })

  it('MergeStatus renders state', () => {
    expect(renderClasses(<MergeStatus state="ready" />)).toContain('State--green')
    expect(renderClasses(<MergeStatus state="invalid" />)).toContain('State--invalid')
    expect(renderClasses(<MergeStatus state="merged" />)).toContain('State--purple')
    expect(renderClasses(<MergeStatus state="pending" />)).toContain('State')
  })

  it('MergeStatus does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<MergeStatus state="ready" />)
    expect(render(<MergeStatus state="ready" data-foo="bar" />)).toEqual(defaultOutput)
    expect(render(<MergeStatus state="ready" hidden />)).toEqual(defaultOutput)
  })
})
