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
})
