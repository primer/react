import {ASTUtils, type TSESLint, type TSESTree} from '@typescript-eslint/utils'

type MessageIds = 'preferMergeProps'

const preferMergeProps: TSESLint.RuleModule<MessageIds> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require spread props on outermost JSX elements to use mergeProps',
    },
    messages: {
      preferMergeProps:
        'Spread props on an outermost JSX element with mergeProps so component and consumer props are merged intentionally.',
    },
    schema: [],
  },
  create(context) {
    const {sourceCode} = context

    return {
      JSXOpeningElement(node) {
        if (!isOutermostElement(node.parent)) {
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

function isOutermostElement(element: TSESTree.JSXElement): boolean {
  let ancestor: TSESTree.Node | undefined = element.parent

  while (ancestor) {
    if (ancestor.type === 'JSXElement' || ancestor.type === 'JSXFragment') {
      return false
    }
    ancestor = ancestor.parent
  }

  return true
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
