import {render, screen, waitFor} from '@testing-library/react'
import 'jest-styled-components'
import React from 'react'
import {Text, ThemeProvider, useColorSchemeVar, useTheme} from '..'

// window.matchMedia() is not implemented by JSDOM so we have to create a mock:
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

const exampleTheme = {
  colors: {
    text: '#f00'
  },
  colorSchemes: {
    light: {
      colors: {
        text: 'black'
      }
    },
    dark: {
      colors: {
        text: 'white'
      }
    },
    dark_dimmed: {
      colors: {
        text: 'gray'
      }
    }
  }
}

it('respects theme prop', () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    space: ['0', '0.25rem']
  }

  render(
    <ThemeProvider theme={theme}>
      <Text color="text" mb={1}>
        Hello
      </Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#f00')
  expect(screen.getByText('Hello')).toHaveStyleRule('margin-bottom', '0.25rem')
})

it('has default theme', () => {
  render(
    <ThemeProvider>
      <Text color="fg.default" mb={1}>
        Hello
      </Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toMatchSnapshot()
})

it('inherits theme from parent', () => {
  render(
    <ThemeProvider theme={exampleTheme}>
      <ThemeProvider>
        <Text color="text">Hello</Text>
      </ThemeProvider>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'black')
})

it('defaults to light color scheme', () => {
  render(
    <ThemeProvider theme={exampleTheme}>
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'black')
})

it('defaults to dark color scheme in night mode', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="night">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'white')
})

it('defaults to first color scheme when passed an invalid color scheme name', () => {
  render(
    <ThemeProvider theme={exampleTheme} dayScheme="foo">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'black')
})

it('respects nightScheme prop', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="night" nightScheme="dark_dimmed">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'gray')
})

it('respects dayScheme prop', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="day" dayScheme="dark" nightScheme="dark_dimmed">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'white')
})

it('works in auto mode', () => {
  render(
    <ThemeProvider theme={exampleTheme} colorMode="auto">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'black')
})

it('works in auto mode (dark)', () => {
  const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: true, // enable dark mode
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))

  render(
    <ThemeProvider theme={exampleTheme} colorMode="auto">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', 'white')

  matchMediaSpy.mockRestore()
})

it('updates when colorMode prop changes', async () => {
  function App() {
    const [colorMode, setColorMode] = React.useState<'day' | 'night'>('day')
    return (
      <ThemeProvider theme={exampleTheme} colorMode={colorMode}>
        <Text color="text">{colorMode}</Text>
        <button onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>Toggle</button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in day mode (light scheme)
  expect(screen.getByText('day')).toHaveStyleRule('color', 'black')

  screen.getByRole('button').click()

  await waitFor(() =>
    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('night')).toHaveStyleRule('color', 'white')
  )
})

it('updates when dayScheme prop changes', async () => {
  function App() {
    const [dayScheme, setDayScheme] = React.useState('light')
    return (
      <ThemeProvider theme={exampleTheme} dayScheme={dayScheme}>
        <Text color="text">{dayScheme}</Text>
        <button onClick={() => setDayScheme(dayScheme === 'light' ? 'dark_dimmed' : 'light')}>Toggle</button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in day mode (light scheme)
  expect(screen.getByText('light')).toHaveStyleRule('color', 'black')

  screen.getByRole('button').click()

  await waitFor(() =>
    // clicking the toggle sets the day scheme to dark_dimmed
    expect(screen.getByText('dark_dimmed')).toHaveStyleRule('color', 'gray')
  )
})

it('updates when nightScheme prop changes', async () => {
  function App() {
    const [nightScheme, setNightScheme] = React.useState('dark')
    return (
      <ThemeProvider theme={exampleTheme} colorMode="night" nightScheme={nightScheme}>
        <Text color="text">{nightScheme}</Text>
        <button onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>Toggle</button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in night mode (dark scheme)
  expect(screen.getByText('dark')).toHaveStyleRule('color', 'white')

  screen.getByRole('button').click()

  await waitFor(() =>
    // clicking the toggle button sets the night scheme to dark_dimmed
    expect(screen.getByText('dark_dimmed')).toHaveStyleRule('color', 'gray')
  )
})

it('inherits colorMode from parent', async () => {
  function App() {
    const [colorMode, setcolorMode] = React.useState<'day' | 'night'>('day')
    return (
      <ThemeProvider theme={exampleTheme} colorMode={colorMode}>
        <button onClick={() => setcolorMode(colorMode === 'day' ? 'night' : 'day')}>Toggle</button>
        <ThemeProvider>
          <Text color="text">{colorMode}</Text>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('day')).toHaveStyleRule('color', 'black')

  screen.getByRole('button').click()

  await waitFor(() => expect(screen.getByText('night')).toHaveStyleRule('color', 'white'))
})

it('inherits dayScheme from parent', async () => {
  function App() {
    const [dayScheme, setDayScheme] = React.useState('light')
    return (
      <ThemeProvider theme={exampleTheme} colorMode="night" dayScheme={dayScheme}>
        <button onClick={() => setDayScheme(dayScheme === 'light' ? 'dark_dimmed' : 'light')}>Toggle</button>
        <ThemeProvider colorMode="day">
          <Text color="text">{dayScheme}</Text>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('light')).toHaveStyleRule('color', 'black')

  screen.getByRole('button').click()

  await waitFor(() => expect(screen.getByText('dark_dimmed')).toHaveStyleRule('color', 'gray'))
})

it('inherits nightScheme from parent', async () => {
  function App() {
    const [nightScheme, setNightScheme] = React.useState('dark')
    return (
      <ThemeProvider theme={exampleTheme} colorMode="day" nightScheme={nightScheme}>
        <button onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>Toggle</button>
        <ThemeProvider colorMode="night">
          <Text color="text">{nightScheme}</Text>
        </ThemeProvider>
      </ThemeProvider>
    )
  }

  render(<App />)

  expect(screen.getByText('dark')).toHaveStyleRule('color', 'white')

  screen.getByRole('button').click()

  await waitFor(() => expect(screen.getByText('dark_dimmed')).toHaveStyleRule('color', 'gray'))
})

describe('setColorMode', () => {
  it('changes the color mode', () => {
    function ToggleMode() {
      const {colorMode, setColorMode} = useTheme()
      return <button onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>Toggle</button>
    }

    render(
      <ThemeProvider theme={exampleTheme} colorMode="day">
        <Text color="text">Hello</Text>
        <ToggleMode />
      </ThemeProvider>
    )

    // starts in day mode (light scheme)
    expect(screen.getByText('Hello')).toHaveStyleRule('color', 'black')

    screen.getByRole('button').click()

    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('Hello')).toHaveStyleRule('color', 'white')
  })
})

describe('setDayScheme', () => {
  it('changes the day scheme', () => {
    function ToggleDayScheme() {
      const {dayScheme, setDayScheme} = useTheme()
      return <button onClick={() => setDayScheme(dayScheme === 'light' ? 'dark' : 'light')}>Toggle</button>
    }

    render(
      <ThemeProvider theme={exampleTheme} colorMode="day">
        <Text color="text">Hello</Text>
        <ToggleDayScheme />
      </ThemeProvider>
    )

    // starts in day mode (light scheme)
    expect(screen.getByText('Hello')).toHaveStyleRule('color', 'black')

    screen.getByRole('button').click()

    // clicking the toggle button sets day scheme to dark
    expect(screen.getByText('Hello')).toHaveStyleRule('color', 'white')
  })
})

describe('setNightScheme', () => {
  it('changes the night scheme', () => {
    function ToggleNightScheme() {
      const {nightScheme, setNightScheme} = useTheme()
      return <button onClick={() => setNightScheme(nightScheme === 'dark' ? 'dark_dimmed' : 'dark')}>Toggle</button>
    }

    render(
      <ThemeProvider theme={exampleTheme} colorMode="night">
        <Text color="text">Hello</Text>
        <ToggleNightScheme />
      </ThemeProvider>
    )

    // starts in night mode (dark scheme)
    expect(screen.getByText('Hello')).toHaveStyleRule('color', 'white')

    screen.getByRole('button').click()

    // clicking the toggle button sets night scheme to dark_dimmed
    expect(screen.getByText('Hello')).toHaveStyleRule('color', 'gray')
  })
})

describe('useColorSchemeVar', () => {
  it('updates value when scheme changes', () => {
    function ToggleMode() {
      const {colorMode, setColorMode} = useTheme()
      return <button onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>Toggle</button>
    }

    function CustomBg() {
      const customBg = useColorSchemeVar(
        {
          light: 'red',
          dark: 'blue',
          dark_dimmed: 'green'
        },
        'inherit'
      )

      return <Text bg={customBg}>Hello</Text>
    }

    render(
      <ThemeProvider theme={exampleTheme} nightScheme="dark_dimmed">
        <CustomBg />
        <ToggleMode />
      </ThemeProvider>
    )

    expect(screen.getByText('Hello')).toHaveStyleRule('background-color', 'red')

    screen.getByRole('button').click()

    expect(screen.getByText('Hello')).toHaveStyleRule('background-color', 'green')
  })

  it('supports fallback value', () => {
    function ToggleMode() {
      const {colorMode, setColorMode} = useTheme()
      return <button onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>Toggle</button>
    }

    function CustomBg() {
      const customBg = useColorSchemeVar({dark: 'blue'}, 'red')

      return <Text bg={customBg}>Hello</Text>
    }

    render(
      <ThemeProvider theme={exampleTheme}>
        <CustomBg />
        <ToggleMode />
      </ThemeProvider>
    )

    expect(screen.getByText('Hello')).toHaveStyleRule('background-color', 'red')

    screen.getByRole('button').click()

    expect(screen.getByText('Hello')).toHaveStyleRule('background-color', 'blue')
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
      </ThemeProvider>
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
      </ThemeProvider>
    )

    expect(exampleTheme.colorSchemes).toHaveProperty(schemeToApply)
    expect(screen.getByTestId('text').textContent).toEqual(schemeToApply)
  })

  it('is the value of the fallback colorScheme applied when attempting to apply an invalid colorScheme', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()

      return <Text data-testid="text">{resolvedColorScheme}</Text>
    }

    const schemeToApply = 'totally-invalid-colorscheme'
    render(
      <ThemeProvider theme={exampleTheme} colorMode="day" dayScheme={schemeToApply}>
        <Component />
      </ThemeProvider>
    )

    const defaultThemeColorScheme = Object.keys(exampleTheme.colorSchemes)[0]

    expect(defaultThemeColorScheme).not.toEqual(schemeToApply)
    expect(exampleTheme.colorSchemes).not.toHaveProperty(schemeToApply)
    expect(screen.getByTestId('text').textContent).toEqual('light')
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
        </ThemeProvider>
      )

      expect(exampleTheme.colorSchemes).toHaveProperty(schemeToApply)
      expect(screen.getByTestId('text').textContent).toEqual(schemeToApply)
    })

    it('is the value of the fallback colorScheme applied when attempting to apply an invalid colorScheme', () => {
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
        </ThemeProvider>
      )

      const defaultThemeColorScheme = Object.keys(exampleTheme.colorSchemes)[0]

      expect(defaultThemeColorScheme).not.toEqual(schemeToApply)
      expect(exampleTheme.colorSchemes).not.toHaveProperty(schemeToApply)
      expect(screen.getByTestId('text').textContent).toEqual('light')
    })
  })
})
