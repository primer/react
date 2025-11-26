import {render, screen} from '@testing-library/react'
import ButtonGroup, {calculateVisibleCount} from './ButtonGroup'
import {describe, expect, it} from 'vitest'

describe('ButtonGroup', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <ButtonGroup className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <div>', () => {
    const container = render(<ButtonGroup data-testid="button-group" />)
    expect(container.getByTestId('button-group').tagName).toBe('DIV')
  })

  it('should respect role prop', () => {
    render(<ButtonGroup role="toolbar" />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })
})

describe('calculateVisibleCount', () => {
  it('returns total items when container is wide enough', () => {
    const result = calculateVisibleCount({
      itemWidths: [80, 80, 80],
      containerWidth: 240,
      overflowWidth: 32,
    })

    expect(result).toBe(3)
  })

  it('returns zero when nothing fits', () => {
    const result = calculateVisibleCount({
      itemWidths: [120, 80],
      containerWidth: 60,
      overflowWidth: 32,
    })

    expect(result).toBe(0)
  })

  it('avoids leaving a single item in overflow', () => {
    const result = calculateVisibleCount({
      itemWidths: [120, 100, 100],
      containerWidth: 230,
      overflowWidth: 40,
    })

    expect(result).toBe(1)
  })
})
