# Migration guide

## `1.0.0-beta`
This release is a major version bump because it completely refactors the guts of (practically, at least) all of our components. Here's what you need to know:

### Emotion and styled-system
The big change in this release is the introduction of [emotion] and [styled-system] under the hood to speed up our migration from Primer CSS to complete style encapsulation in React. For now, you will need to continue serving up [Primer CSS] to support components that haven't yet been migrated to the new styling system. See [the README](README.md#styling) for more information.

This release also introduces early support for [theming](#theming).

### Props changes
* The `tag` prop has been renamed to `is` to match [styled-system] conventions.

* Color props will require refactoring:

    - The `fg` prop has been renamed to `color` across the board.

    - All color props (`bg`, `color`, and `borderColor`) now take object paths that represent nested values in the `colors` object of our [default theme]. Because all of our [color gradations] are expressed as arrays, the `gray`, `blue`, `green`, `orange`, `purple`, `red`, and `yellow` values need to be updated to include the `.5` suffix so that they receive the value closest to the middle of each hue gradation (`red.5` maps to `theme.colors.red[5]`).
    
        In other words, `color="red"` becomes `color="red.5"`, `bg="purple"` becomes `bg="purple.5"`, and so on. Color prop values other than `gray`, `blue`, `green`, `orange`, `purple`, `red`, and `yellow` **do not** need to change.
    
* Many of the key "utility" props for margin, padding, and typography (`fontSize`, `lineHeight`, et al) should continue working without any modifications.

* Many of the Text component props have changed:

    - `<Text mono>` should now be written as `<Text fontFamily="mono">`.

    - `<Text nowrap>` is no longer supported (yet).

### Theming
Theming is an optional way to override the values that control color, spacing, typography, and other aspects of our components.

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

[color gradations]: https://styleguide.github.com/primer/support/color-system/#color-variables
[default theme]: src/theme.js
[emotion]: https://emotion.sh
[emotion-theming]: https://github.com/emotion-js/emotion/tree/master/packages/emotion-theming
[styled-system]: http://jxnblk.com/styled-system/
[themeGet]: http://jxnblk.com/styled-system/api#themeget
[Primer CSS]: https://github.com/primer/primer
