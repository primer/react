'use strict'

const url = require('../url')

const components = [
  {
    identifier: 'SelectPanel',
    entrypoint: '@primer/react/experimental',
  },
]

const entrypoints = new Map()

for (const component of components) {
  if (!entrypoints.has(component.entrypoint)) {
    entrypoints.set(component.entrypoint, new Set())
  }
  entrypoints.get(component.entrypoint).add(component.identifier)
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use a stable component from the `@primer/react` entrypoint, or check the docs for alternatives',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (!entrypoints.has(node.source.value)) {
          return
        }

        const entrypoint = entrypoints.get(node.source.value)

        const experimental = node.specifiers.filter(specifier => {
          return entrypoint.has(specifier.imported?.name)
        })

        const components = experimental.map(specifier => specifier.imported?.name)

        if (experimental.length === 0) {
          return
        }

        if (experimental.length > 0) {
          const message = `The experimental ${components.join(', ')} ${
            components.length > 1 ? 'are' : 'is'
          } deprecated. Please import from the stable entrypoint (@primer/react) if available. Check https://primer.style/product/getting-started/react/migration-guides/ for migration guidance or https://primer.style/product/components/ for alternative components.`

          context.report({
            node,
            message,
          })
        }
      },
    }
  },
}
