import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonAvatar} from './SkeletonAvatar'

describe('SkeletonAvatar', () => {
  it('composes SkeletonBox and forwards root props', () => {
    const ref = React.createRef<HTMLElement>()
    render(<SkeletonAvatar ref={ref} data-testid="avatar-skeleton" />)
    expect(screen.getByTestId('avatar-skeleton')).toHaveAttribute('data-component', 'SkeletonAvatar')
    expect(screen.getByTestId('avatar-skeleton')).toBe(ref.current)
    expect(screen.getByTestId('avatar-skeleton')).toHaveClass('inline-block', 'leading-none')
  })

  it('exposes responsive and square states', () => {
    const {container} = render(<SkeletonAvatar size={{narrow: 20, regular: 32, wide: 40}} square />)

    expect(container.querySelector('[data-component="SkeletonAvatar"]')).toHaveAttribute('data-responsive', '')
    expect(container.querySelector('[data-component="SkeletonAvatar"]')).toHaveAttribute('data-square', '')
  })
})
