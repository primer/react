import React from 'react'
import preval from 'babel-plugin-preval/macro'

const css = preval`
  const {join} = require('path')
  const sass = require('node-sass')
  const {css} = sass.renderSync({
    file: require.resolve('./primer-react.scss'),
    outputStyle: 'compressed',
    includePaths: [
      join(__dirname, '../node_modules')
    ]
  })
  module.exports = css.toString()
`

export {css}

export default function BaseCSS({children}) {
  // FIXME: {...rest} throws errors in styled-jsx ?
  return (
    <style>
      {css}
      {children}
    </style>
  )
}
