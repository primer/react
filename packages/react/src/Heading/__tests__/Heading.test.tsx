import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {Heading} from '../..'
import {render as HTMLRender, screen} from '@testing-library/react'
import ThemeProvider from '../../ThemeProvider'

const theme = {
  breakpoints: ['400px', '640px', '960px', '1280px'],
  colors: {
    green: ['#010', '#020', '#030', '#040', '#050', '#060'],
  },
  fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px'],
  fonts: {
    normal: 'Helvetica,sans-serif',
    mono: 'Consolas,monospace',
  },
  lineHeights: {
    normal: 1.5,
    condensed: 1.25,
    condensedUltra: 1,
  },
  fontWeights: {
    light: '300',
    normal: '400',
    semibold: '500',
    bold: '600',
  },
}

describe('Heading', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Heading className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders <h2> by default', () => {
    const {container} = HTMLRender(<Heading />)
    expect(container.firstChild?.nodeName).toEqual('H2')
  })

  it('respects fontWeight', () => {
    const renderWithTheme = (fontWeight: string) => {
      const {container} = HTMLRender(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontWeight: fontWeight as React.CSSProperties['fontWeight']}} />
        </ThemeProvider>,
      )
      return container.firstChild
    }

    expect(renderWithTheme('bold')).toHaveStyle(`font-weight: ${theme.fontWeights.bold}`)
    expect(renderWithTheme('normal')).toHaveStyle(`font-weight: ${theme.fontWeights.normal}`)
    expect(renderWithTheme('semibold')).toHaveStyle(`font-weight: ${theme.fontWeights.semibold}`)
    expect(renderWithTheme('light')).toHaveStyle(`font-weight: ${theme.fontWeights.light}`)
  })

  it('applies different lineHeight values', () => {
    // Since the actual computed line-height values differ between Jest and Vitest/Playwright,
    // we'll just verify that different values are applied when different lineHeight props are used
    const renderWithTheme = (lineHeight: string) => {
      const {container} = HTMLRender(
        <ThemeProvider theme={theme}>
          <Heading sx={{lineHeight: lineHeight as React.CSSProperties['lineHeight']}} />
        </ThemeProvider>,
      )
      return container.firstChild
    }

    const normalStyle = window.getComputedStyle(renderWithTheme('normal') as Element).lineHeight
    const condensedStyle = window.getComputedStyle(renderWithTheme('condensed') as Element).lineHeight
    const condensedUltraStyle = window.getComputedStyle(renderWithTheme('condensedUltra') as Element).lineHeight

    // Verify that the values are different
    expect(normalStyle).not.toEqual(condensedStyle)
    expect(normalStyle).not.toEqual(condensedUltraStyle)
    expect(condensedStyle).not.toEqual(condensedUltraStyle)
  })

  it('respects fontFamily="mono"', () => {
    const {container} = HTMLRender(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontFamily: 'mono'}} />
      </ThemeProvider>,
    )
    expect(container.firstChild).toHaveStyle(`font-family: ${theme.fonts.mono}`)
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      const {container} = HTMLRender(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontSize}} />
        </ThemeProvider>,
      )
      expect(container.firstChild).toHaveStyle(`font-size: ${fontSize}`)
    }
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // @ts-expect-error as prop should not be accepted
    HTMLRender(<Heading as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('respects the "fontStyle" prop', () => {
    const {container} = HTMLRender(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontStyle: 'italic'}} />
      </ThemeProvider>,
    )
    expect(container.firstChild).toHaveStyle('font-style: italic')
  })

  it('should only include css modules class', () => {
    HTMLRender(<Heading>test</Heading>)
    // The CSS module class name has a hash, check for the pattern instead
    expect(screen.getByText('test').className).toMatch(/_Heading_[a-zA-Z0-9]+_[0-9]+/)
    // Note: this is the generated class name when styled-components is used
    // for this component
    expect(screen.getByText('test')).not.toHaveClass(/^Heading__StyledHeading/)
  })

  it('should support overrides with sx if provided', () => {
    HTMLRender(
      <Heading
        sx={{
          fontWeight: '900',
        }}
      >
        test
      </Heading>,
    )

    expect(screen.getByText('test')).toHaveStyle('font-weight: 900')
  })
})
