'use strict'

const path = require('node:path')

module.exports = {
  extends: ['plugin:@next/next/recommended'],
  settings: {
    next: {
      rootDir: path.join(__dirname, 'src'),
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
}
