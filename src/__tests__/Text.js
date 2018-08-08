import React from 'react'
import Text from '../Text'
import theme, {colors} from '../theme'
import {render} from '../utils/testing'

describe('Text', () => {
  it('is a system component', () => {
    expect(Text.systemComponent).toEqual(true)
  })

  it('renders a <span> by default', () => {
    expect(render(<Text />).type).toEqual('span')
  })

  it('respects the "is" prop', () => {
    expect(render(<Text is="b" />).type).toEqual('b')
  })

  it('renders font-size', () => {
    for (const fontSize of theme.fontSizes) {
      expect(render(<Text fontSize={fontSize} />)).toHaveStyleRule('font-size', `${fontSize}px`)
    }
  })

  it('renders margin', () => {
    expect(render(<Text m={1} />)).toHaveStyleRule('margin', '4px')
    expect(render(<Text m={[0, 1, 2, 3, 4]} />)).toMatchSnapshot()
    expect(render(<Text m={[1, 1, 3, 3]} />)).toMatchSnapshot()
  })

  it('renders padding', () => {
    expect(render(<Text p={1} />)).toHaveStyleRule('padding', '4px')
    expect(render(<Text p={[0, 1, 2, 3, 4]} />)).toMatchSnapshot()
    expect(render(<Text p={[1, 1, 3, 3]} />)).toMatchSnapshot()
  })

  it('respects color', () => {
    expect(render(<Text color="green.5" />)).toHaveStyleRule('color', colors.green[5])
    expect(render(<Text color="#f0f" />)).toHaveStyleRule('color', '#f0f')
  })

  it('respects fontWeight', () => {
    expect(render(<Text fontWeight="bold" />)).toHaveStyleRule('font-weight', 'bold')
    expect(render(<Text fontWeight="normal" />)).toHaveStyleRule('font-weight', 'normal')
  })

  it('respects lineHeight', () => {
    for (const [name, value] of Object.entries(theme.lineHeights)) {
      expect(render(<Text lineHeight={name} />)).toHaveStyleRule('line-height', String(value))
    }
  })

  it('respects fontFamily="mono"', () => {
    // emotion removes the whitespace between font-family values
    const mono = theme.fonts.mono.replace(/, /g, ',')
    expect(render(<Text fontFamily="mono" />)).toHaveStyleRule('font-family', mono)
  })

  it('respects other values for fontSize', () => {
    expect(render(<Text fontSize="2em" />)).toHaveStyleRule('font-size', '2em')
    expect(render(<Text fontSize={100} />)).toHaveStyleRule('font-size', '100px')
  })
})
