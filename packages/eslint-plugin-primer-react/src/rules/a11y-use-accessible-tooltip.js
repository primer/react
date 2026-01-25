'use strict'
const url = require('../url')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'recommends the use of @primer/react Tooltip component',
      category: 'Best Practices',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
    messages: {
      useAccessibleTooltip: 'Please use @primer/react Tooltip component that has accessibility improvements',
      useTextProp: 'Please use the text prop instead of aria-label',
      noDelayRemoved: 'noDelay prop is removed. Tooltip now has no delay by default',
      wrapRemoved: 'wrap prop is removed. Tooltip now wraps by default',
      alignRemoved: 'align prop is removed. Please use the direction prop instead.',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@primer/react/deprecated') {
          return
        }
        const hasTooltip = node.specifiers.some(
          specifier => specifier.imported && specifier.imported.name === 'Tooltip',
        )

        if (!hasTooltip) {
          return
        }

        const hasOtherImports = node.specifiers.length > 1

        const sourceCode = context.getSourceCode()
        // Checking to see if there is an existing root (@primer/react) import
        // Assuming there is one root import per file
        const rootImport = sourceCode.ast.body.find(statement => {
          return statement.type === 'ImportDeclaration' && statement.source.value === '@primer/react'
        })

        const tooltipSpecifier = node.specifiers.find(
          specifier => specifier.imported && specifier.imported.name === 'Tooltip',
        )

        const hasRootImport = rootImport !== undefined

        context.report({
          node,
          messageId: 'useAccessibleTooltip',
          fix(fixer) {
            const fixes = []
            if (!hasOtherImports) {
              // If Tooltip is the only import and no existing @primer/react import, replace the whole import statement
              if (!hasRootImport) fixes.push(fixer.replaceText(node.source, `'@primer/react'`))
              if (hasRootImport) {
                //  remove the entire import statement
                fixes.push(fixer.remove(node))
                // find the last specifier in the existing @primer/react import and insert Tooltip after that
                const lastSpecifier = rootImport.specifiers[rootImport.specifiers.length - 1]
                fixes.push(fixer.insertTextAfter(lastSpecifier, `, Tooltip`))
              }
            } else {
              // There are other imports from the deprecated bundle but no existing @primer/react import, so remove the Tooltip import and add a new import statement with the correct path.
              const previousToken = sourceCode.getTokenBefore(tooltipSpecifier)
              const nextToken = sourceCode.getTokenAfter(tooltipSpecifier)
              const hasTrailingComma = nextToken && nextToken.value === ','
              const hasLeadingComma = previousToken && previousToken.value === ','

              let rangeToRemove

              if (hasTrailingComma) {
                rangeToRemove = [tooltipSpecifier.range[0], nextToken.range[1] + 1]
              } else if (hasLeadingComma) {
                rangeToRemove = [previousToken.range[0], tooltipSpecifier.range[1]]
              } else {
                rangeToRemove = [tooltipSpecifier.range[0], tooltipSpecifier.range[1]]
              }
              // Remove Tooltip from the import statement
              fixes.push(fixer.removeRange(rangeToRemove))

              if (!hasRootImport) {
                fixes.push(fixer.insertTextAfter(node, `\nimport {Tooltip} from '@primer/react';`))
              } else {
                // find the last specifier in the existing @primer/react import and insert Tooltip after that
                const lastSpecifier = rootImport.specifiers[rootImport.specifiers.length - 1]
                fixes.push(fixer.insertTextAfter(lastSpecifier, `, Tooltip`))
              }
            }
            return fixes
          },
        })
      },
      JSXOpeningElement(node) {
        const openingElName = getJSXOpeningElementName(node)
        if (openingElName !== 'Tooltip') {
          return
        }
        const ariaLabel = getJSXOpeningElementAttribute(node, 'aria-label')
        if (ariaLabel !== undefined) {
          context.report({
            node,
            messageId: 'useTextProp',
            fix(fixer) {
              return fixer.replaceText(ariaLabel.name, 'text')
            },
          })
        }
        const noDelay = getJSXOpeningElementAttribute(node, 'noDelay')
        if (noDelay !== undefined) {
          context.report({
            node,
            messageId: 'noDelayRemoved',
            fix(fixer) {
              return fixer.remove(noDelay)
            },
          })
        }
        const wrap = getJSXOpeningElementAttribute(node, 'wrap')
        if (wrap !== undefined) {
          context.report({
            node,
            messageId: 'wrapRemoved',
            fix(fixer) {
              return fixer.remove(wrap)
            },
          })
        }
        const align = getJSXOpeningElementAttribute(node, 'align')
        if (align !== undefined) {
          context.report({
            node,
            messageId: 'alignRemoved',
            fix(fixer) {
              return fixer.remove(align)
            },
          })
        }
      },
    }
  },
}
