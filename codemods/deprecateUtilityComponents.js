const prettify = require('./lib/prettify')

module.exports = (file, api) => {
  const j = api.jscodeshift
  const ast = j(file.source)

  deprecateComponents(ast, j, '@primer/components', {
    Flex: {
      identifier: 'Box',
      attributes: {
        display: 'flex',
      },
    },
    Grid: {
      identifier: 'Box',
      attributes: {
        display: 'grid',
      },
    },
    Position: {
      identifier: 'Box',
      attributes: {},
    },
    Absolute: {
      identifier: 'Box',
      attributes: {
        position: 'absolute',
      },
    },
    Relative: {
      identifier: 'Box',
      attributes: {
        position: 'relative',
      },
    },
    Fixed: {
      identifier: 'Box',
      attributes: {
        position: 'fixed',
      },
    },
    Sticky: {
      identifier: 'Box',
      attributes: {
        position: 'sticky',
      },
    },
    BorderBox: {
      identifier: 'Box',
      attributes: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border.default',
        borderRadius: 2,
      },
    },
  })

  return prettify(ast, file)
}

function deprecateComponents(ast, j, importSource, importMap) {
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
    rewriteImport(from, to.identifier, to.attributes)
  }

  function rewriteImport(from, to, attributes) {
    imports.forEach(decl => {
      j(decl)
        .find(j.ImportSpecifier, {imported: {name: from}})
        .forEach(spec => {
          if (importsByName[to]) {
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

    ast.find(j.JSXOpeningElement, {name: {name: from}}).forEach(nodePath => {
      for (const [attr, value] of Object.entries(attributes || {})) {
        const expression = typeof value === 'string' ? j.literal(value) : j.jsxExpressionContainer(j.literal(value))
        const attrExists = nodePath.value.attributes.find(a => a?.name?.name === attr)
        if (!attrExists) {
          nodePath.value.attributes.push(j.jsxAttribute(j.jsxIdentifier(attr), expression))
        }
      }
    })

    // replace all of the rewritten identifiers with member expressions
    ast
      .find(j.Identifier, {name: from})
      .filter(id => id.parent.node.type !== 'ImportSpecifier')
      .replaceWith(j.jsxIdentifier(to))
  }
}
