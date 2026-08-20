import {render, screen} from '@testing-library/react'
import React from 'react'
import {describe, expect, it} from 'vitest'
import {useTheme as useRootTheme} from '../../useTheme'
import {ThemeProvider, useTheme} from '../../next'

describe('next ThemeProvider', () => {
  it('shares useTheme and ThemeContext with the root entrypoint', () => {
    expect(useTheme).toBe(useRootTheme)

    function RootConsumer() {
      const {colorScheme} = useRootTheme()
      return <span data-testid="root-consumer">{colorScheme}</span>
    }

    render(
      <ThemeProvider colorMode="night">
        <RootConsumer />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('root-consumer')).toHaveTextContent('dark')
  })

  it('provides CSS color scheme state without legacy JavaScript theme values', () => {
    function Consumer() {
      const {colorScheme, theme, resolvedColorScheme} = useTheme()
      return (
        <span data-testid="theme">
          {colorScheme}-{String(theme === undefined && resolvedColorScheme === undefined)}
        </span>
      )
    }

    render(
      <ThemeProvider colorMode="night">
        <Consumer />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark-true')
  })
})
