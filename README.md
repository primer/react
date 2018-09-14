# Primer react

[Primer](https://primer.github.io/) React components

## Status

**⚠️ This project is WIP and not ready for production use yet!**

Currently we link to the latest build of [Primer CSS] so that we may use current Primer styles to start to build components. This does not include `primer-base` so as to avoid unwanted base overrides.

## Installation

Install primer-react in your project with npm:

```
npm install primer-react
```

## Usage

**If you are upgrading from a version before `1.0.0-beta`, please read the [migration docs](migrating.md).**

All of our components are exported by name from `primer-react`, so you can import them with:

```js
import {
  Box,
  Button,
  Heading,
  Text
} from 'primer-react'
```

### Styling

This project uses [emotion] under the hood to generate static CSS from _some_ component styles, but still relies on [Primer CSS] for some component styles that haven't yet been ported over.

To ensure proper styling, you'll need to include an instance of the `BaseCSS` component somewhere in your document:

```jsx
import {BaseCSS, Heading} from 'primer-react'

export default () => (
  <html>
    <head>
      <BaseCSS />
    </head>
    <body>
      <Heading is="h1">Primer!</Heading>
    </body>
  </html>
)
```

If you can't use React to render your document shell server-side, you have two other options:

1. Include `node_modules/primer-react/dist/css/build.css` by copying or other means.
1. `import {BaseCSS: {css}} from 'primer-react'` and output the `css` string directly.

#### Static CSS rendering

In the above case, component styles will be rendered at runtime (typically, in your client-side JavaScript bundle), which may produce a [flash of unstyled content]. See the [Emotion docs](https://emotion.sh/docs/ssr) for instructions on rendering the CSS server-side and render them in the `<head>` to avoid the flash.

## Local Development

To run `primer-react` locally when adding or updating components:

1. Clone this repo: `git clone https://github.com/primer/primer-react`
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
