import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {BaseStyles} from './BaseStyles'
import {ThemeProvider} from './ThemeProvider'

describe('ThemeProvider', () => {
  it('applies theme attributes and DOM props to the root', () => {
    render(
      <ThemeProvider
        colorMode="dark"
        dayScheme="light-high-contrast"
        nightScheme="dark-high-contrast"
        data-testid="theme"
      >
        content
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveAttribute('data-color-mode', 'dark')
    expect(screen.getByTestId('theme')).toHaveAttribute('data-light-theme', 'light-high-contrast')
    expect(screen.getByTestId('theme')).toHaveAttribute('data-dark-theme', 'dark-high-contrast')
  })

  it('derives the rendered color mode from the active scheme', () => {
    render(
      <ThemeProvider colorMode="day" dayScheme="dark" nightScheme="dark" data-testid="scheme-theme">
        content
      </ThemeProvider>,
    )

    expect(screen.getByTestId('scheme-theme')).toHaveAttribute('data-color-mode', 'dark')
  })
})

describe('BaseStyles', () => {
  it('applies DOM props to the root', () => {
    render(<BaseStyles data-testid="base">content</BaseStyles>)

    expect(screen.getByTestId('base')).toHaveAttribute('data-component', 'BaseStyles')
    expect(screen.getByTestId('base')).toHaveAttribute('data-portal-root')
  })
})
