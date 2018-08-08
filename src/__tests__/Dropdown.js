import React from 'react'
import Dropdown from '../Dropdown'
import {render} from '../utils/testing'

describe('Dropdown', () => {
  it('is a system component', () => {
    expect(Dropdown.systemComponent).toEqual(true)
  })

  it('matches the snapshots', () => {
    expect(render(<Dropdown>hi</Dropdown>)).toMatchSnapshot()
    expect(render(<Dropdown title="hi">hello!</Dropdown>)).toMatchSnapshot()
  })

  it('renders a <div> with "BtnGroup" class', () => {
    const rendered = render(<Dropdown />)
    expect(rendered.type).toEqual('div')
    expect(rendered.props.className).toContain('BtnGroup')
  })

  it('respects margin utility prop', () => {
    expect(render(<Dropdown m={1} />)).toHaveStyleRule('margin', '4px')
  })

  it('respects padding utility prop', () => {
    expect(render(<Dropdown p={1} />)).toHaveStyleRule('padding', '4px')
  })
})
