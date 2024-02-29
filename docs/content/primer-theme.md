---
title: Primer Theme
---

import {theme} from '@primer/react'

Primer React components come with built-in access to our Primer theme. The [theme file](https://github.com/primer/react/tree/main/packages/react/src/theme.ts) contains an object which holds values for common variables such as color, fonts, box shadows, and more. Our theme file pulls many of its color and typography values from [primer-primitives](https://github.com/primer/primer-primitives).

Many of our theme keys correspond to system props on our components. For example, if you'd like to set the max width on a `<Box>` set the `maxWidth` prop to `medium`: `<Box maxWidth='medium'>`

In the background, [styled-system](https://github.com/styled-system/styled-system) does the work of finding the `medium` value from `maxWidth` key in the theme file and applying the corresponding CSS.

Learn more about [our full theme](https://github.com/primer/react/tree/main/packages/react/src/theme.ts).

### Custom Theming

Custom theming is an optional way to override the Primer values that control color, spacing, typography, and other aspects of our components.

There are two ways to change the theme of Primer components:

1. You can override the entire theme for an entire tree of components using the `<ThemeProvider>` from [styled-components]:

   ```javascript
   import {Box, Button, Text, theme as primer} from '@primer/react'
   import {ThemeProvider} from 'styled-components'

   // a theme with custom spacing and font sizes
   const theme = {
     ...primer,
     space: [0, 8, 16, 32, 64],
     fontSizes: [10, 12, 16, 24, 48],
   }

   // override
   theme.colors.bodytext = '#111'

   export default () => (
     <ThemeProvider theme={theme}>
       <Box color="bodytext" p={4}>
         <Text fontSize={4}>Hello, world!</Text>
       </Box>
     </ThemeProvider>
   )
   ```

   **⚠️ Note: [styled-components]'s `<ThemeProvider>` only allows exactly one child.**

2. You can merge the Primer theme with your custom theme using Object.assign:

   ```javascript
   import {ThemeProvider} from 'styled-components'
   import {theme} from '@primer/react'

   const customTheme = {} // Theme overrides

   const App = props => {
     return (
       <div>
         {/* matching keys in customTheme will override keys in the Primer theme */}
         <ThemeProvider theme={Object.assign({}, theme, customTheme)}>
           <div>your app here</div>
         </ThemeProvider>
       </div>
     )
   }
   ```

3. You can theme individual components by passing the `theme` prop directly:

   ```javascript
   import {Text} from '@primer/react'

   const theme = {
     colors: {
       magenta: '#f0f',
     },
   }

   export default () => (
     <Text theme={theme} color="magenta">
       Hi, I'm magenta!
     </Text>
   )
   ```

   **☝️ This is an intentionally convoluted example, since you can use `<Text color='#f0f'>` out of the box.**

Read the [styled-system docs](https://styled-system.com/#theming) for more information on theming in styled-system.

[styled-components]: https://styled-components.com/
