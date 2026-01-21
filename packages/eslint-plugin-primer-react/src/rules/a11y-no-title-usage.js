const url = require('../url')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Disallow usage of title attribute on some components',
      recommended: true,
      url: url(module),
    },
    messages: {
      noTitleOnRelativeTime: 'Avoid using the title attribute on RelativeTime.',
    },
    fixable: 'code',
  },

  create(context) {
    return {
      JSXOpeningElement(jsxNode) {
        const title = getJSXOpeningElementAttribute(jsxNode, 'noTitle')

        if (title && title.value && title.value.expression && title.value.expression.value !== true) {
          context.report({
            node: title,
            messageId: 'noTitleOnRelativeTime',
            fix(fixer) {
              const start = title.range[0] - 1
              const end = title.range[1]
              return fixer.removeRange([start, end])
            },
          })
        }
      },
    }
  },
}
