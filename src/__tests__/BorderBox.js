import React from 'react'
import theme from '../theme'
import BorderBox from '../BorderBox'
import Box from '../Box'
import {px, render, renderStyles} from '../utils/testing'

describe('BorderBox', () => {
  it('is a system component', () => {
    expect(BorderBox.systemComponent).toEqual(true)
  })

  it('renders a Box with default props', () => {
    expect(render(<BorderBox />)).toEqual(render(<Box {...BorderBox.defaultProps} />))
  })

  it('renders margin', () => {
    expect(render(<BorderBox m={1} />)).toHaveStyleRule('margin', px(theme.space[1]))
    expect(renderStyles(<BorderBox m={[0, 1]} />)).toMatchKeys({
      margin: px(theme.space[0]),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        margin: px(theme.space[1])
      }
    })
  })

  it('renders margin', () => {
    expect(render(<BorderBox p={1} />)).toHaveStyleRule('padding', px(theme.space[1]))
    expect(renderStyles(<BorderBox p={[0, 1]} />)).toMatchKeys({
      padding: px(theme.space[0]),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        padding: px(theme.space[1])
      }
    })
  })

  it('renders borders', () => {
    expect(render(<BorderBox borderColor="green.5" />)).toHaveStyleRule('border-color', theme.colors.green[5])
    expect(render(<BorderBox borderBottom={0} />)).toHaveStyleRule('border-bottom', '0')
  })
})
