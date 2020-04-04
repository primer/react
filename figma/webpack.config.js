const path = require('path')
const configure = require('react-figma-webpack-config')

module.exports = configure({
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react/'),
      'react-figma': path.resolve(__dirname, './node_modules/react-figma/'),
      'styled-components': path.resolve(__dirname, './src/styled'),
      '@primer/components': path.resolve(__dirname, '../dist/index.esm.js'),
    },
  },
})
