import React from 'react'
import {Box, Caret, CaretBox} from '..'
import {colors} from '../theme'
import {render} from '../utils/testing'

describe('CaretBox', () => {
  it('renders a <Caret> in <Box> with relative positioning', () => {
    expect(render(<CaretBox />)).toEqual(
      render(
        <Box position="relative">
          <Caret />
        </Box>
      )
    )
  })

  it('passes the "borderColor" prop to both <Box> and <Caret>', () => {
    expect(render(<CaretBox borderColor="red" />)).toEqual(
      render(
        <Box borderColor="red" position="relative">
          <Caret borderColor="red" />
        </Box>
      )
    )
  })

  it('passes the "bg" prop to both <Box> and <Caret>', () => {
    expect(render(<CaretBox bg="red" />)).toEqual(
      render(
        <Box bg="red" position="relative">
          <Caret fill={colors.bg.red} />
        </Box>
      )
    )
  })
})
