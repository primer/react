import React from 'react'
import {colors} from '../theme'
import BorderBox from '../BorderBox'
import Box from '../Box'
import {render} from '../utils/testing'

describe('BorderBox', () => {
  it('is a system component', () => {
    expect(BorderBox.systemComponent).toEqual(true)
  })

  it('renders a Box with default props', () => {
    expect(render(<BorderBox />)).toEqual(render(<Box {...BorderBox.defaultProps} />))
  })

  it('renders borders', () => {
    expect(render(<BorderBox borderColor="green.5" />)).toHaveStyleRule('border-color', colors.green[5])
    expect(render(<BorderBox borderBottom={0} />)).toHaveStyleRule('border-bottom', '0')
  })
})
