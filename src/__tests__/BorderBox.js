import React from 'react'
import theme, {colors} from '../theme'
import BorderBox from '../BorderBox'
import {render} from '../utils/testing'
import {LAYOUT, COMMON} from '../constants'

describe('BorderBox', () => {
  it('implements layout system props', () => {
    expect(BorderBox).toImplementSystemProps(LAYOUT)
    expect(BorderBox).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(BorderBox).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<BorderBox as="span" />).type).toEqual('span')
  })

  it('renders borders', () => {
    expect(render(<BorderBox borderColor="green.5" />)).toHaveStyleRule('border-color', colors.green[5])
    expect(render(<BorderBox borderBottom={0} />)).toHaveStyleRule('border-bottom', '0')
  })

  it('renders border radius', () => {
    expect(render(<BorderBox borderRadius={2} />)).toHaveStyleRule('border-radius', theme.radii[2])
  })

  // the test returns the box shadow value without spaces, so had to manually provide the expected string here
  it('renders box shadow', () => {
    expect(render(<BorderBox boxShadow="small" />)).toHaveStyleRule('box-shadow', '0 1px 1px rgba(27,31,35,0.1)')
  })
})
