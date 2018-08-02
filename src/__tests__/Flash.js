import React from 'react'
import Flash from '../Flash'
import theme from '../theme'
import {render} from '../utils/testing'

describe('Flash', () => {
  it('implements common props', () => {
    expect(Flash)
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

  // TODO: understand why these aren't working

  xit('respects margin utility prop', () => {
    expect(render(<Flash m={1} theme={theme} />)).toHaveStyleRule('margin', '4px')
  })

  xit('respects padding utility prop', () => {
    expect(render(<Flash p={2} theme={theme} />)).toHaveStyleRule('padding', '8px')
  })
})
