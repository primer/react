import {render, screen} from '@testing-library/react'
import React from 'react'
import {ThemeProvider, Text} from '..'
import 'jest-styled-components'

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
