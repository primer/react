import React from 'react'
import Text from '../Text'
import {render} from '../utils/testing'

const theme = {
  breakpoints: ['400px', '640px', '960px', '1280px'],
  colors: {
    green: ['#010', '#020', '#030', '#040', '#050', '#060'],
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48],
  fonts: {
    normal: 'Helvetica,sans-serif',
    mono: 'Consolas,monospace'
  },
  lineHeights: {
    normal: 1.5,
    condensed: 1.25,
    condensedUltra: 1
  }
}

describe('Text', () => {
  it('renders margin', () => {
    expect(render(<Text m={1} theme={theme} />)).toHaveStyleRule('margin', '4px')
    expect(render(<Text m={[0, 1, 2, 3, 4]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Text m={[1, 1, 3, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('renders padding', () => {
    expect(render(<Text p={1} theme={theme} />)).toHaveStyleRule('padding', '4px')
    expect(render(<Text p={[0, 1, 2, 3, 4]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Text p={[1, 1, 3, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('respects color', () => {
    expect(render(<Text color="green.5" theme={theme} />)).toHaveStyleRule('color', theme.colors.green[5])
  })

  it('respects fontWeight', () => {
    expect(render(<Text fontWeight="bold" theme={theme} />)).toHaveStyleRule('font-weight', 'bold')
    expect(render(<Text fontWeight="normal" theme={theme} />)).toHaveStyleRule('font-weight', 'normal')
  })

  it('respects lineHeight', () => {
    expect(render(<Text lineHeight="normal" theme={theme} />)).toHaveStyleRule('line-height', String(theme.lineHeights.normal))
    expect(render(<Text lineHeight="condensed" theme={theme} />)).toHaveStyleRule('line-height', String(theme.lineHeights.condensed))
    expect(render(<Text lineHeight="condensedUltra" theme={theme} />)).toHaveStyleRule('line-height', String(theme.lineHeights.condensedUltra))
  })

  it('respects fontFamily="mono"', () => {
    expect(render(<Text fontFamily="mono" theme={theme} />)).toHaveStyleRule('font-family', theme.fonts.mono)
  })

  xit('respects nowrap', () => {
    expect(render(<Text nowrap theme={theme} />)).toEqual(render(<span className="no-wrap" />))
  })

  xit('renders fontSize with f* classes using inverse scale', () => {
    expect(render(<Text fontSize={0} theme={theme} />)).toEqual(render(<span className="f6" />))
    expect(render(<Text fontSize={1} theme={theme} />)).toEqual(render(<span className="f5" />))
    expect(render(<Text fontSize={2} theme={theme} />)).toEqual(render(<span className="f4" />))
    expect(render(<Text fontSize={3} theme={theme} />)).toEqual(render(<span className="f3" />))
    expect(render(<Text fontSize={4} theme={theme} />)).toEqual(render(<span className="f2" />))
    expect(render(<Text fontSize={5} theme={theme} />)).toEqual(render(<span className="f1" />))
    expect(render(<Text fontSize={6} theme={theme} />)).toEqual(render(<span className="f0" />))
  })

  xit('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<Text />)
    expect(render(<Text bugs="bar" />)).toEqual(defaultOutput)
    expect(render(<Text hidden />)).toEqual(defaultOutput)
  })

  xit('respects other values for fontSize', () => {
    expect(render(<Text fontSize="2em" theme={theme} />)).toHaveStyleRule('font-size', '2em')
    expect(render(<Text fontSize={100} theme={theme} />)).toHaveStyleRule('font-size', '100px')
  })
})
