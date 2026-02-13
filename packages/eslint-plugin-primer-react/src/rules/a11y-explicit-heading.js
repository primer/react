const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

const isHeadingComponent = elem => getJSXOpeningElementName(elem) === 'Heading'
const isUsingAsProp = elem => {
  const componentAs = getJSXOpeningElementAttribute(elem, 'as')

  if (!componentAs) return

  return componentAs.value
}

const isValidAsUsage = value => validHeadings.includes(value.toLowerCase())
const isInvalid = elem => {
  if (elem.attributes.length === 1 && elem.attributes[0].type === 'JSXSpreadAttribute') return

  const elemAs = isUsingAsProp(elem)

  if (!elemAs) return 'nonExplicitHeadingLevel'
  if (elemAs.value && !isValidAsUsage(elemAs.value)) return 'invalidAsValue'

  return false
}

module.exports = {
  meta: {
    docs: {
      description: 'Heading component must have explicit heading level, and specific `as` usage.',
      url: require('../url')(module),
    },
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
      nonExplicitHeadingLevel: 'Heading must have an explicit heading level applied through the `as` prop.',
      invalidAsValue: 'Usage of `as` must only be used for heading elements (h1-h6).',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXOpeningElement(jsxNode) {
        const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false

        if (
          (skipImportCheck || isPrimerComponent(jsxNode.name, sourceCode.getScope(jsxNode))) &&
          isHeadingComponent(jsxNode)
        ) {
          const error = isInvalid(jsxNode)

          if (error) {
            context.report({
              node: jsxNode,
              messageId: error,
            })
          }
        }
      },
    }
  },
}
