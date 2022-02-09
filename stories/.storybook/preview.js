import {addons} from '@storybook/addons'
import {ThemeProvider, themeGet, theme, BaseStyles} from '../src'
import styled, {createGlobalStyle} from 'styled-components'
import {addDecorator} from '@storybook/react'
import {withPerformance} from 'storybook-addon-performance'

addDecorator(withPerformance)

// set global theme styles for each story
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${themeGet('colors.canvas.default')};
    color: ${themeGet('colors.fg.default')};
  }
`

// only remove padding for multi-theme view grid
const GlobalStyleMultiTheme = createGlobalStyle`
  body {
    padding: 0 !important;
  }
`

// duo theme view, this can be extended for more themes
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100vh;
`

// instead of global theme, only theme wrapper for each story
const ThemedSectionStyle = styled.div`
  background-color: ${themeGet('colors.canvas.default')};
  color: ${themeGet('colors.fg.default')};
  padding: 1rem;
`

export const globalTypes = {
  colorMode: {
    name: 'Color mode',
    description: 'Color mode (day, night, auto, all)',
    defaultValue: 'day',
    toolbar: {
      icon: 'paintbrush',
      // array of colorMode items
      items: ['day', 'night', 'auto', 'all'],
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
  if (context.globals.colorMode === 'all') {
    return (
      <Wrapper>
        <GlobalStyleMultiTheme />
        <ThemeProvider colorMode="day" dayScheme={context.globals.dayScheme} nightScheme={context.globals.nightScheme}>
          <ThemedSectionStyle>
            <Story {...context} />
          </ThemedSectionStyle>
        </ThemeProvider>
        <ThemeProvider
          colorMode="night"
          dayScheme={context.globals.dayScheme}
          nightScheme={context.globals.nightScheme}
        >
          <ThemedSectionStyle>
            <BaseStyles>
              <div id="html-addon-root">
                <Story {...context} />
              </div>
            </BaseStyles>
          </ThemedSectionStyle>
        </ThemeProvider>
      </Wrapper>
    )
  }

  return (
    <ThemeProvider
      colorMode={context.globals.colorMode}
      dayScheme={context.globals.dayScheme}
      nightScheme={context.globals.nightScheme}
    >
      <GlobalStyle />
      <BaseStyles>
        <div id="html-addon-root">
          <Story {...context} />
        </div>
      </BaseStyles>
    </ThemeProvider>
  )
}

export const decorators = [withThemeProvider, withPerformance]

addons.setConfig({
  // Some stories may set up keyboard event handlers, which can can be interfered
  // with by these keyboard shortcuts.
  enableShortcuts: false
})

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  html: {
    root: '#html-addon-root',
    removeEmptyComments: true
  }
}
