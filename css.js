import React from 'react'
import preval from 'babel-plugin-preval/macro'

const css = preval`
  const {join} = require('path')
  const sass = require('node-sass')
  const {css} = sass.renderSync({
    file: require.resolve('./src/primer-react.scss'),
    outputStyle: 'compressed',
    includePaths: [
      join(__dirname, 'node_modules')
    ]
  })
  module.exports = css.toString()
`

export default function BaseCSS() {
  return <style name="primer">{css}</style>
}

export {css}
