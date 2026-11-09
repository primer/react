import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonText, type SkeletonTextProps} from './SkeletonText'

const sizes = [
  'display',
  'titleLarge',
  'titleMedium',
  'titleSmall',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'subtitle',
] satisfies NonNullable<SkeletonTextProps['size']>[]

describe('SkeletonText', () => {
  it('renders requested multiline skeletons without aria-busy', () => {
    const ref = React.createRef<HTMLElement>()
    render(<SkeletonText ref={ref} lines={2} data-testid="text-skeleton" />)
    expect(screen.getByTestId('text-skeleton')).not.toHaveAttribute('aria-busy')
    expect(screen.getByTestId('text-skeleton')).toBe(ref.current)
  })

  it.each(sizes)('uses the selected %s font height for single and multiline bars', size => {
    const {rerender} = render(<SkeletonText size={size} data-testid="text-skeleton" />)
    for (const lines of [1, 3]) {
      rerender(<SkeletonText size={size} lines={lines} data-testid="text-skeleton" />)
      const root = screen.getByTestId('text-skeleton')
      const bars = lines === 1 ? [root] : Array.from(root.children)
      expect(bars).toHaveLength(lines)
      for (const bar of bars) {
        expect(bar).toHaveAttribute('data-text-skeleton-size', size)
        expect(bar).toHaveClass('primer:h-[var(--font-size)]')
        expect(bar).not.toHaveClass('primer:h-4')
      }
    }
  })

  it('preserves consumer height, width, and max-width overrides on a single line', () => {
    render(
      <SkeletonText
        size="bodySmall"
        className="h-8"
        style={{height: 24, width: 160}}
        maxWidth={120}
        data-testid="text-skeleton"
      />,
    )
    const root = screen.getByTestId('text-skeleton')
    expect(root).toHaveClass('h-8')
    expect(root).not.toHaveClass('primer:h-[var(--font-size)]')
    expect(root).toHaveStyle({height: '24px', width: '160px', maxWidth: '120px'})
  })
})
