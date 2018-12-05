import React from 'react'
import Text from '../Text'
import theme from '../theme'
import {px, render, renderStyles, mount} from '../utils/testing'

describe('Text', () => {
  it('renders a <span> by default', () => {
    expect(render(mount(<Text />)).type).toEqual('span')
  })

  it('respects the "is" prop', () => {
    expect(render(mount(<Text is="b" />)).type).toEqual('b')
  })

  it('renders font-size', () => {
    for (const fontSize of theme.fontSizes) {
      expect(render(mount(<Text fontSize={fontSize} />))).toHaveStyleRule('font-size', px(fontSize))
    }
  })

  it('renders responsive fontSize', () => {
    expect(renderStyles(mount(<Text fontSize={[1, 2]} />))).toEqual({
      'font-size': px(theme.fontSizes[1]),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        'font-size': px(theme.fontSizes[2])
      }
    })
  })

  it('renders responsive lineHeight', () => {
    expect(renderStyles(mount(<Text lineHeight={['condensed', 'default']} />))).toEqual({
      'line-height': String(theme.lineHeights.condensed),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        'line-height': String(theme.lineHeights.default)
      }
    })
  })

  it('respects fontWeight', () => {
    expect(render(mount(<Text fontWeight="bold" />))).toHaveStyleRule('font-weight', '600')
    expect(render(mount(<Text fontWeight="normal" />))).toHaveStyleRule('font-weight', '400')
  })

  it('respects lineHeight', () => {
    for (const [name, value] of Object.entries(theme.lineHeights)) {
      expect(render(mount(<Text lineHeight={name} />))).toHaveStyleRule('line-height', String(value))
    }
  })

  it('respects fontFamily="mono"', () => {
    // emotion removes the whitespace between font-family values
    const mono = theme.fonts.mono.replace(/, /g, ',')
    expect(render(mount(<Text fontFamily="mono" />))).toHaveStyleRule('font-family', mono)
  })

  it('respects other values for fontSize', () => {
    expect(render(mount(<Text fontSize="2em" />))).toHaveStyleRule('font-size', '2em')
    expect(render(mount(<Text fontSize={100} />))).toHaveStyleRule('font-size', '100px')
  })
})
