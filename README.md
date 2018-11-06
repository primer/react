![](https://user-images.githubusercontent.com/8960591/48100248-482e1d00-e1d7-11e8-81c1-303b4234dab0.jpg)

# Primer Components

[Primer](https://primer.github.io/) React components

## Status

**⚠️ This project is WIP and not ready for production use yet!**

## Installation

Install @primer/components in your project with npm:

```
npm install @primer/components
```

## Usage

All of our components are exported by name from `@primer/components`, so you can import them with:

```js
import {
  Box,
  Button,
  Heading,
  Text
} from '@primer/components'
```

Primer Components come with all necessary CSS built-in, so you don't need to worry about including [Primer CSS].

#### Base styles

You can establish base Primer styles for your app by wrapping all of your Primer components in `<BaseStyles>`:

```jsx
import {BaseStyles, Box, Heading} from '@primer/components'

export default () => (
  <BaseStyles>
    <Box m={4}>
      <Heading mb={2}>Hello, world!</Heading>
      <p>This will get Primer text styles.</p>
    </Box>
  </BaseStyles>
)
```

This will set the `color`, `font-family`, and `line-height` CSS properties to the same ones used in [primer-base](https://github.com/primer/primer/blob/master/modules/primer-base/lib/base.scss#L15).

#### Static CSS rendering

If you're rendering React components both server-side _and_ client-side, we suggest following [Emotion's server-side rendering instructions](https://emotion.sh/docs/ssr) to avoid the flash of unstyled content for server-rendered components. This repo's [documentation template component](https://github.com/primer/components/blob/master/pages/_document.js) demonstrates how to do this in [Next.js].

## Local Development

To run `@primer/components` locally when adding or updating components:

1. Clone this repo: `git clone https://github.com/primer/components`
1. Install dependencies: `npm install`
1. Run the dev app: `npm run dev`

> 👉 See [the contributing docs](contributing.md) for more info on code style, testing, and coverage.


## Principles

- Everything is a component.
- Aim for total style encapsulation; don't rely on inheritance to provide default styles.
- Build small building blocks with minimal props to keep complexity low.
- Keep system constrained by only including props needed per component.
- Favor extending or wrapping components for more complex operations.
- Maintain design system consistency with utilities as props (for spacing, color, font-size, line-height, widths, and radii).


[emotion]: https://emotion.sh/
[Primer CSS]: https://github.com/primer/primer
[flash of unstyled content]: https://en.wikipedia.org/wiki/Flash_of_unstyled_content
[Next.js]: https://github.com/zeit/next.js
