import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Avatar} from './Avatar'

describe('Avatar', () => {
  it('uses image semantics and forwards root props', () => {
    const ref = React.createRef<HTMLImageElement>()
    render(<Avatar ref={ref} src="/avatar.png" alt="Mona" data-testid="avatar" />)
    expect(screen.getByRole('img', {name: 'Mona'})).toBe(ref.current)
    expect(screen.getByTestId('avatar')).toHaveAttribute('data-component', 'Avatar')
  })

  it('uses numeric sizes for rendered dimensions', () => {
    const {container} = render(<Avatar alt="Mona" size={32} src="/avatar.png" />)

    expect(container.querySelector('img')).toHaveStyle({width: '32px', height: '32px'})
  })

  it('keeps the shared visual treatment for responsive sizes', () => {
    const {getByRole} = render(
      <Avatar alt="Responsive Mona" size={{narrow: 20, regular: 32, wide: 40}} src="/avatar.png" />,
    )
    const avatar = getByRole('img', {name: 'Responsive Mona'})

    expect(avatar).toHaveAttribute('data-responsive', '')
    expect(avatar).toHaveClass('primer:inline-block', 'primer:shadow-[0_0_0_1px_var(--avatar-borderColor)]')
  })
})
