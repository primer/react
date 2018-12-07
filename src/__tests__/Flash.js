import React from 'react'
import Flash from '../Flash'
import {COMMON} from '../system-props'
import {render} from '../utils/testing'

describe('Flash', () => {
  it('implements common props', () => {
    expect(Flash).toImplementSystemProps(COMMON)
  })

  it('renders a <div> with "Flash" class', () => {
    const rendered = render(<Flash />)
    expect(rendered.type).toEqual('div')
    expect(rendered).toHaveClass('flash')
  })

  it('respects the "full" prop', () => {
    expect(render(<Flash full />)).toHaveClasses(['flash', 'flash-full'])
  })

  it('respects the "scheme" prop', () => {
    expect(render(<Flash scheme="yellow" />)).toHaveClasses(['flash', 'flash-warn'])
    expect(render(<Flash scheme="red" />)).toHaveClasses(['flash', 'flash-error'])
    expect(render(<Flash scheme="green" />)).toHaveClasses(['flash', 'flash-success'])
  })
})
