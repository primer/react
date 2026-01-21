'use strict'

const url = require('../url')

const components = [
  {
    identifier: 'Dialog',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'DialogProps',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'DialogHeaderProps',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'Octicon',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'OcticonProps',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'Pagehead',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'PageheadProps',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'TabNav',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'TabNavProps',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'TabNavLinkProps',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'Tooltip',
    entrypoint: '@primer/react',
  },
  {
    identifier: 'TooltipProps',
    entrypoint: '@primer/react',
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
      description: 'Use deprecated components from the `@primer/react/deprecated` entrypoint',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      ImportDeclaration(node) {
        if (!entrypoints.has(node.source.value)) {
          return
        }

        const entrypoint = entrypoints.get(node.source.value)
        const deprecated = node.specifiers.filter(specifier => {
          return entrypoint.has(specifier.imported.name)
        })

        if (deprecated.length === 0) {
          return
        }

        const deprecatedEntrypoint = node.parent.body.find(node => {
          if (node.type !== 'ImportDeclaration') {
            return false
          }

          return node.source.value === '@primer/react/deprecated'
        })

        // All imports are deprecated
        if (deprecated.length === node.specifiers.length) {
          context.report({
            node,
            message: 'Import deprecated components from @primer/react/deprecated',
            *fix(fixer) {
              if (deprecatedEntrypoint) {
                const lastSpecifier = deprecatedEntrypoint.specifiers[deprecatedEntrypoint.specifiers.length - 1]

                yield fixer.remove(node)
                yield fixer.insertTextAfter(
                  lastSpecifier,
                  `, ${node.specifiers.map(specifier => specifier.imported.name).join(', ')}`,
                )
              } else {
                yield fixer.replaceText(node.source, `'@primer/react/deprecated'`)
              }
            },
          })
        } else {
          // There is a mix of deprecated and non-deprecated imports
          context.report({
            node,
            message: 'Import deprecated components from @primer/react/deprecated',
            *fix(fixer) {
              for (const specifier of deprecated) {
                yield fixer.remove(specifier)
                const comma = sourceCode.getTokenAfter(specifier)
                if (comma.value === ',') {
                  yield fixer.remove(comma)
                }
              }

              if (deprecatedEntrypoint) {
                const lastSpecifier = deprecatedEntrypoint.specifiers[deprecatedEntrypoint.specifiers.length - 1]
                yield fixer.insertTextAfter(
                  lastSpecifier,
                  `, ${deprecated.map(specifier => specifier.imported.name).join(', ')}`,
                )
              } else {
                yield fixer.insertTextAfter(
                  node,
                  `\nimport {${deprecated
                    .map(specifier => specifier.imported.name)
                    .join(', ')}} from '@primer/react/deprecated'`,
                )
              }
            },
          })
        }
      },
    }
  },
}
