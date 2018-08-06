# Migration guide

## `1.0.0-beta`
This release is a major version bump because it completely refactors the guts of (practically, at least) all of our components. Here's what you need to know:

* We've started using [emotion] and [styled-system] under the hood to speed up our migration from Primer CSS to complete style encapsulation in React.
1. The `tag` prop has been renamed to `is` to match [styled-system] conventions.
* This release introduces early support for theming with the `<ThemeProvider>` component from [emotion-theming]. For now, you will need to continue serving up Primer CSS to support components that haven't yet been migrated to the new system. See [theming](#theming) for more info.
* Many of the key "utility" props for margin, padding, and typography (`fontSize`, `lineHeight`, et al) should continue working without any modifications.
* [Color props](#color-changes) will require refactoring.


### Color props
1. The `fg` prop has been renamed to `color` across the board.
1. All color props (`bg`, `color`, and `borderColor`) now take object "paths" suitable for use with [styled-system's `themeGet()` function](http://jxnblk.com/styled-system/api#themeget). Specifically, because all of our [color gradations] are expressed as arrays in our theme, the `gray`, `blue`, `green`, `orange`, `purple`, `red`, and `yellow` values should get the `.5` suffix to get the middle value. E.g. `red` becomes `red.5`.
1. `<Text mono>` should now be written as `<Text fontFamily="mono">`.

[color gradations]: https://styleguide.github.com/primer/support/color-system/#color-variables
[emotion]: https://emotion.sh
[emotion-theming]: https://github.com/emotion-js/emotion/tree/master/packages/emotion-theming
[styled-system]: http://jxnblk.com/styled-system/
