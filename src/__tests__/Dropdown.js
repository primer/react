import React from 'react'
import Dropdown from '../Dropdown'
import {render} from '../utils/testing'

describe('Dropdown', () => {
  it('matches the snapshots', () => {
    expect(render(<Dropdown>hi</Dropdown>)).toMatchSnapshot()
    expect(render(<Dropdown title="hi">hello!</Dropdown>)).toMatchSnapshot()
  })

  it('renders a <div> with "BtnGroup" class', () => {
    const rendered = render(<Dropdown />)
    expect(rendered.type).toEqual('div')
    expect(rendered.props.className).toContain('BtnGroup')
  })
})
