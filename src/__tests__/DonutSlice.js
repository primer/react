import React from 'react'
import DonutSlice from '../DonutSlice'
import {colors} from '../theme'
import {renderWithTheme as render} from '../utils/testing'

const {state} = colors

describe('DonutSlice', () => {
  it('renders known states as colors', () => {
    expect(render(<DonutSlice state="error" />).props.fill).toEqual(state.error)
    expect(render(<DonutSlice state="pending" />).props.fill).toEqual(state.pending)
    expect(render(<DonutSlice state="success" />).props.fill).toEqual(state.success)
    expect(render(<DonutSlice state="unknown" />).props.fill).toEqual(state.unknown)
  })

  it('renders unknown states with theme.colors.state.unknown', () => {
    expect(render(<DonutSlice state="xyz" />).props.fill).toEqual(state.unknown)
  })

  it('renders the fallback color when no state color is found in the theme', () => {
    expect(render(<DonutSlice state="error" theme={{}} />).props.fill).toEqual('#666')
  })

  it('respects the fill attribute', () => {
    expect(render(<DonutSlice fill="pink" />).props.fill).toEqual('pink')
  })
})
