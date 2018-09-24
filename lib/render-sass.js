const sass = require('node-sass')
const {join} = require('path')

module.exports = function renderSass(data) {
  const result = sass.renderSync({
    data,
    outputStyle: 'compressed',
    includePaths: [join(__dirname, '../node_modules')]
  })
  return result.css.toString()
}
