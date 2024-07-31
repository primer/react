# postcss-preset-primer

> A PostCSS plugin for the preset plugins used for Primer

## Getting started

To install `primer-preset-primer` in your project, you will need to run the following command using [npm](https://www.npmjs.com/):

```bash
npm install postcss-preset-primer --save-dev
```

## Usage

You can import and use `postcss-preset-primer` directly in your PostCSS config
file:

```js
// postcss.config.js
const postcssPresetPrimer = require('postcss-preset-primer')

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [postcssPresetPrimer()],
}

module.exports = config
```
