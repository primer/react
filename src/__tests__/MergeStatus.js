import React from 'react'
import MergeStatus from '../MergeStatus'
import {render, renderClasses, rendersClass} from '../utils/testing'

describe('MergeStatus', () => {
  it('MergeStatus renders state', () => {
    expect(renderClasses(<MergeStatus state="ready" />)).toEqual(['State', 'State--green'])
    expect(renderClasses(<MergeStatus state="invalid" />)).toEqual(['State', 'State--invalid'])
    expect(renderClasses(<MergeStatus state="merged" />)).toEqual(['State', 'State--purple'])
    expect(renderClasses(<MergeStatus state="pending" />)).toEqual(['State'])
  })

  it('MergeStatus does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<MergeStatus state="ready" />)
    expect(render(<MergeStatus state="ready" data-foo="bar" />)).toEqual(defaultOutput)
    expect(render(<MergeStatus state="ready" hidden />)).toEqual(defaultOutput)
  })

  it('respects margin utility prop', () => {
    expect(rendersClass(<MergeStatus state="ready" m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<MergeStatus state="ready" p={4} />, 'p-4')).toEqual(true)
  })
})
