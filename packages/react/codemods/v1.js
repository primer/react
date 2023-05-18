const prettify = require('./lib/prettify')
const modifyProps = require('./lib/modifyProps')

module.exports = (file, api) => {
  const j = api.jscodeshift
  const ast = j(file.source)

  modifyProps(ast, j, 'primer-react', {
    tag: 'is',
    fg: 'color',
  })

  return prettify(ast, file)
}
