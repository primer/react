module.exports = function renameImports(ast, j, importSource, importMap) {
  const imports = ast.find(j.ImportDeclaration, {source: {value: importSource}})
  const importsByName = {}

  imports.forEach(decl => {
    j(decl)
      .find(j.ImportSpecifier)
      .forEach(spec => {
        importsByName[spec.node.imported.name] = spec
      })
  })

  for (const [from, to] of Object.entries(importMap)) {
    const idents = to.split('.')
    rewriteImport(from, idents[0], idents.slice(1))
  }

  function rewriteImport(from, to, members) {
    imports.forEach(decl => {
      j(decl)
        .find(j.ImportSpecifier, {imported: {name: from}})
        .forEach(spec => {
          if (importsByName[to] && members.length) {
            // if the destination import already exists and there are members
            // in this identifier, then this one is a dupe
            j(spec).remove()
          } else {
            // otherwise, we can safely rename this one to the new identifier
            spec.node.imported.name = to
            importsByName[to] = spec
          }
        })
    })

    // replace all of the rewritten identifiers with member expressions
    ast
      .find(j.Identifier, {name: from})
      .filter(id => id.parent.node.type !== 'ImportSpecifier')
      .replaceWith(memberExpression(to, ...members))
  }

  function memberExpression(ident, ...members) {
    return members.reduce((expr, member) => {
      return j.memberExpression(expr, j.identifier(member))
    }, j.identifier(ident))
  }
}
