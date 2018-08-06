import React from 'react'
import Dropdown from '../Dropdown'
import {render, rendersClass} from '../utils/testing'

describe('Dropdown', () => {
  xit('is a system component', () => {
    expect(Dropdown.systemComponent).toEqual(true)
  })

  it('renders a <div> with "BtnGroup" class', () => {
    const rendered = render(<Dropdown />)
    expect(rendered.type).toEqual('div')
    expect(rendered.props.className).toEqual('BtnGroup')
  })

  it('respects margin utility prop', () => {
    expect(rendersClass(<Dropdown m={1} />, 'm-1')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<Dropdown p={1} />, 'p-1')).toEqual(true)
  })
})
