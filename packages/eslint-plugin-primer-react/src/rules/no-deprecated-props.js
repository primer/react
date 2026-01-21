'use strict'
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Avoid using deprecated `title` prop on `ActionList.Group` component. Use `ActionList.GroupHeading` instead.',
      recommended: true,
      url: 'https://primer.style/components/action-list/react/beta#actionlistgroupheading',
    },
    fixable: 'code',
    schema: [],
    messages: {
      titlePropDeprecated: 'The `title` prop is deprecated. Please use `ActionList.GroupHeading` instead.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const openingElName = getJSXOpeningElementName(node)
        if (openingElName !== 'ActionList.Group') {
          return
        }
        const title = getJSXOpeningElementAttribute(node, 'title')
        let groupTitle = ''
        if (title !== undefined) {
          context.report({
            node,
            messageId: 'titlePropDeprecated',
            fix(fixer) {
              // Group title is a string literal i.e. title="title"
              if (title.value.type === 'Literal') {
                groupTitle = title.value.value
                // Group title is a JSX expression i.e. title={title}
              } else if (title.value.type === 'JSXExpressionContainer') {
                groupTitle = context.sourceCode.getText(title.value)
              } else {
                // we don't provide fix for cases where the title prop is not a string literal or JSX expression
                return []
              }
              const start = title.range[0]
              const end = title.range[1]
              return [
                fixer.removeRange([start - 1, end]), // remove the space before the title as well
                fixer.insertTextAfterRange(
                  [node.range[1], node.range[1]],
                  `<ActionList.GroupHeading>${groupTitle}</ActionList.GroupHeading>`,
                ),
              ]
            },
          })
        }
      },
    }
  },
}
