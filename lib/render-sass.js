const sass = require('node-sass')
const {join} = require('path')

const defaultOptions = {
  outputStyle: 'compressed',
  includePaths: [join(__dirname, '../node_modules')]
}

function renderSync(options) {
  const result = sass.renderSync(Object.assign({}, defaultOptions, options))
  return result.css.toString()
}

function renderSource(data, otherOptions = {}) {
  return renderSync({data, ...otherOptions})
}

function renderFile(file, otherOptions = {}) {
  return renderSync({file, ...otherOptions})
}

module.exports = {
  renderSync,
  renderSource,
  renderFile
}
