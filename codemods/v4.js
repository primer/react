const renameImports = require('./lib/renameImports')
const prettify = require('./lib/prettify')

module.exports = (file, api) => {
  const j = api.jscodeshift
  const ast = j(file.source)

  renameImports(ast, j, '@primer/components', {
    FlexContainer: 'Flex',
    FlexItem: 'Flex.Item',
    UnderlineNavItem: 'UnderlineNav.Item',
    FilterListItem: 'FilterList.Item',
  })

  return prettify(ast, file)
}
