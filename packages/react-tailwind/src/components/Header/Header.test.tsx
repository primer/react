import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Header} from './Header'

describe('Header', () => {
  it('uses a header landmark and forwards props to its root', () => {
    render(<Header data-testid="header">Content</Header>)
    expect(screen.getByTestId('header')).toHaveAttribute('data-component', 'Header')
    expect(screen.getByTestId('header')).toHaveClass(
      'primer:text-sm',
      'primer:text-[color:var(--header-fgColor-default)]',
    )
  })
})
