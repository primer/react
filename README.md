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

To ensure proper styling of all Primer components, you'll need to include some static CSS that's distributed with the `@primer/components` npm package in `dist/primer-components.css`.

#### JavaScript bundlers
If you're using a JavaScript bundler that supports CSS imports, you can import it in your bundles directly:

```js
import '@primer/components/dist/css/build.css'
```
    
If you're using webpack, you will need to install [style-loader](https://github.com/webpack-contrib/style-loader) and  configure webpack to use it for imports ending in '.css', e.g.
    
```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'style-loader'
      }
    ]
  }
}
```

#### Server inlining
If you run a Node server, you can read the file from disk at startup:

```jsx
const {readFileSync} = require('fs')
const cssPath = require.resolve('@primer/components/dist/primer-components.css')
const css = readFileSync(cssPath, 'utf8')
```
    
Then, inline it into the `<head>` of your HTML template(s) or render it server-side in React like so:
    
```jsx
// assuming the `css` variable is set as above
export default () => (
  <html>
    <head>
      <style>{css}</style>
    </head>
    <body>
      ...
    </body>
  </html>
)
```

#### Static apps
For fully static or statically generated (Jekyll, Hugo, etc.) apps, you may need to manually copy `node_modules/@primer/components/dist/css/build.css` (after `npm install --save @primer/components`) to one of your site's public directories, i.e. `/assets`:

```sh
cp node_modules/@primer/components/dist/css/build.css assets/primer-components.css
```
    
Then link to it in the `<head>` of your HTML document(s):
    
```html
<link rel="stylesheet" href="/assets/primer-components.css">
```

### Static CSS rendering

Some Primer components rendered client-side may produce a [flash of unstyled content]. You can avoid most jarring flashes by ensuring that `primer-components.css` is either inlined or linked in the `<head>` of your document with one of the techniques described above.

If you're rendering React components both server-side _and_ client-side, we suggest following [Emotion's server-side rendering instructions](https://emotion.sh/docs/ssr) to avoid the flash of unstyled content for server-rendered components. This repo's [documentation template component](https://github.com/primer/components/blob/master/pages/_document.js) demonstrates how to do this in [Next.js].

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
[Next.js]: https://github.com/zeit/next.js
