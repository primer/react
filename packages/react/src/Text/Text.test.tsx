import {Text} from '..'
import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import testClasses from './Text.test.module.css'

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

  it('applies bold font weight with CSS class', () => {
    const {container} = render(<Text className={testClasses.BoldText}>Bold text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontWeight).toBe('600')
  })

  it('applies normal font weight with CSS class', () => {
    const {container} = render(<Text className={testClasses.NormalWeight}>Normal text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontWeight).toBe('400')
  })

  it('applies italic font style with CSS class', () => {
    const {container} = render(<Text className={testClasses.ItalicText}>Italic text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontStyle).toBe('italic')
  })

  it('applies normal font style with CSS class', () => {
    const {container} = render(
      <Text as="i" className={testClasses.NormalStyle}>
        Not italic
      </Text>,
    )
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontStyle).toBe('normal')
  })

  it('applies monospace font family with CSS class', () => {
    const {container} = render(<Text className={testClasses.MonoFont}>Monospace text</Text>)
    const textElement = container.firstChild as HTMLElement
    const fontFamily = getComputedStyle(textElement).fontFamily
    expect(fontFamily).toContain('mono')
  })

  it('applies large font size with CSS class', () => {
    const {container} = render(<Text className={testClasses.LargeText}>Large text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontSize).toBe('32px')
  })

  it('applies extra large font size with CSS class', () => {
    const {container} = render(<Text className={testClasses.ExtraLargeText}>Very large text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(getComputedStyle(textElement).fontSize).toBe('100px')
  })

  it('applies different font sizes with CSS classes', () => {
    // Test different fontSize values using CSS classes
    const fontSizeClasses = [testClasses.SmallFont, testClasses.MediumFont]
    for (const fontClass of fontSizeClasses) {
      const {container} = render(<Text className={fontClass}>Text</Text>)
      const textElement = container.firstChild as HTMLElement
      expect(textElement).toBeInTheDocument()
      expect(textElement).toHaveClass(fontClass)
    }
  })

  it('applies different line heights with CSS classes', () => {
    // Test different lineHeight values using CSS classes
    const lineHeightClasses = [testClasses.CondensedLine, testClasses.DefaultLine]
    for (const lineClass of lineHeightClasses) {
      const {container} = render(<Text className={lineClass}>Text</Text>)
      const textElement = container.firstChild as HTMLElement
      expect(textElement).toBeInTheDocument()
      expect(textElement).toHaveClass(lineClass)
    }
  })

  it('supports responsive font size with CSS classes', () => {
    const {container} = render(<Text className={testClasses.ResponsiveFont}>Responsive text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveClass(testClasses.ResponsiveFont)
  })

  it('supports responsive line height with CSS classes', () => {
    const {container} = render(<Text className={testClasses.ResponsiveLine}>Responsive text</Text>)
    const textElement = container.firstChild as HTMLElement
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveClass(testClasses.ResponsiveLine)
  })
})
