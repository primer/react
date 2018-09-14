import preval from 'babel-plugin-preval/macro'

const baseCSS = preval`
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

export default function BaseCSS(props) {
  return <style>{baseCSS}</style>
}

export {baseCSS}
