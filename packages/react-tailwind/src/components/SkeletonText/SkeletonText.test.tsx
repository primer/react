import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonText} from './SkeletonText'

describe('SkeletonText', () => {
  it('renders requested multiline skeletons on a busy root', () => {
    const ref = React.createRef<HTMLElement>()
    render(<SkeletonText ref={ref} lines={2} data-testid="text-skeleton" />)
    expect(screen.getByTestId('text-skeleton')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('text-skeleton')).toBe(ref.current)
  })
})
