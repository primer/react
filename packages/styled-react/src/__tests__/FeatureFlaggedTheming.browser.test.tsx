import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {ThemeProvider, useTheme, BaseStyles} from '../'
import {FeatureFlags} from '@primer/react/experimental'

// window.matchMedia() is not implemented by JSDOM so we have to create a mock:
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('FeatureFlaggedTheming', () => {
  describe('when primer_react_styled_react_use_primer_theme_providers is disabled', () => {
    it('ThemeProvider does not render a wrapper div with data-color-mode', () => {
      render(
        <FeatureFlags flags={{primer_react_styled_react_use_primer_theme_providers: false}}>
          <ThemeProvider>
            <div data-testid="child">Hello</div>
          </ThemeProvider>
        </FeatureFlags>,
      )

      // The styled ThemeProvider uses styled-components SCThemeProvider which
      // does not inject a wrapper div. The child should not have a parent with data-color-mode.
      const child = screen.getByTestId('child')
      expect(child.parentElement).not.toHaveAttribute('data-color-mode')
    })

    it('useTheme returns styled theme context values', () => {
      function ThemeConsumer() {
        const theme = useTheme()
        return <div data-testid="theme-consumer">{theme.colorMode ?? 'day'}</div>
      }

      render(
        <FeatureFlags flags={{primer_react_styled_react_use_primer_theme_providers: false}}>
          <ThemeProvider colorMode="night">
            <ThemeConsumer />
          </ThemeProvider>
        </FeatureFlags>,
      )

      expect(screen.getByTestId('theme-consumer')).toHaveTextContent('night')
    })

    it('BaseStyles renders with data-color-mode and without data-component', () => {
      render(
        <FeatureFlags flags={{primer_react_styled_react_use_primer_theme_providers: false}}>
          <ThemeProvider>
            <BaseStyles data-testid="base-styles">
              <div>Hello</div>
            </BaseStyles>
          </ThemeProvider>
        </FeatureFlags>,
      )

      const baseStyles = screen.getByTestId('base-styles')
      expect(baseStyles).toHaveAttribute('data-color-mode')
      expect(baseStyles).toHaveAttribute('data-light-theme')
      expect(baseStyles).toHaveAttribute('data-dark-theme')
      expect(baseStyles).not.toHaveAttribute('data-component')
    })
  })

  describe('when primer_react_styled_react_use_primer_theme_providers is enabled', () => {
    it('ThemeProvider renders a wrapper div with data-color-mode', () => {
      render(
        <FeatureFlags flags={{primer_react_styled_react_use_primer_theme_providers: true}}>
          <ThemeProvider>
            <div data-testid="child">Hello</div>
          </ThemeProvider>
        </FeatureFlags>,
      )

      // The @primer/react ThemeProvider renders a <div> with data-color-mode
      const child = screen.getByTestId('child')
      expect(child.parentElement).toHaveAttribute('data-color-mode')
      expect(child.parentElement).toHaveAttribute('data-light-theme')
      expect(child.parentElement).toHaveAttribute('data-dark-theme')
    })

    it('useTheme returns primer theme context values', () => {
      function ThemeConsumer() {
        const theme = useTheme()
        return <div data-testid="theme-consumer">{theme.colorMode ?? 'day'}</div>
      }

      render(
        <FeatureFlags flags={{primer_react_styled_react_use_primer_theme_providers: true}}>
          <ThemeProvider colorMode="night">
            <ThemeConsumer />
          </ThemeProvider>
        </FeatureFlags>,
      )

      expect(screen.getByTestId('theme-consumer')).toHaveTextContent('night')
    })

    it('BaseStyles renders with data-component and without data-color-mode', () => {
      render(
        <FeatureFlags flags={{primer_react_styled_react_use_primer_theme_providers: true}}>
          <ThemeProvider>
            <BaseStyles data-testid="base-styles">
              <div>Hello</div>
            </BaseStyles>
          </ThemeProvider>
        </FeatureFlags>,
      )

      const baseStyles = screen.getByTestId('base-styles')
      expect(baseStyles).toHaveAttribute('data-component', 'BaseStyles')
      expect(baseStyles).not.toHaveAttribute('data-color-mode')
      expect(baseStyles).not.toHaveAttribute('data-light-theme')
      expect(baseStyles).not.toHaveAttribute('data-dark-theme')
    })
  })
})
