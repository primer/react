'use strict'

const postcssPresetPrimer = require('postcss-preset-primer')

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [postcssPresetPrimer()],
}
