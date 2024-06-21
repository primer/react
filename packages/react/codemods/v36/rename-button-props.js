'use strict'

const {setupPreserveLeadingComments} = require('../lib/preserveLeadingComments')
const {format} = require('../lib/format')

function transform(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  const preserveLeadingComments = setupPreserveLeadingComments(j, root)
  const jsxElements = root
    .find(j.ImportDeclaration, {
      source: {
        value: '@primer/react',
      },
    })
    .filter(path => {
      return path.value.specifiers.some(specifier => {
        return specifier.imported.name === 'Button'
      })
    })
    .map(path => {
      const importSpecifier = path.value.specifiers.find(specifier => {
        return specifier.imported.name === 'Button'
      })
      return j(path).closestScope().findJSXElements(importSpecifier.local.name).paths()
    })

  jsxElements.forEach(path => {
    j(path)
      .find(j.JSXAttribute)
      .forEach(attributePath => {
        const jsxAttribute = attributePath.value
        const name = jsxAttribute.name.name

        if (name === 'leadingIcon') {
          j(attributePath.get('name')).replaceWith(j.jsxIdentifier('leadingVisual'))
        }

        if (name === 'trailingIcon') {
          j(attributePath.get('name')).replaceWith(j.jsxIdentifier('trailingVisual'))
        }

        if (name === 'variant' && jsxAttribute.value.value === 'outline') {
          j(attributePath.get('value')).replaceWith(j.stringLiteral('invisible'))
        }
      })
  })

  preserveLeadingComments()

  return format(file, root.toSource())
}

module.exports = transform
module.exports.parser = 'tsx'
