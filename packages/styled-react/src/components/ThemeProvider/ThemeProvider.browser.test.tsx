import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {Text, ThemeProvider, useTheme} from '../..'

// window.matchMedia() is not implemented by JSDOM so we have to create a mock:
// https://vijs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

const exampleTheme = {
  colors: {
    text: '#f00',
  },
  colorSchemes: {
    light: {
      colors: {
        text: 'black',
      },
    },
    dark: {
      colors: {
        text: 'white',
      },
    },
    dark_dimmed: {
      colors: {
        text: 'gray',
      },
    },
  },
}

describe('setColorMode', () => {
  it('changes the color mode', async () => {
    const user = userEvent.setup()

    function ToggleMode() {
      const {colorMode, setColorMode} = useTheme()
      return (
        <button type="button" onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>
          Toggle
        </button>
      )
    }

    render(
      <ThemeProvider theme={exampleTheme} colorMode="day">
        <Text color="text">Hello</Text>
        <ToggleMode />
      </ThemeProvider>,
    )

    // starts in day mode (light scheme)
    expect(screen.getByText('Hello')).toHaveStyle('color: rgb(0, 0, 0)')

    await user.click(screen.getByRole('button'))

    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('Hello')).toHaveStyle('color: rgb(255, 255, 255)')
  })
})

describe('setDayScheme', () => {
  it('changes the day scheme', async () => {
    const user = userEvent.setup()

    function ToggleDayScheme() {
      const {dayScheme, setDayScheme} = useTheme()
      return (
        <button type="button" onClick={() => setDayScheme(dayScheme === 'light' ? 'dark' : 'light')}>
          Toggle
        </button>
      )
    }

    render(
      <ThemeProvider theme={exampleTheme} colorMode="day">
        <Text color="text">Hello</Text>
        <ToggleDayScheme />
      </ThemeProvider>,
    )

    // starts in day mode (light scheme)
    expect(screen.getByText('Hello')).toHaveStyle('color: rgb(0, 0, 0)')

    await user.click(screen.getByRole('button'))

    // clicking the toggle button sets day scheme to dark
    expect(screen.getByText('Hello')).toHaveStyle('color: rgb(255, 255, 255)')
  })
})

describe('setNightScheme', () => {
  it('changes the night scheme', async () => {
    const user = userEvent.setup()

    function ToggleNightScheme() {
      const {nightScheme, setNightScheme} = useTheme()
      return (
        <button type="button" onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>
          Toggle
        </button>
      )
    }

    render(
      <ThemeProvider theme={exampleTheme} colorMode="night">
        <Text color="text">Hello</Text>
        <ToggleNightScheme />
      </ThemeProvider>,
    )

    // starts in night mode (dark scheme)
    expect(screen.getByText('Hello')).toHaveStyle('color: rgb(255, 255, 255)')

    await user.click(screen.getByRole('button'))

    // clicking the toggle button sets night scheme to dark_dimmed
    expect(screen.getByText('Hello')).toHaveStyle('color: rgb(128, 128, 128)')
  })
})

describe('useTheme().resolvedColorScheme', () => {
  it('is undefined when not in a theme', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <Text data-testid="text">{resolvedColorScheme}</Text>
    }

    render(<Component />)

    expect(screen.getByTestId('text').textContent).toEqual('')
  })

  it('is undefined when the theme has no colorScheme object', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <Text data-testid="text">{resolvedColorScheme}</Text>
    }

    render(
      <ThemeProvider theme={{color: 'red'}}>
        <Component />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('text').textContent).toEqual('')
  })

  it('is the same as the applied colorScheme, when that colorScheme is in the theme', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <Text data-testid="text">{resolvedColorScheme}</Text>
    }

    const schemeToApply = 'dark'

    render(
      <ThemeProvider theme={exampleTheme} colorMode="day" dayScheme={schemeToApply}>
        <Component />
      </ThemeProvider>,
    )

    expect(exampleTheme.colorSchemes).toHaveProperty(schemeToApply)
    expect(screen.getByTestId('text').textContent).toEqual(schemeToApply)
  })

  it('is the value of the fallback colorScheme applied when attempting to apply an invalid colorScheme', () => {
    const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <Text data-testid="text">{resolvedColorScheme}</Text>
    }

    const schemeToApply = 'totally-invalid-colorscheme'
    render(
      <ThemeProvider theme={exampleTheme} colorMode="day" dayScheme={schemeToApply}>
        <Component />
      </ThemeProvider>,
    )

    const defaultThemeColorScheme = Object.keys(exampleTheme.colorSchemes)[0]

    expect(spy).toHaveBeenCalledWith('`totally-invalid-colorscheme` scheme not defined in `theme.colorSchemes`')
    expect(defaultThemeColorScheme).not.toEqual(schemeToApply)
    expect(exampleTheme.colorSchemes).not.toHaveProperty(schemeToApply)
    expect(screen.getByTestId('text').textContent).toEqual('light')

    spy.mockRestore()
  })

  describe('nested theme', () => {
    it('is the same as the applied colorScheme, when that colorScheme is in the theme', () => {
      const Component = () => {
        const {resolvedColorScheme} = useTheme()

        return <Text data-testid="text">{resolvedColorScheme}</Text>
      }

      const schemeToApply = 'dark'

      render(
        <ThemeProvider theme={exampleTheme} colorMode="day" dayScheme={schemeToApply}>
          <ThemeProvider>
            <Component />
          </ThemeProvider>
        </ThemeProvider>,
      )

      expect(exampleTheme.colorSchemes).toHaveProperty(schemeToApply)
      expect(screen.getByTestId('text').textContent).toEqual(schemeToApply)
    })

    it('is the value of the fallback colorScheme applied when attempting to apply an invalid colorScheme', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const Component = () => {
        const {resolvedColorScheme} = useTheme()

        return <Text data-testid="text">{resolvedColorScheme}</Text>
      }

      const schemeToApply = 'totally-invalid-colorscheme'
      render(
        <ThemeProvider theme={exampleTheme} colorMode="day" dayScheme={schemeToApply}>
          <ThemeProvider>
            <Component />
          </ThemeProvider>
        </ThemeProvider>,
      )

      const defaultThemeColorScheme = Object.keys(exampleTheme.colorSchemes)[0]

      expect(spy).toHaveBeenCalledWith('`totally-invalid-colorscheme` scheme not defined in `theme.colorSchemes`')
      expect(defaultThemeColorScheme).not.toEqual(schemeToApply)
      expect(exampleTheme.colorSchemes).not.toHaveProperty(schemeToApply)
      expect(screen.getByTestId('text').textContent).toEqual('light')

      spy.mockRestore()
    })
  })
})
