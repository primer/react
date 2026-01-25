'use strict'
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'error',
    docs: {
      description:
        'Icon buttons should have tooltip by default. Please remove `unsafeDisableTooltip` prop from `IconButton` component to enable the tooltip and help making icon button more accessible.',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      removeDisableTooltipProp:
        'Please remove `unsafeDisableTooltip` prop from `IconButton` component to enable the tooltip and help make icon button more accessible.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const openingElName = getJSXOpeningElementName(node)
        if (openingElName !== 'IconButton') {
          return
        }
        const unsafeDisableTooltip = getJSXOpeningElementAttribute(node, 'unsafeDisableTooltip')
        if (unsafeDisableTooltip !== undefined) {
          context.report({
            node,
            messageId: 'removeDisableTooltipProp',
            fix(fixer) {
              const start = unsafeDisableTooltip.range[0]
              const end = unsafeDisableTooltip.range[1]
              return [
                fixer.removeRange([start - 1, end]), // remove the space before unsafeDisableTooltip as well
              ]
            },
          })
        }
      },
    }
  },
}
