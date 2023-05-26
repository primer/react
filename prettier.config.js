'use strict'

const config = require('@github/prettier-config')

module.exports = {
  ...config,
  // eslint-disable-next-line github/unescaped-html-literal
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
}
