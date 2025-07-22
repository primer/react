import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {PointerBox} from '..'

describe('PointerBox', () => {
  it('should support a custom `className` on the outermost element', () => {
    const Element = () => <PointerBox className="test-class-name" />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a Caret in Box with relative positioning', () => {
    render(<PointerBox data-testid="pointer-box" />)
    const pointerBox = screen.getByTestId('pointer-box')
    expect(pointerBox).toBeInTheDocument()
  })

  it('passes extra props onto the container element', () => {
    render(<PointerBox data-testid="test" />)
    expect(screen.getByTestId('test')).toBeInTheDocument()
  })
})
