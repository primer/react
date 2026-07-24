import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SubNav} from './SubNav'

describe('SubNav', () => {
  it('labels navigation and exposes the selected link as the current page', () => {
    render(
      <SubNav label="Repository">
        <SubNav.Links>
          <SubNav.Link href="/" selected>
            Code
          </SubNav.Link>
        </SubNav.Links>
      </SubNav>,
    )
    expect(screen.getByRole('navigation', {name: 'Repository'})).toBeVisible()
    expect(screen.getByRole('link', {name: 'Code'})).toHaveAttribute('aria-current', 'page')
  })

  it('preserves an explicit aria-label over the convenience label prop', () => {
    render(
      <SubNav aria-label="Repository navigation" label="Repository">
        Content
      </SubNav>,
    )
    expect(screen.getByRole('navigation', {name: 'Repository navigation'})).toBeVisible()
  })
})
