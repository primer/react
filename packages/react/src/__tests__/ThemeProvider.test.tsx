import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import ThemeProvider from '../ThemeProvider'
import {useColorSchemeVar, useTheme} from '../useTheme'

// copied from '@primer/primitives/dist/css/functional/themes/';
const fgDefaultColors = {
  light: '#1f2328',
  // eslint-disable-next-line camelcase
  light_high_contrast: '#010409',
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

it('defaults to light color scheme', async () => {
  render(
    <ThemeProvider>
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.light}`)
})

it('continues to provide legacy JavaScript theme values', async () => {
  function Consumer() {
    const {theme, resolvedColorScheme} = useTheme()
    return <span data-testid="theme">{String(theme !== undefined && resolvedColorScheme === 'light')}</span>
  }

  render(
    <ThemeProvider>
      <Consumer />
    </ThemeProvider>,
  )

  await expect.element(page.getByTestId('theme')).toHaveTextContent('true')
})

it('defaults to dark color scheme in night mode', async () => {
  render(
    <ThemeProvider colorMode="night">
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)
})

it('respects nightScheme prop', async () => {
  render(
    <ThemeProvider colorMode="night" nightScheme="dark_dimmed">
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`)
})

it('works in auto mode', async () => {
  render(
    <ThemeProvider colorMode="auto">
      <span style={{color: 'var(--fgColor-default)'}}>Hello</span>
    </ThemeProvider>,
  )

  await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle('color: rgb(31, 35, 40)')
})

// TODO: need to wire up a prefers color scheme mock, vitest-matchmedia-mock?
it.todo('works in auto mode (dark)', async () => {
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

  await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)

  matchMediaSpy.mockRestore()
})

it('updates when colorMode prop changes', async () => {
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
  await expect.element(page.getByText('day', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await userEvent.click(page.getByRole('button'))

  // clicking the toggle button enables night mode (dark scheme)
  await expect.element(page.getByText('night', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)
})

it('updates when dayScheme prop changes', async () => {
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
  await expect.element(page.getByText('light', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await userEvent.click(page.getByRole('button'))

  // clicking the toggle sets the day scheme to light_high_contrast
  await expect
    .element(page.getByText('light_high_contrast', {exact: true}))
    .toHaveStyle(`color: ${fgDefaultColors.light_high_contrast}`)
})

it('updates when nightScheme prop changes', async () => {
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
  await expect.element(page.getByText('dark', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)

  await userEvent.click(page.getByRole('button'))

  // clicking the toggle button sets the night scheme to dark_dimmed
  await expect
    .element(page.getByText('dark_dimmed', {exact: true}))
    .toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`)
})

it('inherits colorMode from parent', async () => {
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

  await expect.element(page.getByText('day', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await userEvent.click(page.getByRole('button'))

  await expect.element(page.getByText('night', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)
})

it('inherits dayScheme from parent', async () => {
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

  await expect.element(page.getByText('light', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.light}`)

  await userEvent.click(page.getByRole('button'))

  await expect
    .element(page.getByText('light_high_contrast', {exact: true}))
    .toHaveStyle(`color: ${fgDefaultColors.light_high_contrast}`)
})

it('inherits nightScheme from parent', async () => {
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

  await expect.element(page.getByText('dark', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)

  await userEvent.click(page.getByRole('button'))

  await expect
    .element(page.getByText('dark_dimmed', {exact: true}))
    .toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`)
})

describe('setColorMode', () => {
  it('changes the color mode', async () => {
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
    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.light}`)

    await userEvent.click(page.getByRole('button'))

    // clicking the toggle button enables night mode (dark scheme)
    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)
  })
})

describe('setDayScheme', () => {
  it('changes the day scheme', async () => {
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
    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.light}`)

    await userEvent.click(page.getByRole('button'))

    // clicking the toggle button sets day scheme to dark
    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)
  })
})

describe('setNightScheme', () => {
  it('changes the night scheme', async () => {
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
    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark}`)

    await userEvent.click(page.getByRole('button'))

    // clicking the toggle button sets night scheme to dark_dimmed
    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle(`color: ${fgDefaultColors.dark_dimmed}`)
  })
})

describe('useColorSchemeVar', () => {
  it('updates value when scheme changes', async () => {
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

    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle('background-color: rgb(255, 0, 0)')

    await userEvent.click(page.getByRole('button'))

    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle('background-color: rgb(0, 128, 0)')
  })

  it('supports fallback value', async () => {
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

    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle('background-color: rgb(255, 0, 0)')

    await userEvent.click(page.getByRole('button'))

    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle('background-color: rgb(0, 0, 255)')
  })
})

describe('useTheme().resolvedColorScheme', () => {
  it('is undefined when not in a theme', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()
      return <span data-testid="text">{resolvedColorScheme}</span>
    }

    render(<Component />)

    expect(page.getByTestId('text').element().textContent).toEqual('')
  })

  it('is the same as the applied colorScheme when that colorScheme is in the theme', () => {
    const Component = () => {
      const {resolvedColorScheme} = useTheme()
      return <span data-testid="text">{resolvedColorScheme}</span>
    }

    render(
      <ThemeProvider colorMode="day" dayScheme="dark">
        <Component />
      </ThemeProvider>,
    )

    expect(page.getByTestId('text').element().textContent).toEqual('dark')
  })

  it('uses the fallback colorScheme when attempting to apply an invalid colorScheme', () => {
    const spy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    const Component = () => {
      const {resolvedColorScheme} = useTheme()
      return <span data-testid="text">{resolvedColorScheme}</span>
    }

    render(
      <ThemeProvider colorMode="day" dayScheme="totally-invalid-colorscheme">
        <Component />
      </ThemeProvider>,
    )

    expect(spy).toHaveBeenCalledWith('`totally-invalid-colorscheme` scheme not defined in `theme.colorSchemes`')
    expect(page.getByTestId('text').element().textContent).toEqual('light')

    spy.mockRestore()
  })
})

describe('contextOnly', () => {
  it('renders a div with data-* attributes by default', async () => {
    const {container} = render(
      <ThemeProvider>
        <span>Hello</span>
      </ThemeProvider>,
    )

    const div = container.querySelector<HTMLDivElement>('[data-color-mode]')
    await expect.element(div).toBeInTheDocument()
    expect(div?.tagName).toBe('DIV')
    await expect.element(div).toHaveAttribute('data-component', 'ThemeProvider')
    await expect.element(div).toHaveAttribute('data-light-theme')
    await expect.element(div).toHaveAttribute('data-dark-theme')
  })

  it('does not render a div with data-* attributes when contextOnly is true', async () => {
    const {container} = render(
      <ThemeProvider contextOnly>
        <span>Hello</span>
      </ThemeProvider>,
    )

    const div = container.querySelector<HTMLDivElement>('[data-color-mode]')
    await expect.element(div).not.toBeInTheDocument()
  })

  it('still provides theme context when contextOnly is true', () => {
    function Consumer() {
      const {colorMode, dayScheme, nightScheme} = useTheme()
      return (
        <span data-testid="consumer">
          {colorMode}-{dayScheme}-{nightScheme}
        </span>
      )
    }

    render(
      <ThemeProvider contextOnly colorMode="night" nightScheme="dark_dimmed">
        <Consumer />
      </ThemeProvider>,
    )

    expect(page.getByTestId('consumer').element().textContent).toBe('night-light-dark_dimmed')
  })
})
