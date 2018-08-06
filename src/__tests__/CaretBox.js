import React from 'react'
import {CaretBox} from '..'
import {render} from '../utils/testing'

describe('CaretBox', () => {
  it('renders a <Caret> in <Box> with relative positioning', () => {
    expect(render(<CaretBox />)).toMatchSnapshot()
  })

  it('passes the "borderColor" prop to both <Box> and <Caret>', () => {
    expect(render(<CaretBox borderColor="red.5" />)).toMatchSnapshot()
  })

  it('passes the "bg" prop to both <Box> and <Caret>', () => {
    expect(render(<CaretBox bg="red.5" />)).toMatchSnapshot()
  })
})
