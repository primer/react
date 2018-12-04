import React from 'react'
import Flash from '../Flash'
import {COMMON} from '../system-props'
import {render, mount} from '../utils/testing'

describe('Flash', () => {
  it('implements common props', () => {
    expect(Flash).toImplementSystemProps(COMMON)
  })

  it('renders a <div> with "Flash" class', () => {
    const rendered = render(mount(<Flash />))
    expect(rendered.type).toEqual('div')
    expect(rendered).toHaveClass('flash')
  })

  it('respects the "full" prop', () => {
    expect(render(mount(<Flash full />))).toHaveClasses(['flash', 'flash-full'])
  })

  it('respects the "scheme" prop', () => {
    expect(render(mount(<Flash scheme="yellow" />))).toHaveClasses(['flash', 'flash-warn'])
    expect(render(mount(<Flash scheme="red" />))).toHaveClasses(['flash', 'flash-error'])
    expect(render(mount(<Flash scheme="green" />))).toHaveClasses(['flash', 'flash-success'])
  })
})
