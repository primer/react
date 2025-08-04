import {describe, expect, it, vi} from 'vitest'
import {Heading} from '../..'
import {render, screen} from '@testing-library/react'
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
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders <h2> by default', () => {
    const {container} = render(<Heading />)
    const heading = container.firstChild as HTMLElement
    expect(heading.tagName).toBe('H2')
  })

  it('respects fontWeight', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontWeight: 'bold'}} />
      </ThemeProvider>,
    )
    const heading = container.firstChild as HTMLElement
    expect(heading).toHaveStyle(`font-weight: ${theme.fontWeights.bold}`)

    const {container: container2} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontWeight: 'normal'}} />
      </ThemeProvider>,
    )
    const heading2 = container2.firstChild as HTMLElement
    expect(heading2).toHaveStyle(`font-weight: ${theme.fontWeights.normal}`)

    const {container: container3} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontWeight: 'semibold'}} />
      </ThemeProvider>,
    )
    const heading3 = container3.firstChild as HTMLElement
    expect(heading3).toHaveStyle(`font-weight: ${theme.fontWeights.semibold}`)

    const {container: container4} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontWeight: 'light'}} />
      </ThemeProvider>,
    )
    const heading4 = container4.firstChild as HTMLElement
    expect(heading4).toHaveStyle(`font-weight: ${theme.fontWeights.light}`)
  })

  it('respects lineHeight', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{lineHeight: 'normal'}} />
      </ThemeProvider>,
    )
    const heading = container.firstChild as HTMLElement
    ///These sx tests should go away right?
    expect(heading).toHaveStyle(`line-height: 48px`)

    const {container: container2} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{lineHeight: 'condensed'}} />
      </ThemeProvider>,
    )
    const heading2 = container2.firstChild as HTMLElement
    expect(heading2).toHaveStyle(`line-height: 40px`)

    const {container: container3} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{lineHeight: 'condensedUltra'}} />
      </ThemeProvider>,
    )
    const heading3 = container3.firstChild as HTMLElement
    expect(heading3).toHaveStyle(`line-height: 32px`)
  })

  it('respects fontFamily="mono"', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontFamily: 'mono'}} />
      </ThemeProvider>,
    )
    const heading = container.firstChild as HTMLElement
    expect(heading).toHaveStyle(`font-family: ${theme.fonts.mono}`)
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      const {container} = render(
        <ThemeProvider theme={theme}>
          <Heading sx={{fontSize}} />
        </ThemeProvider>,
      )
      const heading = container.firstChild as HTMLElement
      expect(heading).toHaveStyle(`font-size: ${fontSize}`)
    }
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})

    // @ts-expect-error as prop should not be accepted
    render(<Heading as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
  it('respects the "fontStyle" prop', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <Heading sx={{fontStyle: 'italic'}} />
      </ThemeProvider>,
    )
    const heading = container.firstChild as HTMLElement
    expect(heading).toHaveStyle('font-style: italic')
  })

  // How can we test for generated class names?
  it.skip('should only include css modules class', () => {
    render(<Heading>test</Heading>)
    expect(screen.getByText('test')).toHaveClass('prc-Heading-Heading-6CmGO')
    // Note: this is the generated class name when CSS modules is used
    // for this component
    expect(screen.getByText('test')).not.toHaveClass(/^Heading__StyledHeading/)
  })

  it('should support overrides with sx if provided', () => {
    render(
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
