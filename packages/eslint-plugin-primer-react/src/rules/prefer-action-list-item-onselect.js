// @ts-check

const messages = {
  'prefer-action-list-item-onselect': `Use the 'onSelect' event handler instead of 'onClick' for ActionList.Item components, so that it is accessible by keyboard and mouse.`,
}

/** @type {import('@typescript-eslint/utils/ts-eslint').RuleModule<keyof typeof messages>} */
module.exports = {
  meta: {
    docs: {
      description:
        'To do something when an `ActionList.Item` is selected, you should use the `onSelect` event handler instead of `onClick`, because it handles both keyboard and mouse events. Otherwise, it will only be accessible by mouse.',
      recommended: true,
    },
    messages,
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXElement(node) {
        // Only check components that have the name `ActionList.Item`. We don't check if this comes from Primer
        // because the chance of conflict here is very low
        const isActionListItem =
          node.openingElement.name.type === 'JSXMemberExpression' &&
          node.openingElement.name.object.type === 'JSXIdentifier' &&
          node.openingElement.name.object.name === 'ActionList' &&
          node.openingElement.name.property.name === 'Item'
        if (!isActionListItem) return

        const attributes = node.openingElement.attributes
        const onClickAttribute = attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'onClick')
        const onSelectAttribute = attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'onSelect')

        const keyboardHandlers = ['onKeyDown', 'onKeyUp']
        const keyboardAttributes = attributes.filter(
          attr =>
            attr.type === 'JSXAttribute' &&
            (typeof attr.name.name === 'string'
              ? keyboardHandlers.includes(attr.name.name)
              : keyboardHandlers.includes(attr.name.name.name)),
        )

        // If the component has `onSelect`, then it's already using the correct event
        if (onSelectAttribute) return
        // If there is no `onClick` attribute, then we should also be fine
        if (!onClickAttribute) return
        // If there is an onClick attribute as well as keyboard handlers, we will assume it is handled correctly
        if (onClickAttribute && keyboardAttributes.length > 0) return

        context.report({
          node: onClickAttribute,
          messageId: 'prefer-action-list-item-onselect',
          fix: fixer => {
            // Replace `onClick` with `onSelect`
            if (onClickAttribute.type === 'JSXAttribute') {
              return fixer.replaceText(onClickAttribute.name, 'onSelect')
            }
            return null
          },
        })
      },
    }
  },
}
