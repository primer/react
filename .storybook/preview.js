import {addons} from '@storybook/addons'
import {ThemeProvider, themeGet, theme} from '../src'
import {createGlobalStyle} from 'styled-components'

// set global theme styles for each story
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${themeGet('colors.bg.primary')};
    color: ${themeGet('colors.text.primary')};
  }
`
export const globalTypes = {
  colorMode: {
    name: 'Color mode',
    description: 'Color mode (day, night, auto)',
    defaultValue: 'day',
    toolbar: {
      icon: 'paintbrush',
      // array of colorMode items
      items: ['day', 'night', 'auto'],
      showName: true
    }
  },
  dayScheme: {
    name: 'Day color scheme',
    description: 'Day color scheme',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: Object.keys(theme.colorSchemes),
      showName: true
    }
  },
  nightScheme: {
    name: 'Night color scheme',
    description: 'Night color scheme',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circle',
      items: Object.keys(theme.colorSchemes),
      showName: true
    }
  }
}

// context.globals.X references items in globalTypes
const withThemeProvider = (Story, context) => {
  return (
    <ThemeProvider
      colorMode={context.globals.colorMode}
      dayScheme={context.globals.dayScheme}
      nightScheme={context.globals.nightScheme}
    >
      <GlobalStyle />
      <Story {...context} />
    </ThemeProvider>
  )
}
export const decorators = [withThemeProvider]

addons.setConfig({
  // Some stories may set up keyboard event handlers, which can can be interfered
  // with by these keyboard shortcuts.
  enableShortcuts: false
})

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'}
}
