module.exports = function replaceImportSource(ast, j, from, to) {
  ast
    .find(j.ImportDeclaration, decl => decl.source.value === from)
    .forEach(decl => {
      j(decl).find(j.Literal, {value: from}).replaceWith(j.literal(to))
    })
}
