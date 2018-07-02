import React from 'react'
import DonutSlice from '../DonutSlice'
import {colors} from '../theme'
import {render} from '../utils/testing'

describe('DonutSlice', () => {
  it('renders known states as colors', () => {
    expect(render(<DonutSlice state="error" />).props.fill).toEqual(colors.red[5])
    expect(render(<DonutSlice state="pending" />).props.fill).toEqual(colors.yellow[7])
    expect(render(<DonutSlice state="success" />).props.fill).toEqual(colors.green[5])
    expect(render(<DonutSlice state="unknown" />).props.fill).toEqual(colors.gray[4])
  })

  it('renders unknown states as gray', () => {
    const hush = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    expect(render(<DonutSlice state="xyz" />).props.fill).toEqual(colors.gray[4])
    hush.mockRestore()
  })

  it('respects the fill attribute', () => {
    expect(render(<DonutSlice fill="pink" />).props.fill).toEqual('pink')
  })
})
