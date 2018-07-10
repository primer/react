import React from 'react'
import Flash from '../Flash'
import {mount, render} from '../utils/testing'

describe('Flash', () => {
  it('renders a <div> with "Flash" class', () => {
    const rendered = render(<Flash />)
    expect(rendered.type).toEqual('div')
    expect(rendered.props.className).toEqual('flash')
  })
})
