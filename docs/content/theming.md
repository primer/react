---
title: Theming
---

Theming in Primer React is made possible by a theme object that allows you to define your application's colors, spacing, fonts, and more.

The structure of the [default theme object](/theme-reference) adheres to the [System UI Theme Specification](https://system-ui.com/theme) and contains the following keys:

- colors
- space
- fonts
- fontSizes
- fontWeights
- lineHeights
- borderWidths
- radii
- shadows
- breakpoints
- sizes

## ThemeProvider

To give components access to the theme object, you must add `ThemeProvider` to the root of your application:

```jsx
import {ThemeProvider} from '@primer/components'

function App() {
  return (
    <ThemeProvider>
      <div>...</div>
    </ThemeProvider>
  )
}
```

## Customizing the theme

`ThemeProvider` accepts a `theme` prop that allows you to provide your own custom theme:

```jsx
import {ThemeProvider, theme} from '@primer/components'
import deepmerge from 'deepmerge'

const customTheme = deepmerge(theme, {
  fonts: {
    mono: 'Monolisa, monospace'
  }
})

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <div>...</div>
    </ThemeProvider>
  )
}
```

Some components may break if your custom theme does not include all the same keys as the [default theme](/theme-reference). For that reason, we recommend extending the default theme using [deepmerge](https://www.npmjs.com/package/deepmerge).

## Referencing theme values

You can reference theme values in your application using [system props](/system-props), the [`sx` prop](/overriding-styles), the `themeGet` function, or the `useTheme` hook.

### System props and the `sx` prop

Some [system props](/system-props) and [`sx` prop](/overriding-styles) keys map to specific theme keys, allowing you to reference theme values in the corresponding object. For example, the `bg` prop maps to the `colors` theme key which means you can use the `bg` prop to reference values in the `colors` object:

```jsx
const theme = {
  colors: {
    bg: {
      primary: '#fff'
    }
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box bg="bg.primary"></Box>
      <Box sx={{bg: 'bg.primary'}}></Box>
    </ThemeProvider>
  )
}
```

See the [Styled System Reference Table](https://styled-system.com/table) for a complete list of mappings.

### themeGet

```js
import {themeGet} from '@primer/components'
import styled from 'styled-components'

const Example = styled.div`
  background-color: ${themeGet('colors.bg.primary')};
`
```

### useTheme

```js
import {useTheme} from '@primer/components'

function Example() {
  const theme = useTheme()
  // theme.colors.bg.primary
}
```

## Color schemes

You can define multiple color schemes for your application using the `colors.schemes` and `shadows.schemes` objects:

```js
const theme = {
  colors: {
    text: '#000'
    schemes: {
      dark: {
        text: '#fff'
      },
      dark_dimmed: {
        text: '#aaa'
      }
    }
  },
  shadows: {
    small: '0 1px 0 rgba(0, 0, 0, 0.5)'
    schemes: {
      dark: {
        small: '0 1px 0 rgba(255, 255, 255, 0.5)'
      },
      dark_dimmed: {
        small: '0 1px 0 rgba(255, 255, 255, 0.25)'
      }
    }
  }
}
```

The color scheme defined at the root of the `colors` and `shadows` objects can be accessed as `light`. The above example has three color schemes: `light`, `dark`, and `dark_dimmed`.

### Setting the initial color scheme

By default, Primer React uses the `light` color scheme. Use the `initialColorScheme` prop to override the default:

```jsx
import {ThemeProvider} from '@primer/components'

function App() {
  return (
    <ThemeProvider initialColorScheme="dark">
      <div>...</div>
    </ThemeProvider>
  )
}
```

To automatically switch between color schemes according to your operating system setting, pass `initialColorScheme` an object that defines the color scheme for light and dark mode:

```jsx
import {ThemeProvider} from '@primer/components'

function App() {
  return (
    <ThemeProvider
      initialColorScheme={{
        light: 'light',
        dark: 'dark_dimmed'
      }}
    >
      <div>...</div>
    </ThemeProvider>
  )
}
```

### Switching the color scheme

Use the `useColorScheme` hook to switch the color scheme:

```javascript live noinline
function Example() {
  const [colorScheme, setColorScheme] = useTheme()
  return (
    <div>
      <Button onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
        Activate {colorScheme === 'light' ? 'dark' : 'light'} color scheme
      </Button>
    </div>
  )
}

render(Example)
```

### Creating local color scheme variables

Avoid hard-coding color values when you need to use a color that's not defined in the theme:

```jsx
function Example() {
  return (
    // BAD: #aaa may not look good in all color schemes
    <Box bg="#aaa">Hello world</Box>
  )
}
```

Instead, use the `useColorSchemeVar` hook to create a local color scheme variable:

```jsx
import {useColorSchemeVar} from '@primer/components'
import {colors} from '@primer/primitives'

function Example() {
  const customBg = useColorSchemeVar({
    light: colors.light.scale.gray[1],
    dark: colors.dark.scale.gray[9],
    dark_dimmed: colors.dark_dimmed.scale.gray[2]
  })
  return <Box bg={customBg}>Hello world</Box>
}
```
