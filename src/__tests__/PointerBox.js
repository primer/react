import React from 'react'
import {PointerBox} from '..'
import {render} from '../utils/testing'

describe('PointerBox', () => {
  it('renders a <Caret> in <BorderBox> with relative positioning', () => {
    expect(render(<PointerBox />)).toMatchSnapshot()
  })

  it('passes the "borderColor" prop to both <BorderBox> and <Caret>', () => {
    expect(render(<PointerBox borderColor="red.5" />)).toMatchSnapshot()
  })

  it('passes the "bg" prop to both <BorderBox> and <Caret>', () => {
    expect(render(<PointerBox bg="red.5" />)).toMatchSnapshot()
  })
})
