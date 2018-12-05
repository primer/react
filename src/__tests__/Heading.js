/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react'
import {Heading} from '..'
import {render, mount} from '../utils/testing'

const theme = {
  breakpoints: ['400px', '640px', '960px', '1280px'],
  colors: {
    green: ['#010', '#020', '#030', '#040', '#050', '#060']
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
  },
  fontWeights: {
    light: '300',
    normal: '400',
    semibold: '500',
    bold: '600'
  }
}

describe('Heading', () => {
  it('renders <h1> by default', () => {
    expect(render(mount(<Heading />)).type).toEqual('h1')
  })

  it('respects the is prop', () => {
    expect(render(mount(<Heading is="h6" />)).type).toEqual('h6')
  })

  it('respects fontWeight', () => {
    expect(render(mount(<Heading fontWeight="bold" theme={theme} />))).toHaveStyleRule('font-weight', theme.fontWeights.bold)
    expect(render(mount(<Heading fontWeight="normal" theme={theme} />))).toHaveStyleRule(
      'font-weight',
      theme.fontWeights.normal
    )
    expect(render(mount(<Heading fontWeight="semibold" theme={theme} />))).toHaveStyleRule(
      'font-weight',
      theme.fontWeights.semibold
    )
    expect(render(mount(<Heading fontWeight="light" theme={theme} />))).toHaveStyleRule('font-weight', theme.fontWeights.light)
  })

  it('respects lineHeight', () => {
    expect(render(mount(<Heading lineHeight="normal" theme={theme} />))).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.normal)
    )
    expect(render(mount(<Heading lineHeight="condensed" theme={theme} />))).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.condensed)
    )
    expect(render(mount(<Heading lineHeight="condensedUltra" theme={theme} />))).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.condensedUltra)
    )
  })

  it('respects fontFamily="mono"', () => {
    expect(render(mount(<Heading fontFamily="mono" theme={theme} />))).toHaveStyleRule('font-family', theme.fonts.mono)
  })

  xit('respects nowrap', () => {
    expect(render(mount(<Heading nowrap theme={theme} />))).toEqual(render(<span className="no-wrap" />))
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      expect(render(mount(<Heading fontSize={fontSize} theme={theme} />))).toHaveStyleRule('font-size', `${fontSize}px`)
    }
  })

  xit('renders fontSize with f* classes using inverse scale', () => {
    expect(render(mount(<Heading fontSize={0} theme={theme} />))).toEqual(render(<span className="f6" />))
    expect(render(mount(<Heading fontSize={1} theme={theme} />))).toEqual(render(<span className="f5" />))
    expect(render(mount(<Heading fontSize={2} theme={theme} />))).toEqual(render(<span className="f4" />))
    expect(render(mount(<Heading fontSize={3} theme={theme} />))).toEqual(render(<span className="f3" />))
    expect(render(mount(<Heading fontSize={4} theme={theme} />))).toEqual(render(<span className="f2" />))
    expect(render(mount(<Heading fontSize={5} theme={theme} />))).toEqual(render(<span className="f1" />))
    expect(render(mount(<Heading fontSize={6} theme={theme} />))).toEqual(render(<span className="f0" />))
  })

  xit('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<Heading />)
    expect(render(mount(<Heading bugs="bar" />))).toEqual(defaultOutput)
    expect(render(mount(<Heading hidden />))).toEqual(defaultOutput)
  })

  xit('respects other values for fontSize', () => {
    expect(render(mount(<Heading fontSize="2em" theme={theme} />))).toHaveStyleRule('font-size', '2em')
    expect(render(mount(<Heading fontSize={100} theme={theme} />))).toHaveStyleRule('font-size', '100px')
  })
})
