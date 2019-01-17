import {theme} from '../../..'

# Primer Theme

Primer Components come with built-in access to our Primer theme. The [theme file](https://github.com/primer/components/blob/master/src/theme.js) contains an object which holds values
for common variables such as color, fonts, box shadows, and more. Our theme file pulls many of its color and typography values from [primer-primitives](https://github.com/primer/primer-primitives).

Many of our theme keys correspond to system props on our components. For example, if you'd like to set the max width on a `<Box>` set the `maxWidth` prop to `medium`:
`<Box maxWidth='medium'>`

In the background, [styled-system](https://github.com/jxnblk/styled-system) does the work of finding the `medium` value from `maxWidth` key in the theme file and applying the corresponding CSS.

Our full theme is as follows:

<pre>{JSON.stringify(theme, null, '  ')}</pre>


### Custom Theming
Custom theming is an optional way to override the Primer values that control color, spacing, typography, and other aspects of our components.

There are two ways to change the theme of Primer components:

1. You can override the entire theme for an entire tree of components using the `<ThemeProvider>` from [styled-components]:

    ```jsx
    import {Block, Button, Text, theme as primer} from '@primer/components'
    import {ThemeProvider} from 'styled-components'

    // a theme with custom spacing and font sizes
    const theme = {
      ...primer,
      space: [0, 8, 16, 32, 64],
      fontSizes: [10, 12, 16, 24, 48]
    }

    // override
    theme.colors.bodytext = '#111'

    export default () => (
      <ThemeProvider theme={theme}>
        <Block color='bodytext' p={4}>
          <Text fontSize={4}>Hello, world!</Text>
        </Block>
      </ThemeProvider>
    )
    ```

    **⚠️ Note: [styled-components]'s `<ThemeProvider>` only allows exactly one child.**
2. You can merge the Primer theme with your custom theme using Object.assign:

```jsx
import {ThemeProvider} from `styled-components`
import {theme} from '@primer/components'

const customTheme = { ... }


const App = (props) => {
  return (
    <div>
      <ThemeProvider theme={Object.assign({}, theme, customTheme)}> // matching keys in customTheme will override keys in the Primer theme
        <div>your app here</div>
      </ThemeProvider>
    </div>
  )
}
```

3. You can theme individual components by passing the `theme` prop directly:

    ```jsx
    import {Text} from '@primer/components'

    const theme = {
      colors: {
        magenta: '#f0f'
      }
    }

    export default () => (
      <Text theme={theme} color='magenta'>Hi, I'm magenta!</Text>
    )
    ```

    **☝️ This is an intentionally convoluted example, since you can use `<Text color='#f0f'>` out of the box.**


Read the [styled-system docs](http://jxnblk.com/styled-system/getting-started#theming) for more information on theming in styled-system.

[styled-components]: https://styled-components.com/
