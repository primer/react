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

This project uses [emotion] to generate static CSS for most component styles, but still relies on [Primer CSS] for some classname-based styles that haven't yet been ported over.

To ensure proper styling of all Primer components, you'll need to include an instance of the `BaseCSS` component from `@primer/components/css` (note the `/css` at the end!) somewhere in your document's `<head>`:

```jsx
import BaseCSS from '@primer/components/css'
import {Heading} from '@primer/components'

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

If you can't use React to render your document server-side, you have some other options:

1. If you're using a JavaScript bundler that supports CSS imports, such as webpack:

    ```js
    import '@primer/components/dist/css/build.css'
    ```
    
2. Import the raw CSS as a string:

    ```js
    import {css} from '@primer/components/css'
    // or
    const {css} = require('@primer/components/css')
    ```
    
    Then output it client-side by injecting a `<style>` element:
    
    ```js
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
    ```
    
    Or render it in your server-side template, preferably within your document's `<head>`.

3. For fully static sites, copy `node_modules/@primer/components/dist/css/build.css` (after running `npm install --save @primer/components`) to your site directory, e.g.

    ```sh
    cp node_modules/@primer/components/dist/css/build.css assets/primer-components.css
    ```
    
    Then link to it within the `<head>` of your HTML document(s):
    
    ```html
    <link rel="stylesheet" href="/static/primer-components.css">
    ```

#### Static CSS rendering

Some Primer components rendered client-side may produce a [flash of unstyled content]. You can avoid this by using one of the above techniques and following the instructions for [Emotion server-side rendering](https://emotion.sh/docs/ssr).

This repo's [Next.js document component](https://github.com/primer/components/blob/master/pages/_document.js) illustrates how to combine `BaseCSS` with `emotion-server` in for fully server-rendered CSS in [Next.js](https://github.com/zeit/next.js).

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
