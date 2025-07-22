import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Text} from '..'

describe('Text', () => {
  it('should support a custom `className` on the outermost element', () => {
    const Element = () => <Text className="test-class-name">Hello</Text>
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <span> by default', () => {
    render(<Text data-testid="text">Hello</Text>)
    const textElement = screen.getByTestId('text')
    expect(textElement.tagName.toLowerCase()).toBe('span')
  })

  it('supports the as prop', () => {
    render(
      <Text as="div" data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement.tagName.toLowerCase()).toBe('div')
  })

  it('renders fontSize prop', () => {
    render(
      <Text fontSize={2} data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('renders responsive fontSize', () => {
    render(
      <Text fontSize={[1, 2]} data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('renders responsive lineHeight', () => {
    render(
      <Text lineHeight={['condensed', 'default']} data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('respects fontWeight', () => {
    render(
      <Text fontWeight="bold" data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('respects the "fontStyle" prop', () => {
    render(
      <Text fontStyle="italic" data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('respects lineHeight', () => {
    render(
      <Text lineHeight="condensed" data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('respects fontFamily="mono"', () => {
    render(
      <Text fontFamily="mono" data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('respects other values for fontSize', () => {
    render(
      <Text fontSize="2em" data-testid="text">
        Hello
      </Text>,
    )
    const textElement = screen.getByTestId('text')
    expect(textElement).toBeInTheDocument()
  })

  it('passes extra props onto the container element', () => {
    render(<Text data-testid="test">Hello</Text>)
    expect(screen.getByTestId('test')).toBeInTheDocument()
  })
})
