import React from 'react'
import CounterLabel from '../CounterLabel'
import {render, renderClasses, rendersClass} from '../utils/testing'

describe('CounterLabel', () => {
  xit('is a system component', () => {
    expect(CounterLabel.systemComponent).toEqual(true)
  })

  it('renders a <span> with the "Counter" class', () => {
    expect(render(<CounterLabel />)).toEqual(render(<span className="Counter" />))
  })

  it('respects the "theme" prop', () => {
    expect(renderClasses(<CounterLabel theme="gray" />)).toEqual(['Counter', 'Counter--gray'])
    expect(renderClasses(<CounterLabel theme="gray-light" />)).toEqual(['Counter', 'Counter--gray-light'])
    // FIXME: should we test invalid values like this?
    // expect(renderClasses(<CounterLabel theme="red" />)).toEqual(['Counter', 'Counter--red'])
  })

  it('respects margin utility prop', () => {
    expect(rendersClass(<CounterLabel m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<CounterLabel p={4} />, 'p-4')).toEqual(true)
  })
})
