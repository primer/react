import {render, screen} from '@testing-library/react'
import React from 'react'
import {describe, expect, it} from 'vitest'
import {UnderlineNav} from './UnderlineNav'

describe('UnderlineNav', () => {
  it('retains semantic navigation, list, and current-link states', () => {
    render(
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.List>
          <UnderlineNav.Item href="/code" aria-current="page">
            Code
          </UnderlineNav.Item>
          <UnderlineNav.Item href="/issues" counter={3}>
            Issues
          </UnderlineNav.Item>
        </UnderlineNav.List>
      </UnderlineNav>,
    )
    expect(screen.getByRole('navigation', {name: 'Repository'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /Code/})).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('list')).toHaveClass('flex')
  })
})
