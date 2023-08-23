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

    identifier = specifier.local.name

    return !!specifier
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
          j(attributePath).replaceWith(j.jsxAttribute(j.jsxIdentifier('aria-current'), j.stringLiteral('page')))
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
