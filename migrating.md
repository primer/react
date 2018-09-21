# Migration guide

## `1.0.0-beta`
This release is a major version bump because it completely refactors the guts of all our components. Here's what you need to know:

### Emotion and styled-system
The big change in this release is the introduction of [emotion] and [styled-system] under the hood to speed up our migration from Primer CSS to complete style encapsulation in React. For now, you will need to continue serving up [Primer CSS] to support components that haven't yet been migrated to the new styling system. See [the README](README.md#styling) for more information.

This release also introduces early support for [theming](#theming).

### Props changes
* The `tag` prop has been renamed to `is` to match [styled-system] conventions.

* Color props will require refactoring:

    - The `fg` prop has been renamed to `color` across the board.

    - Color prop (`bg`, `color`, and `borderColor`) values are now object paths that represent nested fields in the `colors` object of our [default theme]. Because all of our [color gradations] are expressed as arrays, the `gray`, `blue`, `green`, `orange`, `purple`, `red`, and `yellow` values need to be updated to include the `.5` suffix so that they receive the value closest to the middle of each hue gradation (`red.5` maps to `theme.colors.red[5]`).

        In other words, `color="red"` becomes `color="red.5"`, `bg="purple"` becomes `bg="purple.5"`, and so on. See [the full list of changes](#color-props) below.

* [Some typography props](#typography-props) will require refactoring.

* [Some `Block` props](#block-props) have changed.

* [Some `FlexContainer` and `FlexItem` props](#flex-props) have changed.

### Theming
Theming is an optional way to override the values that control color, spacing, typography, and other aspects of our components.

There are two ways to change the theme of @primer/components components:

1. You can override the theme for an entire tree of components using the `<ThemeProvider>` from [emotion-theming]:

    ```jsx
    import {Block, Button, Text, theme as primer} from '@primer/components'
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

### Color props
The following table lists color prop values that have changed in `1.0.0-beta`:

| Prop | Before | After | Notes |
| :--- | :----- | :---- | :---- |
| `bg` | `blue-light` | `blue.0` |
| `bg` | `blue` | `blue.5` |
| `bg` | `gray-dark` | `gray.9` |
| `bg` | `gray-light` | `gray.0` |
| `bg` | `gray` | `gray.1` |
| `bg` | `green-light` | `green.1` |
| `bg` | `green` | `green.5` |
| `bg` | `orange` | `orange.7` |
| `bg` | `purple-light` | `purple.0` |
| `bg` | `purple` | `purple.5` |
| `bg` | `red-light` | `red.1` |
| `bg` | `red` | `red.5` |
| `bg` | `yellow-light` | `yellow.2` |
| `bg` | `yellow` | `yellow.5` |
| `borderColor` | `black-fade` | `blackfade15` |
| `borderColor` | `blue-light` | `blue.2` |
| `borderColor` | `blue` | `blue.5` |
| `borderColor` | `gray-dark` | `gray.3` |
| `borderColor` | `gray-darker` | `gray.7` |
| `borderColor` | `gray-light` | `#eaecef` | Not yet migrated |
| `borderColor` | `gray` | `gray.2` |
| `borderColor` | `green-light` | `#a2cbac` | Not yet migrated |
| `borderColor` | `green` | `green.4` |
| `borderColor` | `purple` | `purple.5` |
| `borderColor` | `red-light` | `#cea0a5` | Not yet migrated |
| `borderColor` | `yellow` | `#d9d0a5` | Not yet migrated |
| `color` | `blue` | `blue.5` |
| `color` | `gray-dark` | `gray.9` |
| `color` | `gray-light` | `gray.5` |
| `color` | `gray` | `gray.6` |
| `color` | `green` | `green.5` |
| `color` | `orange-light` | `orange.6` |
| `color` | `orange` | `orange.9` |
| `color` | `purple` | `purple.5` |
| `color` | `red` | `red.6` |

Remember that all `fg` props must be renamed to `color`.

### Typography props

* Typography props are still only available on the `Text` and `Heading` components.

* The `fontSize` prop works as before, but now treats any value that doesn't represent an index of `theme.fontSizes` as a literal CSS value.

* The `lineHeight` prop now accepts one of the keys from `theme.lineHeights`: `default`, `condensed`, or `condensedUltra`. Any other value will be passed along as a literal CSS value.

The following table lists typography-related prop substitutions:

| Prop | Value(s) | Substitute |
| :--- | :------- | :--------- |
| `lineHeight` | `condensed-ultra` | `lineHeight="condensedUltra"` |
| `mono` | (boolean) | `fontFamily="mono"` |
| `nowrap` | (boolean) | `css="white-space: nowrap"` |


### `Block` props
The `Block` component supports most of the same props, but the following ones will need to be refactored:

| Prop | Value(s) | Substitute |
| :--- | :------- | :--------- |
| `border` | `true` | `border={1}` |
| `border` | `'bottom'` | `borderBottom={1}` |
| `border` | `'left'` | `borderLeft={1}` |
| `border` | `'right'` | `borderRight={1}` |
| `border` | `'top'` | `borderTop={1}` |
| `shadow` | _all_ | `boxShadow="value"` |

Note: array values in border props represent [responsive values].

### Flex props
The `FlexContainer` and `FlexItem` components have changed significantly in this version. The following props have been renamed or deprecated:

#### `FlexContainer`
| Prop | Value(s) | Substitute |
| :--- | :------- | :--------- |
| `direction` | _all_ | `flexDirection="css-value"` |
| `wrap` | `wrap`, `nowrap` | `flexWrap="css-value"` |
| `inline` | (boolean) | `display="inline-flex"` |

#### `FlexItem`
| Prop | Value(s) | Substitute |
| :--- | :------- | :--------- |
| `flexAuto` | (boolean) | No longer supported |


[color gradations]: https://styleguide.github.com/primer/support/color-system/#color-variables
[default theme]: src/theme.js
[emotion]: https://emotion.sh
[emotion-theming]: https://github.com/emotion-js/emotion/tree/master/packages/emotion-theming
[styled-system]: http://jxnblk.com/styled-system/
[themeGet]: http://jxnblk.com/styled-system/api#themeget
[Primer CSS]: https://github.com/primer/primer
[responsive values]: http://jxnblk.com/styled-system/responsive-styles#responsive-styles
