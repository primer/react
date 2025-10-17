import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {ThemeProvider, useColorSchemeVar, useTheme} from '../ThemeProvider'
import Box from '../Box'

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

it('respects theme prop', () => {
  const theme = {
    colors: {
      text: '#f00',
    },
    space: ['0', '0.25rem'],
  }

  render(
    <ThemeProvider theme={theme}>
      <Box color="text" mb={1}>
        Hello
      </Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: #f00')
  expect(screen.getByText('Hello')).toHaveStyle('margin-bottom: 4px')
})

it('has default theme', () => {
  render(
    <ThemeProvider>
      <Box color="fg.default" mb={1}>
        Hello
      </Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toMatchSnapshot()
})

it('inherits theme from parent', () => {
  render(
    <ThemeProvider theme={exampleTheme}>
      <ThemeProvider>
        <Box color="text">Hello</Box>
      </ThemeProvider>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(0, 0, 0)')
})

it('defaults to light color scheme', () => {
  render(
    <ThemeProvider theme={exampleTheme}>
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(0, 0, 0)')
})

it('defaults to dark color scheme in night mode', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="night">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(255, 255, 255)')
})

it('defaults to first color scheme when passed an invalid color scheme name', () => {
  const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})

  render(
    <ThemeProvider theme={exampleTheme} dayScheme="foo">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(spy).toHaveBeenCalledWith('`foo` scheme not defined in `theme.colorSchemes`')
  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(0, 0, 0)')

  spy.mockRestore()
})

it('respects nightScheme prop', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="night" nightScheme="dark_dimmed">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(128, 128, 128)')
})

it('respects nightScheme prop with colorMode="dark"', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="dark" nightScheme="dark_dimmed">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(128, 128, 128)')
})

it('respects dayScheme prop', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="day" dayScheme="dark" nightScheme="dark_dimmed">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(255, 255, 255)')
})

it('respects dayScheme prop with colorMode="light"', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="light" dayScheme="dark" nightScheme="dark_dimmed">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(255, 255, 255)')
})

it('works in auto mode', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="auto">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(0, 0, 0)')
})

it('works in auto mode (dark)', () => {
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
    <ThemeProvider theme={exampleTheme} colorMode="auto">
      <Box color="text">Hello</Box>
    </ThemeProvider>,
  )

  expect(screen.getByText('Hello')).toHaveStyle('color: rgb(255, 255, 255)')

  matchMediaSpy.mockRestore()
})

it('updates when colorMode prop changes', async () => {
  const user = userEvent.setup()

  function App() {
    const [colorMode, setColorMode] = React.useState<'day' | 'night'>('day')
    return (
      <ThemeProvider theme={exampleTheme} colorMode={colorMode}>
        <Box color="text">{colorMode}</Box>
        <button type="button" onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>
          Toggle
        </button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in day mode (light scheme)
  expect(screen.getByText('day')).toHaveStyle('color: rgb(0, 0, 0)')

  await user.click(screen.getByRole('button'))

  await waitFor(() =>
    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('night')).toHaveStyle('color: rgb(255, 255, 255)'),
  )
})

it('updates when dayScheme prop changes', async () => {
  const user = userEvent.setup()

  function App() {
    const [dayScheme, setDayScheme] = React.useState('light')
    return (
      <ThemeProvider theme={exampleTheme} dayScheme={dayScheme}>
        <Box color="text">{dayScheme}</Box>
        <button type="button" onClick={() => setDayScheme(dayScheme === 'light' ? 'dark_dimmed' : 'light')}>
          Toggle
        </button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in day mode (light scheme)
  expect(screen.getByText('light')).toHaveStyle('color: rgb(0, 0, 0)')

  await user.click(screen.getByRole('button'))

  await waitFor(() =>
    // clicking the toggle sets the day scheme to dark_dimmed
    expect(screen.getByText('dark_dimmed')).toHaveStyle('color: rgb(128, 128, 128)'),
  )
})

it('updates when nightScheme prop changes', async () => {
  const user = userEvent.setup()

  function App() {
    const [nightScheme, setNightScheme] = React.useState('dark')
    return (
      <ThemeProvider theme={exampleTheme} colorMode="night" nightScheme={nightScheme}>
        <Box color="text">{nightScheme}</Box>
        <button type="button" onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>
          Toggle
        </button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in night mode (dark scheme)
  expect(screen.getByText('dark')).toHaveStyle('color: rgb(255, 255, 255)')

  await user.click(screen.getByRole('button'))

  await waitFor(() =>
    // clicking the toggle button sets the night scheme to dark_dimmed
    expect(screen.getByText('dark_dimmed')).toHaveStyle('color: rgb(128, 128, 128)'),
  )
})

it('inherits colorMode from parent', async () => {
  const user = userEvent.setup()

  function App() {
    const [colorMode, setcolorMode] = React.useState<'day' | 'night'>('day')
    return (
      <ThemeProvider theme={exampleTheme} colorMode={colorMode}>
        <button type="button" onClick={() => setcolorMode(colorMode === 'day' ? 'night' : 'day')}>
          Toggle
        </button>
        <ThemeProvider>
          <Box color="text">{colorMode}</Box>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('day')).toHaveStyle('color: rgb(0, 0, 0)')

  await user.click(screen.getByRole('button'))

  await waitFor(() => expect(screen.getByText('night')).toHaveStyle('color: rgb(255, 255, 255)'))
})

it('inherits dayScheme from parent', async () => {
  const user = userEvent.setup()

  function App() {
    const [dayScheme, setDayScheme] = React.useState('light')
    return (
      <ThemeProvider theme={exampleTheme} colorMode="night" dayScheme={dayScheme}>
        <button type="button" onClick={() => setDayScheme(dayScheme === 'light' ? 'dark_dimmed' : 'light')}>
          Toggle
        </button>
        <ThemeProvider colorMode="day">
          <Box color="text">{dayScheme}</Box>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('light')).toHaveStyle('color: rgb(0, 0, 0)')

  await user.click(screen.getByRole('button'))

  await waitFor(() => expect(screen.getByText('dark_dimmed')).toHaveStyle('color: rgb(128, 128, 128)'))
})

it('inherits nightScheme from parent', async () => {
  const user = userEvent.setup()

  function App() {
    const [nightScheme, setNightScheme] = React.useState('dark')
    return (
      <ThemeProvider theme={exampleTheme} colorMode="day" nightScheme={nightScheme}>
        <button type="button" onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>
          Toggle
        </button>
        <ThemeProvider colorMode="night">
          <Box color="text">{nightScheme}</Box>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('dark')).toHaveStyle('color: rgb(255, 255, 255)')

  await user.click(screen.getByRole('button'))

  await waitFor(() => expect(screen.getByText('dark_dimmed')).toHaveStyle('color: rgb(128, 128, 128)'))
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
      <ThemeProvider theme={exampleTheme} colorMode="day">
        <Box color="text">Hello</Box>
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
        <Box color="text">Hello</Box>
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
        <Box color="text">Hello</Box>
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

      return <Box bg={customBg}>Hello</Box>
    }

    render(
      <ThemeProvider theme={exampleTheme} nightScheme="dark_dimmed">
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

      return <Box bg={customBg}>Hello</Box>
    }

    render(
      <ThemeProvider theme={exampleTheme}>
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

      return <Box data-testid="text">{resolvedColorScheme}</Box>
    }

    render(<Component />)

    expect(screen.getByTestId('text').textContent).toEqual('')
  })

  it('is undefined when the theme has no colorScheme object', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <Box data-testid="text">{resolvedColorScheme}</Box>
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

      return <Box data-testid="text">{resolvedColorScheme}</Box>
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

      return <Box data-testid="text">{resolvedColorScheme}</Box>
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

        return <Box data-testid="text">{resolvedColorScheme}</Box>
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

        return <Box data-testid="text">{resolvedColorScheme}</Box>
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
