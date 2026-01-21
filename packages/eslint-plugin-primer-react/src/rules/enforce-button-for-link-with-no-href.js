const url = require('../url')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {isPrimerComponent} = require('../utils/is-primer-component')

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Disallow usage of Link component without href',
      recommended: true,
      url: url(module),
    },
    messages: {
      noLinkWithoutHref: 'Links without href and other side effects are not accessible. Use a Button instead.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXElement(node) {
        const openingElement = node.openingElement
        const elementName = getJSXOpeningElementName(openingElement)

        // Check if this is a Link component from @primer/react
        if (elementName === 'Link' && isPrimerComponent(openingElement.name, sourceCode.getScope(node))) {
          // Check if the Link has an href attribute
          const hrefAttribute = getJSXOpeningElementAttribute(openingElement, 'href')

          if (!hrefAttribute) {
            context.report({
              node: openingElement,
              messageId: 'noLinkWithoutHref',
            })
          }
        }
      },
    }
  },
}
