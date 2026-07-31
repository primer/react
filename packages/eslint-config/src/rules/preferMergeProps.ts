import {ASTUtils, type TSESLint, type TSESTree} from '@typescript-eslint/utils'

type MessageIds = 'preferMergeProps'

const preferMergeProps: TSESLint.RuleModule<MessageIds> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require spread props on component root elements to use mergeProps',
    },
    messages: {
      preferMergeProps:
        'Spread props on a component root element with mergeProps so component and consumer props are merged intentionally.',
    },
    schema: [],
  },
  create(context) {
    const {sourceCode} = context

    if (isTestOrStoryFile(context.filename)) {
      return {}
    }

    return {
      JSXOpeningElement(node) {
        if (!isComponentRoot(node.parent) || !hasPropsToMerge(node)) {
          return
        }

        for (const attribute of node.attributes) {
          if (
            attribute.type === 'JSXSpreadAttribute' &&
            !isMergedProps(attribute.argument, sourceCode.getScope(attribute))
          ) {
            context.report({
              node: attribute,
              messageId: 'preferMergeProps',
            })
          }
        }
      },
    }
  },
}

function hasPropsToMerge(node: TSESTree.JSXOpeningElement): boolean {
  const spreadCount = node.attributes.filter(attribute => attribute.type === 'JSXSpreadAttribute').length
  if (spreadCount > 1) {
    return true
  }

  return node.attributes.some(attribute => {
    return (
      attribute.type === 'JSXAttribute' &&
      attribute.name.type === 'JSXIdentifier' &&
      attribute.name.name !== 'key' &&
      attribute.name.name !== 'ref'
    )
  })
}

function isTestOrStoryFile(filename: string): boolean {
  const normalizedFilename = filename.replaceAll('\\', '/')
  return (
    /(?:^|\/)__(?:tests|stories)__(?:\/|$)/u.test(normalizedFilename) ||
    /\.(?:spec|test|stories|story)\.[cm]?[jt]sx?$/u.test(normalizedFilename)
  )
}

function isComponentRoot(element: TSESTree.JSXElement): boolean {
  let expression: TSESTree.Node = element

  for (;;) {
    const parent: TSESTree.Node = expression.parent

    if (
      parent.type === 'ConditionalExpression' &&
      (parent.consequent === expression || parent.alternate === expression)
    ) {
      expression = parent
      continue
    }

    if (parent.type === 'LogicalExpression' && parent.right === expression) {
      expression = parent
      continue
    }

    if (isTypeScriptWrapper(parent)) {
      expression = parent
      continue
    }

    if (parent.type === 'ReturnStatement' && parent.argument === expression) {
      return isReturnedByComponent(parent)
    }

    if (parent.type === 'ArrowFunctionExpression' && parent.body === expression) {
      return isComponentFunction(parent)
    }

    if (parent.type === 'JSXElement' || parent.type === 'JSXFragment') {
      return false
    }

    return false
  }
}

function isTypeScriptWrapper(
  node: TSESTree.Node,
): node is
  | TSESTree.TSAsExpression
  | TSESTree.TSNonNullExpression
  | TSESTree.TSSatisfiesExpression
  | TSESTree.TSTypeAssertion {
  return (
    node.type === 'TSAsExpression' ||
    node.type === 'TSNonNullExpression' ||
    node.type === 'TSSatisfiesExpression' ||
    node.type === 'TSTypeAssertion'
  )
}

function isReturnedByComponent(statement: TSESTree.ReturnStatement): boolean {
  let ancestor = statement.parent

  while (ancestor.type !== 'Program') {
    if (isFunction(ancestor)) {
      return isComponentFunction(ancestor)
    }
    ancestor = ancestor.parent
  }

  return false
}

function isFunction(node: TSESTree.Node): node is ComponentFunction {
  return (
    node.type === 'ArrowFunctionExpression' || node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression'
  )
}

type ComponentFunction = TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration | TSESTree.FunctionExpression

function isComponentFunction(node: ComponentFunction): boolean {
  const name = getFunctionName(node)
  if (name !== null) {
    return isComponentName(name)
  }

  if (node.parent.type === 'ExportDefaultDeclaration') {
    return true
  }

  return isWrappedComponent(node)
}

function getFunctionName(node: ComponentFunction): string | null {
  if (node.parent.type === 'VariableDeclarator' && node.parent.init === node && node.parent.id.type === 'Identifier') {
    return node.parent.id.name
  }

  if (
    node.parent.type === 'AssignmentExpression' &&
    node.parent.right === node &&
    node.parent.left.type === 'Identifier'
  ) {
    return node.parent.left.name
  }

  if (node.type !== 'ArrowFunctionExpression' && node.id !== null) {
    return node.id.name
  }

  if (
    node.type === 'FunctionExpression' &&
    node.parent.type === 'MethodDefinition' &&
    node.parent.value === node &&
    node.parent.key.type === 'Identifier' &&
    node.parent.key.name === 'render'
  ) {
    return getClassName(node.parent.parent.parent)
  }

  return null
}

function getClassName(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression): string | null {
  if (node.id !== null) {
    return node.id.name
  }

  if (node.parent.type === 'VariableDeclarator' && node.parent.init === node && node.parent.id.type === 'Identifier') {
    return node.parent.id.name
  }

  if (node.parent.type === 'ExportDefaultDeclaration') {
    return 'DefaultExport'
  }

  return null
}

function isWrappedComponent(node: ComponentFunction): boolean {
  let expression: TSESTree.Node = node

  for (;;) {
    const parent: TSESTree.Node = expression.parent

    if (isTypeScriptWrapper(parent)) {
      expression = parent
      continue
    }

    if (
      parent.type === 'CallExpression' &&
      parent.arguments.includes(expression as TSESTree.Expression) &&
      isComponentWrapper(parent.callee)
    ) {
      expression = parent
      continue
    }

    break
  }

  return (
    (expression.parent.type === 'VariableDeclarator' &&
      expression.parent.init === expression &&
      expression.parent.id.type === 'Identifier' &&
      isComponentName(expression.parent.id.name)) ||
    expression.parent.type === 'ExportDefaultDeclaration'
  )
}

function isComponentWrapper(callee: TSESTree.Expression): boolean {
  if (callee.type === 'Identifier') {
    return callee.name === 'forwardRef' || callee.name === 'fixedForwardRef' || callee.name === 'memo'
  }

  return (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.property.type === 'Identifier' &&
    (callee.property.name === 'forwardRef' || callee.property.name === 'memo')
  )
}

function isComponentName(name: string): boolean {
  return /^[A-Z]/u.test(name)
}

function isMergedProps(argument: TSESTree.Expression, scope: TSESLint.Scope.Scope): boolean {
  if (isMergePropsCall(argument)) {
    return true
  }

  if (argument.type !== 'Identifier') {
    return false
  }

  const variable = ASTUtils.findVariable(scope, argument)
  return (
    variable?.defs.some(definition => {
      return (
        definition.type === 'Variable' &&
        definition.parent.kind === 'const' &&
        definition.node.init !== null &&
        isMergePropsCall(definition.node.init)
      )
    }) ?? false
  )
}

function isMergePropsCall(argument: TSESTree.Expression): boolean {
  if (argument.type !== 'CallExpression') {
    return false
  }

  const {callee} = argument
  if (callee.type === 'Identifier') {
    return callee.name === 'mergeProps'
  }

  return (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'mergeProps'
  )
}

export {preferMergeProps}
