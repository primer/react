import React from 'react'
import Flash from '../Flash'
import {render, renderClasses, rendersClass} from '../utils/testing'

describe('Flash', () => {
  it('renders a <div> with "Flash" class', () => {
    const rendered = render(<Flash />)
    expect(rendered.type).toEqual('div')
    expect(rendered.props.className).toEqual('flash')
  })

  it('respects the "full" prop', () => {
    expect(renderClasses(<Flash full />)).toEqual(['flash', 'flash-full'])
  })

  it('respects the "scheme" prop', () => {
    expect(renderClasses(<Flash scheme="yellow" />)).toEqual(['flash', 'flash-warn'])
    expect(renderClasses(<Flash scheme="red" />)).toEqual(['flash', 'flash-error'])
    expect(renderClasses(<Flash scheme="green" />)).toEqual(['flash', 'flash-success'])
  })

  it('respects margin utility prop', () => {
    expect(rendersClass(<Flash m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<Flash p={4} />, 'p-4')).toEqual(true)
  })
})
