const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

module.exports = {
  meta: {
    docs: {
      url: require('../url')(module),
    },
    type: 'problem',
    schema: [
      {
        properties: {
          skipImportCheck: {
            type: 'boolean',
          },
        },
      },
    ],
    messages: {
      linkInTextBlock:
        'Links should have the inline prop if it appear in a text block and only uses color to distinguish itself from surrounding text.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXElement(node) {
        const name = getJSXOpeningElementName(node.openingElement)
        if (
          isPrimerComponent(node.openingElement.name, sourceCode.getScope(node)) &&
          name === 'Link' &&
          node.parent.children
        ) {
          // Skip if Link has className because we cannot deduce what styles are applied.
          const classNameAttribute = getJSXOpeningElementAttribute(node.openingElement, 'className')
          if (classNameAttribute) return

          let siblings = node.parent.children
          const parentName = node.parent.openingElement?.name?.name
          // Skip if Link is nested inside of a heading.
          const parentsToSkip = ['Heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
          if (parentsToSkip.includes(parentName)) return
          if (siblings.length > 0) {
            siblings = siblings.filter(childNode => {
              return (
                !(childNode.type === 'JSXText' && /^\s+$/.test(childNode.value)) &&
                !(
                  childNode.type === 'JSXExpressionContainer' &&
                  childNode.expression.type === 'Literal' &&
                  /^\s+$/.test(childNode.expression.value)
                ) &&
                !(childNode.type === 'Literal' && /^\s+$/.test(childNode.value))
              )
            })
            const index = siblings.findIndex(childNode => {
              return childNode.range === node.range
            })
            const prevSibling = siblings[index - 1]
            const nextSibling = siblings[index + 1]

            const prevSiblingIsText = prevSibling && prevSibling.type === 'JSXText'
            const nextSiblingIsText = nextSibling && nextSibling.type === 'JSXText'
            if (prevSiblingIsText || nextSiblingIsText) {
              // Skip if the only text adjacent to the link is a period, then skip it.
              if (!prevSiblingIsText && /^\s*\.+\s*$/.test(nextSibling.value)) {
                return
              }
              const sxAttribute = getJSXOpeningElementAttribute(node.openingElement, 'sx')
              const inlineAttribute = getJSXOpeningElementAttribute(node.openingElement, 'inline')

              // Skip if Link child is a JSX element.
              const jsxElementChildren = node.children.filter(child => {
                return child.type === 'JSXElement'
              })
              if (jsxElementChildren.length > 0) return

              // Skip if fontWeight or fontFamily is set via the sx prop since these may technically be considered sufficiently distinguishing styles that don't use color.
              if (
                sxAttribute &&
                sxAttribute?.value?.expression &&
                sxAttribute.value.expression.type === 'ObjectExpression' &&
                sxAttribute.value.expression.properties &&
                sxAttribute.value.expression.properties.length > 0
              ) {
                const fontStyleProperty = sxAttribute.value.expression.properties.filter(property => {
                  return property.key.name === 'fontWeight' || property.key.name === 'fontFamily'
                })
                if (fontStyleProperty.length > 0) return
              }
              if (inlineAttribute) {
                if (!inlineAttribute.value) {
                  return
                } else if (inlineAttribute.value.type === 'JSXExpressionContainer') {
                  if (inlineAttribute.value.expression.type === 'Literal') {
                    if (inlineAttribute.value.expression.value === true) {
                      return
                    }
                  }
                }
              }
              context.report({
                node,
                messageId: 'linkInTextBlock',
              })
            }
          }
        }
      },
    }
  },
}
