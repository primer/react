const renameImports = require('./lib/renameImports')
const prettify = require('./lib/prettify')

module.exports = (file, api) => {
  const j = api.jscodeshift
  const ast = j(file.source)

  renameImports(ast, j, 'primer-react', {
    Box: 'BorderBox',
    Block: 'Box',
    CaretBox: 'PointerBox',
  })

  return prettify(ast, file)
}
