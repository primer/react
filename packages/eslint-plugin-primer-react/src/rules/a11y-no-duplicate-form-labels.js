const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

const isFormControl = node => getJSXOpeningElementName(node) === 'FormControl'
const isFormControlLabel = node => getJSXOpeningElementName(node) === 'FormControl.Label'
const isTextInput = node => getJSXOpeningElementName(node) === 'TextInput'

const hasAriaLabel = node => {
  const ariaLabel = getJSXOpeningElementAttribute(node, 'aria-label')
  return !!ariaLabel
}

const findFormControlLabel = (node, sourceCode) => {
  // Traverse up the parent chain to find FormControl
  let current = node.parent
  while (current) {
    if (
      current.type === 'JSXElement' &&
      isFormControl(current.openingElement) &&
      isPrimerComponent(current.openingElement.name, sourceCode.getScope(current))
    ) {
      // Found FormControl, now check if it has a FormControl.Label child
      return current.children.some(
        child =>
          child.type === 'JSXElement' &&
          isFormControlLabel(child.openingElement) &&
          isPrimerComponent(child.openingElement.name, sourceCode.getScope(child)),
      )
    }
    current = current.parent
  }
  return false
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent duplicate labels on form inputs by disallowing aria-label on TextInput when FormControl.Label is present.',
      url: require('../url')(module),
    },
    schema: [],
    messages: {
      duplicateLabel:
        'TextInput should not have aria-label when FormControl.Label is present. Use FormControl.Label with visuallyHidden prop if needed.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXOpeningElement(jsxNode) {
        if (isPrimerComponent(jsxNode.name, sourceCode.getScope(jsxNode)) && isTextInput(jsxNode)) {
          // Check if TextInput has aria-label
          if (hasAriaLabel(jsxNode)) {
            // Check if there's a FormControl.Label in the parent FormControl
            if (findFormControlLabel(jsxNode, sourceCode)) {
              context.report({
                node: jsxNode,
                messageId: 'duplicateLabel',
              })
            }
          }
        }
      },
    }
  },
}
