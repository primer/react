import {Text} from '..'
import theme from '../theme'
import {px, render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import '@testing-library/jest-dom'
import axe from 'axe-core'

describe('Text', () => {
  behavesAsComponent({Component: Text})

  checkExports('Text', {
    default: Text,
  })

  it('renders a <span> by default', () => {
    expect(render(<Text />).type).toEqual('span')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Text>hello</Text>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      const {container} = HTMLRender(<Text fontSize={fontSize} />)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle(`font-size: ${px(fontSize)}`)
    }
  })

  it('renders responsive fontSize', () => {
    expect(render(<Text fontSize={[1, 2]} />)).toHaveStyleRule('font-size', px(theme.fontSizes[1]))
    expect(render(<Text fontSize={[1, 2]} />)).toHaveStyleRule('font-size', px(theme.fontSizes[2]), {
      media: `screen and (min-width:${px(theme.breakpoints[0])})`,
    })
  })

  it('renders responsive lineHeight', () => {
    expect(render(<Text lineHeight={['condensed', 'default']} />)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.condensed),
    )
    expect(render(<Text lineHeight={['condensed', 'default']} />)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.default),
      {
        media: `screen and (min-width:${px(theme.breakpoints[0])})`,
      },
    )
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
