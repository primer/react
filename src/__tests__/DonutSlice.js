import React from 'react'
import DonutSlice from '../DonutSlice'
import theme, {colors} from '../theme'
import {renderWithTheme} from '../utils/testing'

const render = node => renderWithTheme(node, theme)
const {state} = colors

describe('DonutSlice', () => {
  it('renders known states as colors', () => {
    expect(render(<DonutSlice state="error" theme={theme} />).props.fill).toEqual(state.error)
    expect(render(<DonutSlice state="pending" theme={theme} />).props.fill).toEqual(state.pending)
    expect(render(<DonutSlice state="success" theme={theme} />).props.fill).toEqual(state.success)
    expect(render(<DonutSlice state="unknown" theme={theme} />).props.fill).toEqual(state.unknown)
  })

  xit('renders unknown states with theme.colors.state.unknown', () => {
    const hush = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    expect(render(<DonutSlice state="xyz" />).props.fill).toEqual(state.unknown)
    hush.mockRestore()
  })

  it('respects the fill attribute', () => {
    expect(render(<DonutSlice fill="pink" />).props.fill).toEqual('pink')
  })
})
