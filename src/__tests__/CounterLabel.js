import React from 'react'
import CounterLabel from '../CounterLabel'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

describe('CounterLabel', () => {
  it('renders a <span> with the "Counter" class', () => {
    expect(render(mount(<CounterLabel />)).type).toEqual('span')
    expect(render(mount(<CounterLabel />)).props.className).toContain('Counter')
  })

  it('respects the "scheme" prop', () => {
    expect(render(mount(<CounterLabel scheme="gray" />)).props.className).toContain('Counter--gray')
    expect(render(mount(<CounterLabel scheme="gray-light" />)).props.className).toContain('Counter--gray-light')
    // FIXME: should we test invalid values like this?
    // expect(renderClasses(<CounterLabel theme="red" />)).toEqual(['Counter', 'Counter--red'])
  })

  it('implements layout system props', () => {
    expect(CounterLabel).toImplementSystemProps(COMMON)
  })
})
