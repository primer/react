import {render, screen, waitFor} from '@testing-library/react'
import React from 'react'
import {ThemeProvider, Text, useTheme} from '..'
import 'jest-styled-components'

// window.matchMedia() is not implmented by JSDOM so we have to create a mock:
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
      <Text color="text.primary" mb={1}>
        Hello
      </Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toMatchSnapshot()
})

it('defaults to light color scheme', () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      }
    }
  }

  render(
    <ThemeProvider theme={theme}>
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#00f')
})

it('defaults to dark color scheme in night mode', () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      }
    }
  }

  render(
    <ThemeProvider theme={theme} colorMode="night">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#0f0')
})

it('respects nightScheme prop', () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      },
      dark_dimmed: {
        colors: {
          text: '#ff0'
        }
      }
    }
  }

  render(
    <ThemeProvider theme={theme} colorMode="night" nightScheme="dark_dimmed">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#ff0')
})

it('respects dayScheme prop', () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      },
      dark_dimmed: {
        colors: {
          text: '#ff0'
        }
      }
    }
  }

  render(
    <ThemeProvider theme={theme} colorMode="day" dayScheme="dark" nightScheme="dark_dimmed">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#0f0')
})

it('works in auto mode', () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      },
      dark_dimmed: {
        colors: {
          text: '#ff0'
        }
      }
    }
  }

  render(
    <ThemeProvider theme={theme} colorMode="auto">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#00f')
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

  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      },
      dark_dimmed: {
        colors: {
          text: '#ff0'
        }
      }
    }
  }

  render(
    <ThemeProvider theme={theme} colorMode="auto">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#0f0')

  matchMediaSpy.mockRestore()
})

it('works in auto mode', () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      },
      dark_dimmed: {
        colors: {
          text: '#ff0'
        }
      }
    }
  }

  render(
    <ThemeProvider theme={theme} colorMode="auto">
      <Text color="text">Hello</Text>
    </ThemeProvider>
  )

  expect(screen.getByText('Hello')).toHaveStyleRule('color', '#00f')
})

it('updates when colorMode prop changes', async () => {
  const theme = {
    colors: {
      text: '#f00'
    },
    colorSchemes: {
      light: {
        colors: {
          text: '#00f'
        }
      },
      dark: {
        colors: {
          text: '#0f0'
        }
      },
      dark_dimmed: {
        colors: {
          text: '#ff0'
        }
      }
    }
  }

  function App() {
    const [colorMode, setColorMode] = React.useState<'day' | 'night'>('day')
    return (
      <ThemeProvider theme={theme} colorMode={colorMode}>
        <Text color="text">{colorMode}</Text>
        <button onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>Toggle</button>
      </ThemeProvider>
    )
  }

  render(<App />)

  // starts in day mode (light scheme)
  expect(screen.getByText('day')).toHaveStyleRule('color', '#00f')

  screen.getByRole('button').click()

  await waitFor(() =>
    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('night')).toHaveStyleRule('color', '#0f0')
  )
})

describe('setColorMode', () => {
  it('changes the color mode', () => {
    const theme = {
      colors: {
        text: '#f00'
      },
      colorSchemes: {
        light: {
          colors: {
            text: '#00f'
          }
        },
        dark: {
          colors: {
            text: '#0f0'
          }
        },
        dark_dimmed: {
          colors: {
            text: '#ff0'
          }
        }
      }
    }

    function ToggleMode() {
      const {colorMode, setColorMode} = useTheme()
      return <button onClick={() => setColorMode(colorMode === 'day' ? 'night' : 'day')}>Toggle</button>
    }

    render(
      <ThemeProvider theme={theme} colorMode="day">
        <Text color="text">Hello</Text>
        <ToggleMode />
      </ThemeProvider>
    )

    // starts in day mode (light scheme)
    expect(screen.getByText('Hello')).toHaveStyleRule('color', '#00f')

    screen.getByRole('button').click()

    // clicking the toggle button enables night mode (dark scheme)
    expect(screen.getByText('Hello')).toHaveStyleRule('color', '#0f0')
  })
})
