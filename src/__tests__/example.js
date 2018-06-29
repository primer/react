import React from 'react'
import {render} from '../utils/testing'

it('Renders components', () => {
  expect(render(<div className="foo" />)).toEqual(render(<div className="foo" />))
})
