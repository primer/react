import React from 'react'
import BaseCSS, {css} from '../BaseCSS'
import {render} from '../utils/testing'

describe('BaseCSS', () => {
  it('exports a "css" string', () => {
    expect(typeof css).toBe('string')
  })

  it('renders CSS', () => {
    expect(render(<BaseCSS />)).toMatchSnapshot()
  })
})
