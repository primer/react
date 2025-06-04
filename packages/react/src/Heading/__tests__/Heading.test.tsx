import {Heading} from '../..'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender, screen} from '@testing-library/react'
import axe from 'axe-core'

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
  behavesAsComponent({Component: Heading})

  checkExports('Heading', {
    default: Heading,
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Heading className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders <h2> by default', () => {
    expect(render(<Heading />).type).toEqual('h2')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Heading>Hello</Heading>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects fontWeight', () => {
    expect(render(<Heading sx={{fontWeight: 'bold'}} />, theme)).toHaveStyleRule('font-weight', theme.fontWeights.bold)
    expect(render(<Heading sx={{fontWeight: 'normal'}} />, theme)).toHaveStyleRule(
      'font-weight',
      theme.fontWeights.normal,
    )
    expect(render(<Heading sx={{fontWeight: 'semibold'}} />, theme)).toHaveStyleRule(
      'font-weight',
      theme.fontWeights.semibold,
    )
    expect(render(<Heading sx={{fontWeight: 'light'}} />, theme)).toHaveStyleRule(
      'font-weight',
      theme.fontWeights.light,
    )
  })

  it('respects lineHeight', () => {
    expect(render(<Heading sx={{lineHeight: 'normal'}} />, theme)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.normal),
    )
    expect(render(<Heading sx={{lineHeight: 'condensed'}} />, theme)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.condensed),
    )
    expect(render(<Heading sx={{lineHeight: 'condensedUltra'}} />, theme)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.condensedUltra),
    )
  })

  it('respects fontFamily="mono"', () => {
    expect(render(<Heading sx={{fontFamily: 'mono'}} />, theme)).toHaveStyleRule('font-family', theme.fonts.mono)
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      expect(render(<Heading sx={{fontSize}} />, theme)).toHaveStyleRule('font-size', `${fontSize}`)
    }
  })
  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation()

    // @ts-expect-error as prop should not be accepted
    HTMLRender(<Heading as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('respects the "fontStyle" prop', () => {
    expect(render(<Heading sx={{fontStyle: 'italic'}} />, theme)).toHaveStyleRule('font-style', 'italic')
  })

  it('should only include css modules class', () => {
    HTMLRender(<Heading>test</Heading>)
    expect(screen.getByText('test')).toHaveClass('Heading')
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
