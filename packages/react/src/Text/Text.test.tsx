import {Text} from '..'
import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'

describe('Text', () => {
  it('renders a <span> by default', () => {
    const {container} = render(<Text />)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
  })

  it('renders children', () => {
    const {getByText} = render(<Text>Hello World</Text>)
    expect(getByText('Hello World')).toBeInTheDocument()
  })

  it('accepts className', () => {
    const {container} = render(<Text className="test-class">Hello</Text>)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('renders as different element when as prop is provided', () => {
    const {container} = render(<Text as="p">Hello</Text>)
    expect(container.firstChild?.nodeName).toEqual('P')
  })

  it('passes through other props', () => {
    const {container} = render(<Text data-testid="text-element">Hello</Text>)
    expect(container.firstChild).toHaveAttribute('data-testid', 'text-element')
  })

  it('respects fontWeight', () => {
    const {container} = render(<Text fontWeight="bold">Bold text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontWeight).toBe('700')
  })

  it('respects fontWeight normal', () => {
    const {container} = render(<Text fontWeight="normal">Normal text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontWeight).toBe('400')
  })

  it('respects the "fontStyle" prop', () => {
    const {container} = render(<Text fontStyle="italic">Italic text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontStyle).toBe('italic')
  })

  it('respects fontStyle normal', () => {
    const {container} = render(
      <Text as="i" fontStyle="normal">
        Not italic
      </Text>,
    )
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontStyle).toBe('normal')
  })

  it('respects fontFamily="mono"', () => {
    const {container} = render(<Text fontFamily="mono">Monospace text</Text>)
    const textElement = container.firstChild as HTMLElement
    const fontFamily = getComputedStyle(textElement).fontFamily
    expect(fontFamily).toContain('mono')
  })

  it('respects other values for fontSize', () => {
    const {container} = render(<Text fontSize="2em">Large text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontSize).toBe('32px')
  })

  it('respects numeric fontSize values', () => {
    const {container} = render(<Text fontSize={100}>Very large text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontSize).toBe('100px')
  })

  it('applies theme fontSize values', () => {
    // Test different fontSize values from the theme
    const fontSizes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (const size of fontSizes) {
      const {container} = render(<Text fontSize={size}>Text</Text>)
      const textElement = container.firstChild as HTMLElement
      expect(textElement).toBeInTheDocument()
    }
  })

  it('applies theme lineHeight values', () => {
    // Test different lineHeight values
    const lineHeights = ['condensed', 'condensedUltra', 'default']
    for (const lineHeight of lineHeights) {
      const {container} = render(<Text lineHeight={lineHeight}>Text</Text>)
      const textElement = container.firstChild as HTMLElement
      expect(textElement).toBeInTheDocument()
    }
  })

  it('supports responsive fontSize arrays', () => {
    const {container} = render(<Text fontSize={[1, 2]}>Responsive text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(textElement).toBeInTheDocument()
  })

  it('supports responsive lineHeight arrays', () => {
    const {container} = render(<Text lineHeight={['condensed', 'default']}>Responsive text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(textElement).toBeInTheDocument()
  })
})
