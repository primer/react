import React from 'react'
import chameleon, {asIs} from '../chameleon'
import {render} from '../utils/testing'

describe('chameleon()', () => {
  it('returns a component', () => {
    const A = chameleon('a')
    expect(typeof A).toEqual('function')
    expect(render(<A />)).toEqual(render(<a />))
  })

  it('respects the tag prop', () => {
    const A = chameleon('a')
    expect(render(<A tag='b' />)).toEqual(render(<b />))
  })
})
