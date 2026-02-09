'use strict'

const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using useResponsiveValue hook',
      recommended: true,
      url: url(module),
    },
    schema: [],
    messages: {
      noUseResponsiveValue: 'useResponsiveValue is not allowed. Use alternative responsive patterns instead.',
    },
  },
  create(context) {
    return {
      // Check for import declarations
      ImportDeclaration(node) {
        // Check for @primer/react imports
        const isPrimerImport = /@primer\/react/.test(node.source.value)
        // Check for local imports that might be useResponsiveValue hook
        const isLocalUseResponsiveValueImport =
          node.source.value.includes('useResponsiveValue') || node.source.value.includes('/hooks/useResponsiveValue')

        if (!isPrimerImport && !isLocalUseResponsiveValueImport) {
          return
        }

        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'useResponsiveValue') {
            context.report({
              node: specifier,
              messageId: 'noUseResponsiveValue',
            })
          }
          // Also check for default imports from useResponsiveValue files
          if (specifier.type === 'ImportDefaultSpecifier' && isLocalUseResponsiveValueImport) {
            context.report({
              node: specifier,
              messageId: 'noUseResponsiveValue',
            })
          }
        }
      },
    }
  },
}
