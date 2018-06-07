import React from 'react'
import Caret from '../Caret'
import {render} from '../utils/testing'

describe('Caret', () => {
  it('outputs <svg> by default', () => {
    expect(render(<Caret />).type).toEqual('svg')
  })

  it('outputs a <div> if the "css" prop is present', () => {
    expect(render(<Caret css />).type).toEqual('div')
  })
})
