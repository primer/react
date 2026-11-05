import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Link} from '../Link'
import {Truncate} from './Truncate'

describe('Truncate', () => {
  it('keeps the supplied title available and forwards root props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Truncate ref={ref} title="A long branch name" data-testid="truncate">
        A long branch name
      </Truncate>,
    )
    expect(screen.getByTestId('truncate')).toHaveAttribute('title', 'A long branch name')
    expect(screen.getByTestId('truncate')).toBe(ref.current)
  })

  it('renders as a link and forwards inline to component targets', () => {
    render(
      <Truncate as={Link} href="https://github.com" title="GitHub" inline>
        GitHub
      </Truncate>,
    )

    const link = screen.getByRole('link', {name: 'GitHub'})
    expect(link).toHaveAttribute('href', 'https://github.com')
    expect(link).toHaveAttribute('data-inline', 'true')
    expect(link).toHaveClass('truncate', 'inline-block')
  })
})
