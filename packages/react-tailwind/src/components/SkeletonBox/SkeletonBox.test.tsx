import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonBox} from './SkeletonBox'

describe('SkeletonBox', () => {
  it('gives a named placeholder semantics that allow an accessible name', () => {
    render(<SkeletonBox aria-label="Loading preview" />)
    expect(screen.getByRole('img', {name: 'Loading preview'})).not.toHaveAttribute('aria-busy')
  })

  it('forwards root props without exposing semantics or aria-busy', () => {
    const ref = React.createRef<HTMLElement>()
    render(<SkeletonBox ref={ref} data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).not.toHaveAttribute('aria-busy')
    expect(screen.getByTestId('skeleton')).not.toHaveAttribute('role')
    expect(screen.getByTestId('skeleton')).toBe(ref.current)
  })
})
