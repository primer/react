import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {Text} from '../Text'
import theme from '../theme'
import {px, renderStyles} from '../utils/testing'

describe('Text', () => {
  it('renders a <span> by default', () => {
    const {container} = render(<Text />)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      const {container} = render(<Text fontSize={fontSize} />)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle(`font-size: ${px(fontSize)}`)
    }
  })

  it('renders responsive fontSize', () => {
    expect(renderStyles(<Text fontSize={[1, 2]} />)).toEqual({
      'font-size': px(theme.fontSizes[1]),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        'font-size': px(theme.fontSizes[2]),
      },
    })
  })

  it('renders responsive lineHeight', () => {
    expect(renderStyles(<Text lineHeight={['condensed', 'default']} />)).toEqual({
      'line-height': String(theme.lineHeights.condensed),
      [`@media screen and (min-width:${px(theme.breakpoints[0])})`]: {
        'line-height': String(theme.lineHeights.default),
      },
    })
  })

  it('respects fontWeight', () => {
    const {container: boldContainer} = render(<Text fontWeight="bold" />)
    const boldElement = boldContainer.firstChild as HTMLElement
    expect(boldElement).toHaveStyle('font-weight: 600')

    const {container: normalContainer} = render(<Text fontWeight="normal" />)
    const normalElement = normalContainer.firstChild as HTMLElement
    expect(normalElement).toHaveStyle('font-weight: 400')
  })

  it('respects the "fontStyle" prop', () => {
    const {container: italicContainer} = render(<Text fontStyle="italic" />)
    const italicElement = italicContainer.firstChild as HTMLElement
    expect(italicElement).toHaveStyle('font-style: italic')

    const {container: normalContainer} = render(<Text as="i" fontStyle="normal" />)
    const normalElement = normalContainer.firstChild as HTMLElement
    expect(normalElement).toHaveStyle('font-style: normal')
  })

  it('respects lineHeight', () => {
    for (const [name, value] of Object.entries(theme.lineHeights)) {
      const {container} = render(<Text lineHeight={name} />)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle(`line-height: ${String(value)}`)
    }
  })

  it('respects fontFamily="mono"', () => {
    // styled-components removes the whitespace between font-family values
    const mono = theme.fonts.mono.replace(/, /g, ',')
    const {container} = render(<Text fontFamily="mono" />)
    const element = container.firstChild as HTMLElement
    expect(element).toHaveStyle(`font-family: ${mono}`)
  })

  it('respects other values for fontSize', () => {
    const {container: emContainer} = render(<Text fontSize="2em" />)
    const emElement = emContainer.firstChild as HTMLElement
    expect(emElement).toHaveStyle('font-size: 2em')

    const {container: pxContainer} = render(<Text fontSize={100} />)
    const pxElement = pxContainer.firstChild as HTMLElement
    expect(pxElement).toHaveStyle('font-size: 100px')
  })
})
