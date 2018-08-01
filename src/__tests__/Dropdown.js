import React from 'react'
import Dropdown from '../Dropdown'
import {render} from '../utils/testing'

describe('Dropdown', () => {
  it('renders a <div> with "BtnGroup" class', () => {
    const rendered = render(<Dropdown />)
    expect(rendered.type).toEqual('div')
    expect(rendered.props.className).toEqual('BtnGroup')
  })
  it('respects margin utility prop', () => {
    expect(render(<Dropdown m={1} />)).toHaveClass('m-1')
  })

  it('respects padding utility prop', () => {
    expect(render(<Dropdown p={1} />)).toHaveClass('p-1')
  })
})
