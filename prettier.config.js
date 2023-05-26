'use strict'

const config = require('@github/prettier-config')

module.exports = {
  ...config,
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
}
