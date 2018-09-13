# Primer Theme

Primer Components come with built-in access to our Primer theme. The [theme file](https://github.com/primer/primer-react/blob/master/src/theme.js) contains an object which holds values
for common variables such as color, fonts, box shadows, and more. Our theme file pulls many of its color and typography values from [primer-primitives](https://github.com/primer/primer-primitives).

Many of our theme keys correspond to system props on our components. For example, if you'd like to set the max width on a `<Box>` set the `maxWidth` prop to `medium`:
`<Box maxWidth='medium'>`

In the background, [styled-system](https://github.com/jxnblk/styled-system) does the work of finding the `medium` value from `maxWidth` key in the theme file and applying the corresponding CSS.

Our full theme is as follows:

```
const theme = {
  breakpoints: ['544px', '768px', '1012px', '1280px'],
  maxWidths: {
    small: '544px',
    medium: '768px',
    large: '1012px',
    xlarge: '1280px'
  },
  fonts: {
    normal: fontStack([
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Helvetica',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol'
    ]),
    mono: fontStack(['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'])
  },
  colors: {
    bodytext: gray[9],
    black: '#1b1f23',
    white: '#fff',
    gray: ['#fafbfc', '#f6f8fa', '#e1e4e8', '#d1d5da', '#959da5', '#6a737d', '#586069', '#444d56', '#2f363d', '#24292e'],
    blue: ['#f1f8ff', '#dbedff', '#c8e1ff', '#79b8ff', '#2188ff', '#0366d6', '#005cc5', '#044289', '#032f62', '#05264c'],
    green: ['#f0fff4', '#dcffe4', '#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#165c26', '#144620'],
    yellow: ['#fffdef', '#fffbdd', '#fff5b1', '#ffea7f', '#ffdf5d', '#ffd33d', '#f9c513', '#dbab09', '#b08800', '#735c0f'],
    orange: ['#fff8f2', '#ffebda', '#ffd1ac', '#ffab70', '#fb8532', '#f66a0a', '#e36209', '#d15704', '#c24e00', '#a04100'],
    red: ['#ffeef0', '#ffdce0', '#fdaeb7', '#f97583', '#ea4a5a', '#d73a49', '#cb2431', '#b31d28', '#9e1c23', '#86181d'],
    purple: ['#f5f0ff', '#e6dcfd', '#d1bcf9', '#b392f0', '#8a63d2', '#6f42c1', '#5a32a3', '#4c2889', '#3a1d6e', '#29134e']
    blackfade15: 'rgba(27, 31, 35, 0.15)',
    blackfade20: 'rgba(27, 31, 35, 0.20)',
    whitefade15: 'rgba(255, 255, 255, 0.15)',
    state: {
      error: red[5],
      failure: red[5],
      pending: yellow[7],
      queued: yellow[7],
      success: green[5],
      unknown: gray[4]
    }
  },
  borders: [0, '1px solid'],
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48],
  lineHeights: {
    condensedUltra: 1,
    condensed: 1.25,
    default: 1.5
  },
  radii: [0, 3, 6],
  shadows: {
    small: '0 1px 1px rgba(27, 31, 35, 0.1)',
    medium: '0 1px 5px rgba(27, 31, 35, 0.15)',
    large: '0 1px 15px rgba(27, 31, 35, 0.15)',
    'extra-large': '0 10px 50px rgba(27, 31, 35, 0.07)'
  },
  space: [0, 4, 8, 16, 24, 32, 40, 48]
}
```


### Custom Theming
Custom theming is an optional way to override the Primer values that control color, spacing, typography, and other aspects of our components.

There are two ways to change the theme of primer-react components:

1. You can override the theme for an entire tree of components using the `<ThemeProvider>` from [emotion-theming]:

    ```jsx
    import {Block, Button, Text, theme as primer} from 'primer-react'
    import {ThemeProvider} from 'emotion-theming'

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

    **⚠️ Note: [emotion-theming]'s `<ThemeProvider>` only allows exactly one child.**

1. You can theme individual components by passing the `theme` prop directly:

    ```jsx
    import {Text} from 'primer-react'

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
