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
      return specifier.imported.name === 'Button'
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
            name: 'Counter',
          },
        },
      },
    })
    .forEach(path => {
      const children = path.node.children

      // If there is more than one child we are unable to perform the transform
      if (children.length > 1) {
        return
      }

      const [firstChild] = children
      let value = null

      if (firstChild.type === 'JSXText') {
        const parsed = parseInt(firstChild.value, 10)
        // Try to parse the value as a number
        if (!isNaN(parsed)) {
          value = j.numericLiteral(parsed)
        }
      } else if (firstChild.type === 'JSXExpressionContainer') {
        value = firstChild.expression
      }

      // Unable to map the value of the child to a prop
      if (value === null) {
        return
      }

      const button = j(path).closest(j.JSXElement, {
        openingElement: {
          name: {
            name: identifier,
          },
        },
      })

      // Unable to find a parent <Button> JSXElement
      if (button.length === 0) {
        return
      }

      let parentRemoved = false

      // {condition && <Button.Counter>5</Button.Counter>}
      if (path.parentPath.node.type === 'LogicalExpression') {
        value = j.conditionalExpression(path.parentPath.node.left, value, j.identifier('undefined'))

        parentRemoved = true
        j(path.parentPath.parentPath).remove()
      }

      // {condition ? <Button.Counter>5</Button.Counter> : null}
      if (path.parentPath.node.type === 'ConditionalExpression') {
        value = j.conditionalExpression(path.parentPath.node.test, value, j.identifier('undefined'))

        parentRemoved = true
        j(path.parentPath.parentPath).remove()
      }

      button.forEach(elementPath => {
        const {attributes} = elementPath.node.openingElement
        const countAttribute = attributes.find(attribute => {
          return attribute.name.name === 'count'
        })
        if (countAttribute) {
          return
        }

        attributes.push(j.jsxAttribute(j.jsxIdentifier('count'), j.jsxExpressionContainer(value)))
      })

      if (!parentRemoved) {
        j(path).remove()
      }
    })

  preserveLeadingComments()

  return format(file, root.toSource())
}

module.exports = transform
module.exports.parser = 'tsx'
