import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Link} from './Link'

describe('Link', () => {
  it('renders an accessible anchor and forwards root props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Link ref={ref} href="#target" data-testid="link">
        Target
      </Link>,
    )
    expect(screen.getByRole('link', {name: 'Target'})).toHaveAttribute('href', '#target')
    expect(screen.getByTestId('link')).toBe(ref.current)
  })
})
