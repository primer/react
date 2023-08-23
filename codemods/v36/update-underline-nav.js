'use strict'

const {setupPreserveLeadingComments} = require('../lib/preserveLeadingComments')
const {format} = require('../lib/format')

function transform(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  const preserveLeadingComments = setupPreserveLeadingComments(j, root)

  let identifier = null
  const imported = root.find(j.ImportDeclaration).filter(path => {
    if (!path.node.source.value.startsWith('@primer/react')) {
      return false
    }

    const specifier = path.node.specifiers.find(specifier => {
      return specifier.imported.name === 'UnderlineNav'
    })

    if (specifier) {
      identifier = specifier.local.name
      return true
    }

    return false
  })

  if (!imported || identifier === null) {
    return
  }

  root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          object: {
            name: identifier,
          },
          property: {
            name: 'Link',
          },
        },
      },
    })
    .forEach(path => {
      // Rename UnderlineNav.Link to UnderlineNav.Item
      j(path).find(j.JSXIdentifier, {name: 'Link'}).replaceWith(j.jsxIdentifier('Item'))

      // Replace `selected` prop with `aria-current="page"`
      j(path)
        .find(j.JSXAttribute, {
          name: {
            name: 'selected',
          },
        })
        .forEach(attributePath => {
          // If there is no value for the attribute, we're using the shorthand:
          // `<UnderlineNav.Link selected />`
          if (attributePath.node.value === null) {
            j(attributePath).replaceWith(j.jsxAttribute(j.jsxIdentifier('aria-current'), j.stringLiteral('page')))
          } else {
            // Otherwise, we have an expression being used to set the value of
            // the prop:
            // `<UnderlineNav.Link selected={expression} />`
            //
            // To transform this, we will use that expression and put it in a
            // ternary that will set whether `'page'` or `undefined` will be the
            // value of `aria-current`
            j(attributePath).replaceWith(
              j.jsxAttribute(
                j.jsxIdentifier('aria-current'),
                j.jsxExpressionContainer(
                  j.conditionalExpression(
                    attributePath.node.value.expression,
                    j.stringLiteral('page'),
                    j.identifier('undefined'),
                  ),
                ),
              ),
            )
          }
        })

      // Remove `full` prop
      j(path)
        .find(j.JSXAttribute, {
          name: {
            name: 'full',
          },
        })
        .forEach(attributePath => {
          j(attributePath).remove()
        })
    })

  preserveLeadingComments()

  return format(file, root.toSource())
}

module.exports = transform
module.exports.parser = 'tsx'
