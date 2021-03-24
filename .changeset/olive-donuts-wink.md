---
"@primer/components": major
---

Primer React now supports color modes! 🎉

See the new [Theming](https://primer.style/components/theming) documentation for more details.

#### Breaking changes

* You'll need to replace the `ThemeProvider` from `styled-components` with the new Primer React `ThemeProvider`:

```diff
- import {ThemeProvider} from 'styled-components'
- import {theme} from '@primer/components
+ import {ThemeProvider} from '@primer/components'

function App() {
  return (
-   <ThemeProvider theme={theme}>
+   <ThemeProvider>
      <div>your app here...</div>
    </ThemeProvider>
  )
}
```

* The structure of the theme object has changed to support color schemes:

```diff
const theme = {
- colors,
- shadows,
+ colorSchemes: {
+   light: {
+     colors,
+     shadows,
+   },
+   dark: {...},
+   dark_dimmed: {...},
+ },
  space,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  borderWidths,
  radii,
  breakpoints,
  sizes,
}
```

* The `theme.colors` and `theme.shadows` objects are no longer available from the `theme` export. Use the `useTheme`hook instead:

```diff
- import {theme} from '@primer/components'
+ import {useTheme} from '@primer/components'

function Example() {
+ const {theme} = useTheme()  
  const myColor = theme.colors.text.primary
  ...
}
```

