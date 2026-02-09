'use strict'

const url = require('../url')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')

// Default components that should be imported from @primer/styled-react when used with sx prop
const defaultStyledComponents = [
  'ActionList',
  'ActionMenu',
  'Box',
  'Breadcrumbs',
  'Button',
  'Flash',
  'FormControl',
  'Heading',
  'IconButton',
  'Label',
  'Link',
  'LinkButton',
  'PageLayout',
  'Text',
  'TextInput',
  'Truncate',
  'Octicon',
  'Dialog',
  'ThemeProvider',
  'BaseStyles',
]

const componentsToAlwaysImportFromStyledReact = new Set(['ThemeProvider', 'BaseStyles'])

// Default types that should be imported from @primer/styled-react
const defaultStyledTypes = ['BoxProps', 'SxProp', 'BetterSystemStyleObject']

// Default utilities that should be imported from @primer/styled-react
const defaultStyledUtilities = ['sx', 'useTheme']

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce importing components that use sx prop from @primer/styled-react',
      recommended: false,
      url: url(module),
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          styledComponents: {
            type: 'array',
            items: {type: 'string'},
            description: 'Components that should be imported from @primer/styled-react when used with sx prop',
          },
          styledTypes: {
            type: 'array',
            items: {type: 'string'},
            description: 'Types that should be imported from @primer/styled-react',
          },
          styledUtilities: {
            type: 'array',
            items: {type: 'string'},
            description: 'Utilities that should be imported from @primer/styled-react',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useStyledReactImport: 'Import {{ componentName }} from "@primer/styled-react" when using with sx prop',
      moveToStyledReact: 'Move {{ importName }} import to "@primer/styled-react"',
      usePrimerReactImport: 'Import {{ componentName }} from "@primer/react" when not using sx prop',
    },
  },
  create(context) {
    // Get configuration options or use defaults
    const options = context.options[0] || {}
    const styledComponents = new Set(options.styledComponents || defaultStyledComponents)
    const styledTypes = new Set(options.styledTypes || defaultStyledTypes)
    const styledUtilities = new Set(options.styledUtilities || defaultStyledUtilities)
    const componentsWithSx = new Set()
    const componentsWithoutSx = new Set() // Track components used without sx
    const allUsedComponents = new Set() // Track all used components
    const primerReactImports = new Map() // Map of component name to import node
    const styledReactImports = new Map() // Map of components imported from styled-react to import node

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value

        if (importSource === '@primer/react' || importSource.startsWith('@primer/react/')) {
          // Track imports from @primer/react and its subpaths
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              const importedName = specifier.imported.name
              if (
                styledComponents.has(importedName) ||
                styledTypes.has(importedName) ||
                styledUtilities.has(importedName)
              ) {
                primerReactImports.set(importedName, {node, specifier, importSource})
              }
            }
          }
        } else if (importSource === '@primer/styled-react' || importSource.startsWith('@primer/styled-react/')) {
          // Track what's imported from styled-react and its subpaths
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              const importedName = specifier.imported.name
              styledReactImports.set(importedName, {node, specifier, importSource})
            }
          }
        }
      },

      JSXElement(node) {
        const openingElement = node.openingElement
        const componentName = getJSXOpeningElementName(openingElement)

        // For compound components like "ActionList.Item", we need to check the parent component
        const parentComponentName = componentName.includes('.') ? componentName.split('.')[0] : componentName

        // Track all used components that are in our styled components list
        if (styledComponents.has(parentComponentName)) {
          allUsedComponents.add(parentComponentName)

          // Check if this component has an sx prop
          const hasSxProp = openingElement.attributes.some(
            attr => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'sx',
          )

          if (hasSxProp) {
            componentsWithSx.add(parentComponentName)
          } else {
            componentsWithoutSx.add(parentComponentName)
          }
        }
      },

      'Program:exit': function () {
        // Group components by import node to handle multiple changes to same import
        const importNodeChanges = new Map()

        // Collect all changes needed for components used with sx prop
        for (const componentName of componentsWithSx) {
          const importInfo = primerReactImports.get(componentName)
          if (importInfo && !styledReactImports.has(componentName)) {
            const {node: importNode} = importInfo

            if (!importNodeChanges.has(importNode)) {
              importNodeChanges.set(importNode, {
                toMove: [],
                originalSpecifiers: [...importNode.specifiers],
              })
            }

            importNodeChanges.get(importNode).toMove.push(componentName)
          }
        }

        // Report errors for components used with sx prop that are imported from @primer/react
        for (const componentName of componentsWithSx) {
          const importInfo = primerReactImports.get(componentName)
          if (importInfo && !styledReactImports.has(componentName)) {
            context.report({
              node: importInfo.specifier,
              messageId: 'useStyledReactImport',
              data: {componentName},
              fix(fixer) {
                const {node: importNode, importSource} = importInfo
                const changes = importNodeChanges.get(importNode)

                if (!changes) {
                  return null
                }

                // Only apply the fix once per import node (for the first component processed)
                const isFirstComponent = changes.toMove[0] === componentName

                if (!isFirstComponent) {
                  return null
                }

                const fixes = []
                const componentsToMove = new Set(changes.toMove)

                // Find specifiers that remain in original import
                const remainingSpecifiers = changes.originalSpecifiers.filter(spec => {
                  const name = spec.imported.name
                  return !componentsToMove.has(name)
                })

                // Convert @primer/react path to @primer/styled-react path
                const styledReactPath = importSource.replace('@primer/react', '@primer/styled-react')

                // If no components remain, replace with new import directly
                if (remainingSpecifiers.length === 0) {
                  const movedComponents = changes.toMove.join(', ')
                  fixes.push(fixer.replaceText(importNode, `import { ${movedComponents} } from '${styledReactPath}'`))
                } else {
                  // Otherwise, update the import to only include remaining components
                  const remainingNames = remainingSpecifiers.map(spec => spec.imported.name)
                  fixes.push(
                    fixer.replaceText(importNode, `import { ${remainingNames.join(', ')} } from '${importSource}'`),
                  )

                  // Add new styled-react import
                  const movedComponents = changes.toMove.join(', ')
                  fixes.push(
                    fixer.insertTextAfter(importNode, `\nimport { ${movedComponents} } from '${styledReactPath}'`),
                  )
                }

                return fixes
              },
            })
          }
        }

        // Group styled-react imports that need to be moved to primer-react
        const styledReactImportNodeChanges = new Map()

        // Collect components that need to be moved from styled-react to primer-react
        for (const componentName of allUsedComponents) {
          if (!componentsWithSx.has(componentName) && styledReactImports.has(componentName)) {
            const importInfo = styledReactImports.get(componentName)
            const {node: importNode} = importInfo

            if (!styledReactImportNodeChanges.has(importNode)) {
              styledReactImportNodeChanges.set(importNode, {
                toMove: [],
                originalSpecifiers: [...importNode.specifiers],
              })
            }

            styledReactImportNodeChanges.get(importNode).toMove.push(componentName)
          }
        }

        // Find existing primer-react import nodes to merge with
        const primerReactImportNodes = new Set()
        for (const [, {node}] of primerReactImports) {
          primerReactImportNodes.add(node)
        }

        // Report errors for components used WITHOUT sx prop that are imported from @primer/styled-react
        for (const componentName of allUsedComponents) {
          // If component is used but NOT with sx prop, and it's imported from styled-react
          if (
            !componentsWithSx.has(componentName) &&
            styledReactImports.has(componentName) &&
            !componentsToAlwaysImportFromStyledReact.has(componentName)
          ) {
            const importInfo = styledReactImports.get(componentName)
            context.report({
              node: importInfo.specifier,
              messageId: 'usePrimerReactImport',
              data: {componentName},
              fix(fixer) {
                const {node: importNode, importSource} = importInfo
                const changes = styledReactImportNodeChanges.get(importNode)

                if (!changes) {
                  return null
                }

                // Only apply the fix once per import node (for the first component processed)
                const isFirstComponent = changes.toMove[0] === componentName

                if (!isFirstComponent) {
                  return null
                }

                const fixes = []
                const componentsToMove = new Set(changes.toMove)

                // Find specifiers that remain in styled-react import
                const remainingSpecifiers = changes.originalSpecifiers.filter(spec => {
                  const name = spec.imported.name
                  return !componentsToMove.has(name)
                })

                // Convert @primer/styled-react path to @primer/react path
                const primerReactPath = importSource.replace('@primer/styled-react', '@primer/react')

                // Check if there's an existing primer-react import to merge with
                const existingPrimerReactImport = Array.from(primerReactImportNodes)[0]

                if (existingPrimerReactImport && remainingSpecifiers.length === 0) {
                  // Case: No remaining styled-react imports, merge with existing primer-react import
                  const existingSpecifiers = existingPrimerReactImport.specifiers.map(spec => spec.imported.name)
                  const newSpecifiers = [...existingSpecifiers, ...changes.toMove].filter(
                    (name, index, arr) => arr.indexOf(name) === index,
                  )

                  fixes.push(
                    fixer.replaceText(
                      existingPrimerReactImport,
                      `import { ${newSpecifiers.join(', ')} } from '${primerReactPath}'`,
                    ),
                  )
                  fixes.push(fixer.remove(importNode))
                } else if (existingPrimerReactImport && remainingSpecifiers.length > 0) {
                  // Case: Some styled-react imports remain, merge moved components with existing primer-react
                  const existingSpecifiers = existingPrimerReactImport.specifiers.map(spec => spec.imported.name)
                  const newSpecifiers = [...existingSpecifiers, ...changes.toMove].filter(
                    (name, index, arr) => arr.indexOf(name) === index,
                  )

                  fixes.push(
                    fixer.replaceText(
                      existingPrimerReactImport,
                      `import { ${newSpecifiers.join(', ')} } from '${primerReactPath}'`,
                    ),
                  )

                  const remainingNames = remainingSpecifiers.map(spec => spec.imported.name)
                  fixes.push(
                    fixer.replaceText(importNode, `import { ${remainingNames.join(', ')} } from '${importSource}'`),
                  )
                } else if (remainingSpecifiers.length === 0) {
                  // Case: No existing primer-react import, no remaining styled-react imports
                  const movedComponents = changes.toMove.join(', ')
                  fixes.push(fixer.replaceText(importNode, `import { ${movedComponents} } from '${primerReactPath}'`))
                } else {
                  // Case: No existing primer-react import, some styled-react imports remain
                  const remainingNames = remainingSpecifiers.map(spec => spec.imported.name)
                  fixes.push(
                    fixer.replaceText(importNode, `import { ${remainingNames.join(', ')} } from '${importSource}'`),
                  )

                  const movedComponents = changes.toMove.join(', ')
                  fixes.push(
                    fixer.insertTextAfter(importNode, `\nimport { ${movedComponents} } from '${primerReactPath}'`),
                  )
                }

                return fixes
              },
            })
          }
        }

        // Also report for types, utilities and components that should always be from styled-react
        for (const [importName, importInfo] of primerReactImports) {
          if (
            (styledTypes.has(importName) ||
              styledUtilities.has(importName) ||
              componentsToAlwaysImportFromStyledReact.has(importName)) &&
            !styledReactImports.has(importName)
          ) {
            context.report({
              node: importInfo.specifier,
              messageId: 'moveToStyledReact',
              data: {importName},
              fix(fixer) {
                const {node: importNode, specifier, importSource} = importInfo

                const fixes = []

                // we consolidate all the fixes for the import in the first specifier
                const isFirst = importNode.specifiers[0] === specifier
                if (!isFirst) return null

                const specifiersToMove = importNode.specifiers.filter(specifier => {
                  const name = specifier.imported.name
                  return (
                    styledUtilities.has(name) ||
                    styledTypes.has(name) ||
                    componentsToAlwaysImportFromStyledReact.has(name)
                  )
                })

                const remainingSpecifiers = importNode.specifiers.filter(specifier => {
                  return !specifiersToMove.includes(specifier)
                })

                // Convert @primer/react path to @primer/styled-react path
                const styledReactPath = importSource.replace('@primer/react', '@primer/styled-react')

                if (remainingSpecifiers.length === 0) {
                  // if there are no remaining specifiers, we can remove the whole import
                  fixes.push(fixer.remove(importNode))
                } else {
                  const remainingNames = remainingSpecifiers.map(spec =>
                    spec.importKind === 'type' ? `type ${spec.imported.name}` : spec.imported.name,
                  )
                  fixes.push(
                    fixer.replaceText(importNode, `import { ${remainingNames.join(', ')} } from '${importSource}'`),
                  )
                }

                if (specifiersToMove.length > 0) {
                  const movedComponents = specifiersToMove.map(spec =>
                    spec.importKind === 'type' ? `type ${spec.imported.name}` : spec.imported.name,
                  )
                  const onNewLine = remainingSpecifiers.length > 0
                  fixes.push(
                    fixer.insertTextAfter(
                      importNode,
                      `${onNewLine ? '\n' : ''}import { ${movedComponents.join(', ')} } from '${styledReactPath}'`,
                    ),
                  )
                }

                return fixes
              },
            })
          }
        }
      },
    }
  },
}
