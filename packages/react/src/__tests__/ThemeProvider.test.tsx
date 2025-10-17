import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {ThemeProvider, useColorSchemeVar, useTheme} from '../'

// copied from '@primer/primitives/dist/css/functional/themes/';
const fgDefaultColors = {
  light: '#1f2328',
  // eslint-disable-next-line camelcase
  light_high_contrast: '#0e1116',
  dark: '#f0f6fc',
  dark_dimmed: '#d1d7e0',
}

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

it('defaults to light color scheme', () => {
  render(
    <ThemeProvider>
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.light}`)
})

it('defaults to dark color scheme in night mode', () => {
  render(
    <ThemeProvider colorMode="night">
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.dark}`)
})

it('respects nightScheme prop', () => {
  render(
    <ThemeProvider colorMode="night" nightScheme="dark_dimmed">
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`)
})

it('works in auto mode', () => {
  render(
    <ThemeProvider colorMode="auto">
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(31, 35, 40)')
})

// TODO: need to wire up a prefers color scheme mock, vitest-matchmedia-mock?
it.skip('works in auto mode (dark)', () => {
  const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: true, // enable dark mode
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  render(
    <ThemeProvider colorMode="auto">
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.dark}`)

  matchMediaSpy.mockRestore()
})

it('updates when colorMode prop changes', async () => {
  const user = userEvent.setup()

  function App() {
    const [colorMode, setColorMode] = React.useState<'day' | 'night'>('day')
    return (
      <ThemeProvider colorMode={colorMode}>
        <span style={{color: 'var(--fgColor-default)'}}>{colorMode}</span>
        <button type="button" onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>
          Toggle
        </button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in day mode (light scheme)
  expect(screen.getByText('day')).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await user.click(screen.getByRole('button'))

  await waitFor(() =>
    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('night')).toHaveStyle(`color: ${fgDefaultColors.dark}`),
  )
})

// TODO: debug why the color is not matching
it.skip('updates when dayScheme prop changes', async () => {
  const user = userEvent.setup()

  function App() {
    const [dayScheme, setDayScheme] = React.useState('light')
    return (
      <ThemeProvider dayScheme={dayScheme}>
        <span style={{color: 'var(--fgColor-default)'}}>{dayScheme}</span>
        <button type="button" onClick={() => setDayScheme(dayScheme === 'light' ? 'light_high_contrast' : 'light')}>
          Toggle
        </button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in day mode (light scheme)
  expect(screen.getByText('light')).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await user.click(screen.getByRole('button'))

  await waitFor(() =>
    // clicking the toggle sets the day scheme to light_high_contrast
    expect(screen.getByText('light_high_contrast')).toHaveStyle(`color: ${fgDefaultColors.light_high_contrast}`),
  )
})

it('updates when nightScheme prop changes', async () => {
  const user = userEvent.setup()

  function App() {
    const [nightScheme, setNightScheme] = React.useState('dark')
    return (
      <ThemeProvider colorMode="night" nightScheme={nightScheme}>
        <span style={{color: 'var(--fgColor-default)'}}>{nightScheme}</span>
        <button type="button" onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>
          Toggle
        </button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in night mode (dark scheme)
  expect(screen.getByText('dark')).toHaveStyle(`color: ${fgDefaultColors.dark}`)

  await user.click(screen.getByRole('button'))

  await waitFor(() =>
    // clicking the toggle button sets the night scheme to dark_dimmed
    expect(screen.getByText('dark_dimmed')).toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`),
  )
})

it('inherits colorMode from parent', async () => {
  const user = userEvent.setup()

  function App() {
    const [colorMode, setcolorMode] = React.useState<'day' | 'night'>('day')
    return (
      <ThemeProvider colorMode={colorMode}>
        <button type="button" onClick={() => setcolorMode(colorMode === 'day' ? 'night' : 'day')}>
          Toggle
        </button>
        <ThemeProvider>
          <span style={{color: 'var(--fgColor-default)'}}>{colorMode}</span>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('day')).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await user.click(screen.getByRole('button'))

  await waitFor(() => expect(screen.getByText('night')).toHaveStyle(`color: ${fgDefaultColors.dark}`))
})

// TODO: debug why the color is not matching
it.skip('inherits dayScheme from parent', async () => {
  const user = userEvent.setup()

  function App() {
    const [dayScheme, setDayScheme] = React.useState('light')
    return (
      <ThemeProvider colorMode="night" dayScheme={dayScheme}>
        <button type="button" onClick={() => setDayScheme(dayScheme === 'light' ? 'light_high_contrast' : 'light')}>
          Toggle
        </button>
        <ThemeProvider colorMode="day">
          <span style={{color: 'var(--fgColor-default)'}}>{dayScheme}</span>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('light')).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await user.click(screen.getByRole('button'))

  await waitFor(() =>
    expect(screen.getByText('light_high_contrast')).toHaveStyle(`color: ${fgDefaultColors.light_high_contrast}`),
  )
})

it('inherits nightScheme from parent', async () => {
  const user = userEvent.setup()

  function App() {
    const [nightScheme, setNightScheme] = React.useState('dark')
    return (
      <ThemeProvider colorMode="day" nightScheme={nightScheme}>
        <button type="button" onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>
          Toggle
        </button>
        <ThemeProvider colorMode="night">
          <span style={{color: 'var(--fgColor-default)'}}>{nightScheme}</span>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('dark')).toHaveStyle(`color: ${fgDefaultColors.dark}`)

  await user.click(screen.getByRole('button'))

  await waitFor(() => expect(screen.getByText('dark_dimmed')).toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`))
})

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
      <ThemeProvider colorMode="day">
        <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
        <ToggleMode />
      </ThemeProvider>,
    )

    // starts in day mode (light scheme)
    expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.light}`)

    await user.click(screen.getByRole('button'))

    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.dark}`)
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
      <ThemeProvider colorMode="day">
        <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
        <ToggleDayScheme />
      </ThemeProvider>,
    )

    // starts in day mode (light scheme)
    expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.light}`)

    await user.click(screen.getByRole('button'))

    // clicking the toggle button sets day scheme to dark
    expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.dark}`)
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
      <ThemeProvider colorMode="night">
        <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
        <ToggleNightScheme />
      </ThemeProvider>,
    )

    // starts in night mode (dark scheme)
    expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.dark}`)

    await user.click(screen.getByRole('button'))

    // clicking the toggle button sets night scheme to dark_dimmed
    expect(screen.getByText('Hello')).toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`)
  })
})

describe('useColorSchemeVar', () => {
  it('updates value when scheme changes', async () => {
    const user = userEvent.setup()

    function ToggleMode() {
      const {colorMode, setColorMode} = useTheme()
      return (
        <button type="button" onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>
          Toggle
        </button>
      )
    }

    function CustomBg() {
      const customBg = useColorSchemeVar(
        {
          light: 'red',
          dark: 'blue',
          dark_dimmed: 'green',
        },
        'inherit',
      )

      return <span style={{backgroundColor: customBg}}>Hello</span>
    }

    render(
      <ThemeProvider nightScheme="dark_dimmed">
        <CustomBg />
        <ToggleMode />
      </ThemeProvider>,
    )

    expect(screen.getByText('Hello')).toHaveStyle('background-color: rgb(255, 0, 0)')

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Hello')).toHaveStyle('background-color: rgb(0, 128, 0)')
  })

  it('supports fallback value', async () => {
    const user = userEvent.setup()

    function ToggleMode() {
      const {colorMode, setColorMode} = useTheme()
      return (
        <button type="button" onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>
          Toggle
        </button>
      )
    }

    function CustomBg() {
      const customBg = useColorSchemeVar({dark: 'blue'}, 'red')

      return <span style={{backgroundColor: customBg}}>Hello</span>
    }

    render(
      <ThemeProvider>
        <CustomBg />
        <ToggleMode />
      </ThemeProvider>,
    )

    expect(screen.getByText('Hello')).toHaveStyle('background-color: rgb(255, 0, 0)')

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Hello')).toHaveStyle('background-color: rgb(0, 0, 255)')
  })
})

describe('useTheme().resolvedColorScheme', () => {
  it('is undefined when not in a theme', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <span data-testid="text">{resolvedColorScheme}</span>
    }

    render(<Component />)

    expect(screen.getByTestId('text').textContent).toEqual('')
  })

  it('is the same as the applied colorScheme, when that colorScheme is in the theme', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <span data-testid="text">{resolvedColorScheme}</span>
    }

    const schemeToApply = 'dark'

    render(
      <ThemeProvider colorMode="day" dayScheme={schemeToApply}>
        <Component />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('text').textContent).toEqual(schemeToApply)
  })

  it('is the value of the fallback colorScheme applied when attempting to apply an invalid colorScheme', () => {
    const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <span data-testid="text">{resolvedColorScheme}</span>
    }

    const schemeToApply = 'totally-invalid-colorscheme'
    render(
      <ThemeProvider colorMode="day" dayScheme={schemeToApply}>
        <Component />
      </ThemeProvider>,
    )

    const defaultThemeColorScheme = 'light'

    expect(spy).toHaveBeenCalledWith('`totally-invalid-colorscheme` scheme not defined in `theme.colorSchemes`')
    expect(defaultThemeColorScheme).not.toEqual(schemeToApply)
    expect(screen.getByTestId('text').textContent).toEqual(defaultThemeColorScheme)

    spy.mockRestore()
  })

  describe('nested theme', () => {
    it('is the same as the applied colorScheme, when that colorScheme is in the theme', () => {
      const Component = () => {
        const {resolvedColorScheme} = useTheme()

        return <span data-testid="text">{resolvedColorScheme}</span>
      }

      const schemeToApply = 'dark'

      render(
        <ThemeProvider colorMode="day" dayScheme={schemeToApply}>
          <ThemeProvider>
            <Component />
          </ThemeProvider>
        </ThemeProvider>,
      )

      expect(screen.getByTestId('text').textContent).toEqual(schemeToApply)
    })

    it('is the value of the fallback colorScheme applied when attempting to apply an invalid colorScheme', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const Component = () => {
        const {resolvedColorScheme} = useTheme()

        return <span data-testid="text">{resolvedColorScheme}</span>
      }

      const schemeToApply = 'totally-invalid-colorscheme'
      render(
        <ThemeProvider colorMode="day" dayScheme={schemeToApply}>
          <ThemeProvider>
            <Component />
          </ThemeProvider>
        </ThemeProvider>,
      )

      const defaultThemeColorScheme = 'light'

      expect(spy).toHaveBeenCalledWith('`totally-invalid-colorscheme` scheme not defined in `theme.colorSchemes`')
      expect(defaultThemeColorScheme).not.toEqual(schemeToApply)
      expect(screen.getByTestId('text').textContent).toEqual(defaultThemeColorScheme)

      spy.mockRestore()
    })
  })
})
