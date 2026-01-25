'use strict'

const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Avoid using deprecated entrypoints from @primer/react',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === '@primer/react/drafts') {
          context.report({
            node,
            message:
              'The drafts entrypoint is deprecated and will be removed in the next major release. Use the experimental entrypoint instead',
            fix(fixer) {
              return fixer.replaceText(node.source, `'@primer/react/experimental'`)
            },
          })
        }
      },
    }
  },
}
