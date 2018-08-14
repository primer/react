import React from 'react'
import {CaretBox} from '..'
import {render} from '../utils/testing'

describe('CaretBox', () => {
  it('is a system component', () => {
    expect(CaretBox.systemComponent).toEqual(true)
  })

  it('renders a <Caret> in <BorderBox> with relative positioning', () => {
    expect(render(<CaretBox />)).toMatchSnapshot()
  })

  it('passes the "borderColor" prop to both <BorderBox> and <Caret>', () => {
    expect(render(<CaretBox borderColor="red.5" />)).toMatchSnapshot()
  })

  it('passes the "bg" prop to both <BorderBox> and <Caret>', () => {
    expect(render(<CaretBox bg="red.5" />)).toMatchSnapshot()
  })
})
