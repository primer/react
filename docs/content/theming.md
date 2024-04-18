---
title: Theming
description: Theming in Primer React is made possible by a theme object that defines your application's colors, spacing, fonts, and more.
---

import Code from '@primer/gatsby-theme-doctocat/src/components/code'

## ThemeProvider

To give components access to the theme object, you must add `ThemeProvider` to the root of your application:

```jsx
import {ThemeProvider} from '@primer/react'

function App() {
  return (
    <ThemeProvider>
      <div>...</div>
    </ThemeProvider>
  )
}
```

`ThemeProvider` comes with a [default theme object](/theme-reference) that includes colors, spacing, fonts, etc. for building applications at GitHub.

## Customizing the theme

To customize the [default theme](/theme-reference), you can pass your custom theme to `ThemeProvider` using the `theme` prop:

```jsx
import {ThemeProvider, theme} from '@primer/react'
import deepmerge from 'deepmerge'

const customTheme = deepmerge(theme, {
  fonts: {
    mono: 'MonoLisa, monospace',
  },
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

You can reference theme values in your application using the [`sx` prop](/overriding-styles), the `themeGet` function, or the `useTheme` hook.

<Note variant="warning">

Only use `theme` objects accessed via Primer's theme context to ensure your application’s styling draws from the same theme as Primer components’ internal styling. The `sx` prop, styled system props, `themeGet`, and `useTheme` all use the theme from context.

<DoDontContainer>
  <Do>
    <Code className="language-jsx">
      {`<Box textShadow="shadow.medium">`}
    </Code>
    <Caption>Use the theme from the same context as Primer.</Caption>
  </Do>
  <Dont>
    <Code className="language-jsx">
      {`import {theme} from '@primer/react'\n\n<Box textShadow={theme.shadows.shadow.medium}>`}
    </Code>
    <Caption>Don't style components with any other instance of theme</Caption>
  </Dont>
</DoDontContainer>

</Note>

### System props and the `sx` prop

Some [system props](/system-props) and [`sx` prop](/overriding-styles) keys are theme-aware. For example, the `bg` prop maps to the `colors` theme key which means you can use the `bg` prop to reference values in the `colors` object:

```jsx
const theme = {
  colors: {
    canvas: {
      default: '#fff',
    },
  },
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box bg="canvas.default"></Box>
      <Box sx={{bg: 'canvas.default'}}></Box>
    </ThemeProvider>
  )
}
```

See the [Styled System Reference Table](https://github.com/styled-system/styled-system/blob/master/docs/table.md) for a complete list of mappings.

### themeGet

The `themeGet` function is a convenient way to reference theme values in styled-components template literals:

```js
import {themeGet} from '@primer/react'
import styled from 'styled-components'

const Example = styled.div`
  background-color: ${themeGet('colors.canvas.default')};
`
```

### useTheme

You can use the `useTheme` hook to reference theme values from inside any function component nested under the `ThemeProvider`:

```js
import {ThemeProvider, useTheme} from '@primer/react'

function Example() {
  const {theme} = useTheme()
  // theme.colors.canvas.default
}

function App() {
  return (
    <ThemeProvider>
      <Example />
    </ThemeProvider>
  )
}
```

<Note variant="warning">

Only use `useTheme` to reference theme values in places where it's not possible to use system props, the `sx` prop, or `themeGet`.

</Note>

## Color modes and color schemes

The terms "color mode" and "color scheme" are often used interchangeably. However, in Primer React, they are two separate (but related) concepts.

The "color mode" of an application can be either `day`, `night`, or `auto` (i.e. synced with the operating system).

A "color scheme", on the other hand, is a collection of colors that can be associated with a color mode. The [default theme](/theme-reference) includes several color schemes, including `light`, `dark`, and `dark_dimmed`. By default, the `light` scheme is displayed when the application is in `day` mode and the `dark` scheme is displayed in `night` mode.

### Setting the color mode

By default, Primer React is in `day` mode. To change the color mode, use the `colorMode` prop on `ThemeProvider` or the `setColorMode` function from the `useTheme` hook:

#### `colorMode` prop

```jsx
import {ThemeProvider} from '@primer/react'

function App() {
  return (
    // colorMode can be "day" (default), "night", or "auto"
    <ThemeProvider colorMode="auto">
      <div>...</div>
    </ThemeProvider>
  )
}
```

#### `setColorMode` function

```jsx
import {useTheme} from '@primer/react'

function Example() {
  const {setColorMode} = useTheme()
  return <button onClick={() => setColorMode('auto')}>Activate auto mode</button>
}
```

#### `preventSSRMismatch` prop

If you are doing server-side rendering, pass the `preventSSRMismatch` prop to ensure the rendered output from the server and browser match even when they resolve "auto" color mode differently.

```jsx
<ThemeProvider colorMode="auto" preventSSRMismatch>
  ...
</ThemeProvider>
```

### Setting color schemes

To choose which color schemes will be displayed in `day` and `night` mode, use the `dayScheme` and `nightScheme` props on `ThemeProvider` or the `setDayScheme` and `setNightScheme` functions from the `useTheme` hook:

#### `dayScheme` and `nightScheme` props

```jsx
import {ThemeProvider} from '@primer/react'

function App() {
  return (
    // The default theme includes `light`, `dark`, and `dark_dimmed` schemes
    <ThemeProvider dayScheme="light" nightScheme="dark_dimmed">
      <div>...</div>
    </ThemeProvider>
  )
}
```

#### `setDayScheme` and `setNightScheme` functions

```jsx
import {useTheme} from '@primer/react'

function Example() {
  const {setDayScheme, setNightScheme} = useTheme()
  return <button onClick={() => setNightScheme('auto')}>Activate auto mode</button>
}
```

### Customizing or adding color schemes

To customize or add color schemes, update the `colorSchemes` object in the theme:

```jsx
import {ThemeProvider, theme} from '@primer/react'
import deepmerge from 'deepmerge'

const customTheme = deepmerge(theme, {
  colorSchemes: {
    // Customize an existing scheme
    light: {
      colors: {
        text: {
          primary: '#f00',
        },
      },
    },
    // Add a new scheme
    my_scheme_name: {
      colors: {},
      shadows: {},
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <div>...</div>
    </ThemeProvider>
  )
}
```

### Creating local color scheme variables

If you need to use a color that is not defined in the theme, avoid hard coding the color value like this:

```jsx
function Example() {
  return (
    // BAD: #aaa may not look good in all color schemes
    <Box bg="#aaa">Hello world</Box>
  )
}
```

Instead, use the `useColorSchemeVar` hook to create a local variable that will update based on the active color scheme:

```jsx
import {useColorSchemeVar} from '@primer/react'
import {colors} from '@primer/primitives'

function Example() {
  // GOOD: The value of `customBg` changes based on the active color scheme
  const customBg = useColorSchemeVar({
    light: colors.light.scale.gray[1],
    dark: colors.dark.scale.gray[9],
    dark_dimmed: colors.dark_dimmed.scale.gray[2],
  })
  return <Box bg={customBg}>Hello world</Box>
}
```
