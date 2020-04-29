import React from 'react'
import Text from '../Text'
import theme from '../theme'
import {px, render, renderStyles, behavesAsComponent} from '../utils/testing'
import {COMMON, TYPOGRAPHY} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Text', () => {
  behavesAsComponent(Text, [COMMON, TYPOGRAPHY])

  it('renders a <span> by default', () => {
    expect(render(<Text />).type).toEqual('span')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Text>hello</Text>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      expect(render(<Text fontSize={fontSize} />)).toHaveStyleRule('font-size', px(fontSize))
    }
  })

  it('renders responsive fontSize', () => {
    expect(renderStyles(<Text fontSize={[1, 2]} />)).toEqual({
      'font-size': px(theme.fontSizes[1]),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        'font-size': px(theme.fontSizes[2])
      }
    })
  })

  it('renders responsive lineHeight', () => {
    expect(renderStyles(<Text lineHeight={['condensed', 'default']} />)).toEqual({
      'line-height': String(theme.lineHeights.condensed),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        'line-height': String(theme.lineHeights.default)
      }
    })
  })

  it('respects fontWeight', () => {
    expect(render(<Text fontWeight="bold" />)).toHaveStyleRule('font-weight', '600')
    expect(render(<Text fontWeight="normal" />)).toHaveStyleRule('font-weight', '400')
  })

  it('respects the "fontStyle" prop', () => {
    expect(render(<Text fontStyle="italic" />)).toHaveStyleRule('font-style', 'italic')
    expect(render(<Text as="i" fontStyle="normal" />)).toHaveStyleRule('font-style', 'normal')
  })

  it('respects lineHeight', () => {
    for (const [name, value] of Object.entries(theme.lineHeights)) {
      expect(render(<Text lineHeight={name} />)).toHaveStyleRule('line-height', String(value))
    }
  })

  it('respects fontFamily="mono"', () => {
    // styled-components removes the whitespace between font-family values
    const mono = theme.fonts.mono.replace(/, /g, ',')
    expect(render(<Text fontFamily="mono" />)).toHaveStyleRule('font-family', mono)
  })

  it('respects other values for fontSize', () => {
    expect(render(<Text fontSize="2em" />)).toHaveStyleRule('font-size', '2em')
    expect(render(<Text fontSize={100} />)).toHaveStyleRule('font-size', '100px')
  })
})
