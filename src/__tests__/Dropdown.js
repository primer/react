import React from 'react'
import Dropdown from '../Dropdown'
import {render} from '../utils/testing'

describe('Dropdown', () => {
  it('renders a <div> with "BtnGroup" class', () => {
    const rendered = render(<Dropdown />)
    expect(rendered.type).toEqual('div')
    expect(rendered.props.className).toEqual('BtnGroup')
  })
})
