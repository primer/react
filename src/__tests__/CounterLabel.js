import React from 'react'
import CounterLabel from '../CounterLabel'
import {render, renderClasses, rendersClass} from '../utils/testing'
import {COMMON} from '../system-props'

describe('CounterLabel', () => {
  xit('is a system component', () => {
    expect(CounterLabel.systemComponent).toEqual(true)
  })

  it('renders a <span> with the "Counter" class', () => {
    expect(render(<CounterLabel />).type).toEqual('span')
    expect(render(<CounterLabel />).props.className).toContain('Counter')
  })

  it('respects the "theme" prop', () => {
    expect(render(<CounterLabel scheme="gray" />).props.className).toContain('Counter--gray')
    expect(render(<CounterLabel scheme="gray-light" />).props.className).toContain('Counter--gray-light')
    // FIXME: should we test invalid values like this?
    // expect(renderClasses(<CounterLabel theme="red" />)).toEqual(['Counter', 'Counter--red'])
  })

  it('implements layout system props', () => {
    expect(CounterLabel).toImplementSystemProps(COMMON)
  })
})
