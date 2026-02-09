const cssVars = require('../utils/css-variable-map.json')

const reportError = (propertyName, valueNode, context, suggestFix = true) => {
  // performance optimisation: exit early
  if (valueNode.type !== 'Literal' && valueNode.type !== 'TemplateElement') return
  // get property value
  const value = valueNode.type === 'Literal' ? valueNode.value : valueNode.value.cooked
  // return if value is not a string
  if (typeof value !== 'string') return
  // return if value does not include variable
  if (!value.includes('var(')) return

  const varRegex = /var\([^)]+\)/g

  const match = value.match(varRegex)
  if (!match) return
  const vars = match.flatMap(match =>
    match
      .slice(4, -1)
      .trim()
      .split(/\s*,\s*/g),
  )

  for (const cssVar of vars) {
    // get the array of objects for the variable name (e.g. --color-fg-primary)
    const cssVarObjects = cssVars[cssVar]
    // get the object that contains the property name or the first one (default)
    const varObjectForProp = propertyName
      ? cssVarObjects?.find(prop => prop.props.includes(propertyName))
      : cssVarObjects?.[0]
    // return if no replacement exists
    if (!varObjectForProp?.replacement) return
    // report the error
    context.report({
      node: valueNode,
      message: `Replace var(${cssVar}) with var(${varObjectForProp.replacement})`,
      fix: suggestFix
        ? fixer => {
            const fixedString = value.replaceAll(cssVar, `${varObjectForProp.replacement}`)
            return fixer.replaceText(valueNode, valueNode.type === 'Literal' ? `'${fixedString}'` : fixedString)
          }
        : undefined,
    })
  }
}

const reportOnObject = (node, context) => {
  const propertyName = node.key.name
  if (node.value?.type === 'Literal') {
    reportError(propertyName, node.value, context)
  } else if (node.value?.type === 'ConditionalExpression') {
    reportError(propertyName, node.value.consequent, context)
    reportError(propertyName, node.value.alternate, context)
  }
}

const reportOnProperty = (node, context) => {
  const propertyName = node.name.name
  if (node.value?.type === 'Literal') {
    reportError(propertyName, node.value, context)
  } else if (node.value?.type === 'JSXExpressionContainer' && node.value.expression?.type === 'ConditionalExpression') {
    reportError(propertyName, node.value.expression.consequent, context)
    reportError(propertyName, node.value.expression.alternate, context)
  }
}

const reportOnValue = (node, context) => {
  if (node?.type === 'Literal') {
    reportError(undefined, node, context)
  } else if (node?.type === 'JSXExpressionContainer' && node.expression?.type === 'ConditionalExpression') {
    reportError(undefined, node.value.expression.consequent, context)
    reportError(undefined, node.value.expression.alternate, context)
  }
}

const reportOnTemplateElement = (node, context) => {
  reportError(undefined, node, context, false)
}

module.exports = {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    fixable: 'code',
    docs: {
      description: 'Upgrade legacy CSS variables to Primitives v8 in sx prop',
    },
    schema: [
      {
        type: 'object',
        properties: {
          skipImportCheck: {
            type: 'boolean',
          },
          checkAllStrings: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    return {
      // sx OR style property on elements
      ['JSXAttribute:matches([name.name=sx], [name.name=style]) ObjectExpression Property']: node =>
        reportOnObject(node, context),
      // variable that is an object
      [':matches(VariableDeclarator, ReturnStatement, ConditionalExpression, ArrowFunctionExpression, CallExpression) > ObjectExpression Property, :matches(VariableDeclarator, ReturnStatement, ConditionalExpression, ArrowFunctionExpression, CallExpression) > ObjectExpression Property > ObjectExpression Property']:
        node => reportOnObject(node, context),
      // property on element like stroke or fill
      ['JSXAttribute[name.name!=sx][name.name!=style]']: node => reportOnProperty(node, context),
      // variable that is a value
      [':matches(VariableDeclarator, ReturnStatement) > Literal']: node => reportOnValue(node, context),
      // variable that is a value
      ['VariableDeclarator TemplateElement']: node => reportOnTemplateElement(node, context),
    }
  },
}
