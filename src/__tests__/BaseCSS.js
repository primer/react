import React from 'react'
import BaseCSS from '../BaseCSS'
import {render} from '../utils/testing'

describe('BaseCSS', () => {
  it('has a "css" property', () => {
    expect(typeof BaseCSS.css).toBe('string')
  })

  it('renders CSS', () => {
    expect(render(<BaseCSS />)).toMatchSnapshot()
  })
})
