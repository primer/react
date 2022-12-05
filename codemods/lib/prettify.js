const prettier = require('prettier')

module.exports = function prettify(ast, file) {
  const config = prettier.resolveConfig.sync(process.cwd())
  const source = ast.toSource()
  return prettier.format(
    source,
    Object.assign(
      {
        parser: 'typescript',
        filepath: file.path,
      },
      config,
    ),
  )
}
