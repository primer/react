const replaceImportSource = require('./lib/replaceImportSource')
const renameImports = require('./lib/renameImports')
const prettify = require('./lib/prettify')

module.exports = (file, api) => {
  const j = api.jscodeshift
  const ast = j(file.source)

  replaceImportSource(ast, j, 'primer-react', '@primer/components')

  renameImports(ast, j, '@primer/components', {
    DonutChart: 'Donut',
    DonutSlice: 'Donut.Slice',
  })

  return prettify(ast, file)
}
