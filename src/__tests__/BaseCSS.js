import React from 'react'
import BaseCSS, {css} from '../../css'
import {render} from '../utils/testing'

describe('BaseCSS', () => {
  it('has a "css" named export', () => {
    expect(typeof css).toBe('string')
  })

  it('renders CSS', () => {
    expect(render(<BaseCSS />)).toMatchSnapshot()
  })
})
