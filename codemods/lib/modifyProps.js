module.exports = (ast, j, moduleName, propsMap) => {
  const importsByName = {}

  ast
    .find(j.ImportDeclaration, decl => decl.source.value === moduleName)
    .forEach(decl => {
      j(decl)
        .find(j.ImportSpecifier)
        .forEach(spec => {
          importsByName[spec.node.imported.name] = spec.node.local.name
        })
    })

  ast
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: name => {
            return name in importsByName
          },
        },
      },
    })
    .forEach(el => {
      j(el)
        .find(j.JSXAttribute, {
          name: name => {
            return name.name in propsMap
          },
        })
        .forEach(attr => {
          const name = attr.value.name.name
          const op = propsMap[name]
          if (typeof op === 'function') {
            op(attr, el)
          } else if (typeof op === 'string' && attr.value.name instanceof Object) {
            attr.value.name.name = op
          } else if (op instanceof Object) {
            j(attr).replaceWith(op)
          }
        })
    })
}
