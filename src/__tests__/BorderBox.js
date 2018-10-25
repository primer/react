import React from 'react'
import theme, {colors} from '../theme'
import BorderBox from '../BorderBox'
import Box from '../Box'
import {render} from '../utils/testing'

describe('BorderBox', () => {
  it('is a system component', () => {
    expect(BorderBox.systemComponent).toEqual(true)
  })

  it('renders borders', () => {
    expect(render(<BorderBox borderColor="green.5" />)).toHaveStyleRule('border-color', colors.green[5])
    expect(render(<BorderBox borderBottom={0} />)).toHaveStyleRule('border-bottom', '0')
  })

  it('renders border radius', () => {
    expect(render(<BorderBox borderRadius={2} />)).toHaveStyleRule('border-radius', `${theme.radii[2]}px`)
  })

  // the test returns the box shadow value without spaces, so had to manually provide the expected string here
  it('renders box shadow', () => {
    expect(render(<BorderBox boxShadow='small' />)).toHaveStyleRule('box-shadow', '0 1px 1px rgba(27,31,35,0.1)')
  })
})
