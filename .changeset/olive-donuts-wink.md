---
"@primer/components": minor
---

Primer React now supports color modes! 🎉

See the new [Theming](/theming) documentation for more details.

#### Breaking changes

You'll need to replace the `ThemeProvider` from `styled-components` with the new Primer React `ThemeProvider`:

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

Also, if you're customizing the theme, note that the structure of the theme object has changed to support color schemes:

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
