import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonBox} from './SkeletonBox'

describe('SkeletonBox', () => {
  it('forwards root props and marks loading content busy', () => {
    const ref = React.createRef<HTMLElement>()
    render(<SkeletonBox ref={ref} data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByTestId('skeleton')).toBe(ref.current)
  })
})
