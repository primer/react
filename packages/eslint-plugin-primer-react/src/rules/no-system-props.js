const {isPrimerComponent} = require('../utils/is-primer-component')
const {isHTMLElement} = require('../utils/is-html-element')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {pick} = require('@styled-system/props')
const {some, last} = require('lodash')

// Components for which we allow all styled system props
const alwaysExcludedComponents = new Set([
  'BaseStyles', // BaseStyles will be deprecated eventually
])

// Excluded by default, but optionally included:
const utilityComponents = new Set(['Box', 'Text'])

// Components for which we allow a set of prop names
const excludedComponentProps = new Map([
  ['ActionMenu.Overlay', new Set(['width', 'height', 'maxHeight', 'position', 'top', 'right', 'bottom', 'left'])],
  ['ActionMenu.Button', new Set(['alignContent'])],
  ['Autocomplete.Overlay', new Set(['width', 'height', 'maxHeight', 'position', 'top', 'right', 'bottom', 'left'])],
  ['AnchoredOverlay', new Set(['width', 'height'])],
  ['Avatar', new Set(['size'])],
  ['AvatarToken', new Set(['size'])],
  ['Blankslate', new Set(['border'])],
  ['Breadcrumbs', new Set(['overflow'])],
  ['Button', new Set(['alignContent'])],
  ['CircleOcticon', new Set(['size'])],
  ['ConfirmationDialog', new Set(['width', 'height'])],
  ['Dialog', new Set(['width', 'height', 'position'])],
  ['IssueLabelToken', new Set(['size'])],
  ['Overlay', new Set(['width', 'height', 'maxHeight', 'position', 'top', 'right', 'bottom', 'left'])],
  ['ProgressBar', new Set(['bg'])],
  ['Spinner', new Set(['size'])],
  ['SplitPageLayout.Header', new Set(['padding'])],
  ['SplitPageLayout.Footer', new Set(['padding'])],
  ['SplitPageLayout.Pane', new Set(['padding', 'position', 'width'])],
  ['SplitPageLayout.Content', new Set(['padding', 'width'])],
  ['StyledOcticon', new Set(['size'])],
  ['Octicon', new Set(['size', 'color'])],
  ['PointerBox', new Set(['bg'])],
  ['TextInput', new Set(['size'])],
  ['TextInputWithTokens', new Set(['size', 'maxHeight'])],
  ['Token', new Set(['size'])],
  ['PageLayout', new Set(['padding'])],
  ['PageLayout.Header', new Set(['padding'])],
  ['PageLayout.Footer', new Set(['padding'])],
  ['PageLayout.Pane', new Set(['padding', 'position', 'width'])],
  ['PageLayout.Content', new Set(['padding', 'width'])],
  ['ProgressBar', new Set(['bg'])],
  ['ProgressBar.Item', new Set(['bg'])],
  ['PointerBox', new Set(['bg'])],
  ['Truncate', new Set(['maxWidth'])],
  ['Stack', new Set(['padding', 'gap'])],
  ['SkeletonBox', new Set(['width', 'height'])],
])

const alwaysExcludedProps = new Set(['variant', 'size'])

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        properties: {
          skipImportCheck: {type: 'boolean'},
          includeUtilityComponents: {type: 'boolean'},
          ignoreNames: {type: 'array'},
        },
      },
    ],
    messages: {
      noSystemProps: 'Styled-system props are deprecated ({{ componentName }} called with props: {{ propNames }})',
    },
  },
  create(context) {
    // If `skipImportCheck` is true, this rule will check for deprecated styled system props
    // used in any components (not just ones that are imported from `@primer/react`).
    const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false
    const includeUtilityComponents = context.options[0] ? context.options[0].includeUtilityComponents : false
    const ignoreNames = context.options[0] ? context.options[0].ignoreNames || [] : []

    const excludedComponents = new Set([
      ...alwaysExcludedComponents,
      ...(includeUtilityComponents ? [] : utilityComponents),
    ])

    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      JSXOpeningElement(jsxNode) {
        if (skipImportCheck) {
          // if we skip checking if component is imported from primer,
          // we need to atleast skip html elements
          if (isHTMLElement(jsxNode)) return
        } else {
          // skip if component is not imported from primer/react
          if (!isPrimerComponent(jsxNode.name, sourceCode.getScope(jsxNode))) return
        }

        const componentName = getJSXOpeningElementName(jsxNode)
        if (ignoreNames.length && ignoreNames.includes(componentName)) return

        if (excludedComponents.has(componentName)) return

        // Create an object mapping from prop name to the AST node for that attribute
        const propsByNameObject = jsxNode.attributes.reduce((object, attribute) => {
          // We don't do anything about spreads for now — only named attributes
          if (attribute.type === 'JSXAttribute') {
            object[attribute.name.name] = attribute
          }

          return object
        }, {})

        // Create an array of system prop attribute nodes
        let systemProps = Object.values(pick(propsByNameObject))

        const excludedProps = excludedComponentProps.has(componentName)
          ? new Set([...alwaysExcludedProps, ...excludedComponentProps.get(componentName)])
          : alwaysExcludedProps

        // Filter out our exceptional props
        systemProps = systemProps.filter(prop => {
          return !excludedProps.has(prop.name.name)
        })

        if (systemProps.length !== 0) {
          context.report({
            node: jsxNode,
            messageId: 'noSystemProps',
            data: {
              componentName,
              propNames: systemProps.map(a => a.name.name).join(', '),
            },
            fix(fixer) {
              const existingSxProp = jsxNode.attributes.find(
                attribute => attribute.type === 'JSXAttribute' && attribute.name.name === 'sx',
              )
              const systemPropstylesMap = stylesMapFromPropNodes(systemProps, context)
              if (existingSxProp && existingSxProp.value.expression.type !== 'ObjectExpression') {
                return
              }

              const stylesToAdd = existingSxProp
                ? excludeSxEntriesFromStyleMap(systemPropstylesMap, existingSxProp)
                : systemPropstylesMap

              return [
                // Remove the bad props
                ...systemProps.map(node => fixer.remove(node)),
                ...(stylesToAdd.size > 0
                  ? [
                      existingSxProp
                        ? // Update an existing sx prop
                          fixer.insertTextAfter(
                            last(existingSxProp.value.expression.properties),
                            `, ${objectEntriesStringFromStylesMap(stylesToAdd)}`,
                          )
                        : // Insert new sx prop
                          fixer.insertTextAfter(last(jsxNode.attributes), sxPropTextFromStylesMap(systemPropstylesMap)),
                    ]
                  : []),
              ]
            },
          })
        }
      },
    }
  },
}

const sxPropTextFromStylesMap = styles => {
  return ` sx={{${objectEntriesStringFromStylesMap(styles)}}}`
}

const objectEntriesStringFromStylesMap = styles => {
  return [...styles].map(([name, value]) => `${name}: ${value}`).join(', ')
}

// Given an array of styled prop attributes, return a mapping from attribute to expression
const stylesMapFromPropNodes = (systemProps, context) => {
  return new Map(
    systemProps.map(a => [
      a.name.name,
      a.value === null ? 'true' : a.value.raw || context.getSourceCode().getText(a.value.expression),
    ]),
  )
}

// Given a style map and an existing sx prop, return a style map containing
// only the entries that aren't already overridden by an sx object entry
const excludeSxEntriesFromStyleMap = (stylesMap, sxProp) => {
  if (
    !sxProp.value ||
    sxProp.value.type !== 'JSXExpressionContainer' ||
    sxProp.value.expression.type !== 'ObjectExpression'
  ) {
    return stylesMap
  }
  return new Map(
    [...stylesMap].filter(([key]) => {
      return !some(sxProp.value.expression.properties, p => p.type === 'Property' && p.key.name === key)
    }),
  )
}
