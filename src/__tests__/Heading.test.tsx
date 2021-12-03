import React from 'react'
import {Heading} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import ThemeProvider from '../ThemeProvider'
expect.extend(toHaveNoViolations)

const theme = {
  breakpoints: ['400px', '640px', '960px', '1280px'],
  colors: {
    green: ['#010', '#020', '#030', '#040', '#050', '#060']
  },
  fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px'],
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
  behavesAsComponent({Component: Heading})

  checkExports('Heading', {
    default: Heading
  })

  it('renders <h2> by default', () => {
    expect(render(<Heading />).type).toEqual('h2')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Heading>Hello</Heading>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects fontWeight', () => {
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontWeight: 'bold'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('font-weight', theme.fontWeights.bold)
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontWeight: 'normal'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('font-weight', theme.fontWeights.normal)
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontWeight: 'semibold'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('font-weight', theme.fontWeights.semibold)
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontWeight: 'light'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('font-weight', theme.fontWeights.light)
  })

  it('respects lineHeight', () => {
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{lineHeight: 'normal'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('line-height', String(theme.lineHeights.normal))
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{lineHeight: 'condensed'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('line-height', String(theme.lineHeights.condensed))
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{lineHeight: 'condensedUltra'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('line-height', String(theme.lineHeights.condensedUltra))
  })

  it('respects fontFamily="mono"', () => {
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontFamily: 'mono'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('font-family', theme.fonts.mono)
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      expect(
        render(
          <ThemeProvider theme={theme}>
            <Heading sx={{fontSize}} />
          </ThemeProvider>
        )
      ).toHaveStyleRule('font-size', `${fontSize}`)
    }
  })

  it('respects the "fontStyle" prop', () => {
    expect(
      render(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontStyle: 'italic'}} />
        </ThemeProvider>
      )
    ).toHaveStyleRule('font-style', 'italic')
  })
})
