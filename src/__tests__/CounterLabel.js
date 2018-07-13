import React from 'react'
import CounterLabel from '../CounterLabel'
import {render, renderClasses} from '../utils/testing'

describe('CounterLabel', () => {
  it('renders a <span> with the "Counter" class', () => {
    expect(render(<CounterLabel />)).toEqual(render(<span className="Counter" />))
  })

  it('respects the "theme" prop', () => {
    expect(renderClasses(<CounterLabel theme="gray" />)).toEqual(['Counter', 'Counter--gray'])
    expect(renderClasses(<CounterLabel theme="gray-light" />)).toEqual(['Counter', 'Counter--gray-light'])
    // FIXME: should we test invalid values like this?
    // expect(renderClasses(<CounterLabel theme="red" />)).toEqual(['Counter', 'Counter--red'])
  })
})
