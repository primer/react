import React from 'react'
import Flash from '../Flash'
import theme from '../theme'
import {COMMON} from '../system-props'
import {render, renderStyles} from '../utils/testing'

describe('Flash', () => {
  it('is a system component', () => {
    expect(Flash.systemComponent).toEqual(true)
  })

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

  it('respects margin utility prop', () => {
    expect(renderStyles(<Flash m={4} />)).toMatchKeys({
      'margin': `${theme.space[4]}px`
    })
  })

  it('respects padding utility prop', () => {
    expect(renderStyles(<Flash p={4} />)).toMatchKeys({
      'padding': `${theme.space[4]}px`
    })
  })
})
