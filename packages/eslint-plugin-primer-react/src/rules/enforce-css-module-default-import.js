module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        properties: {
          enforceName: {
            type: 'string',
          },
        },
      },
    ],
    messages: {
      badName: 'This default import should match {{enforceName}}',
      notDefault: 'Class modules should only import the default object.',
      noDefault: 'Class modules should always import default.',
    },
  },
  create(context) {
    const enforceName = new RegExp(context.options[0]?.enforceName || '.*')
    return {
      ['ImportDeclaration>Literal[value=/.module.css$/]']: function (node) {
        node = node.parent
        const defaultSpecifier = node.specifiers.find(spec => spec.type === 'ImportDefaultSpecifier')
        const otherSpecifiers = node.specifiers.filter(spec => spec.type !== 'ImportDefaultSpecifier')
        const asDefaultSpecifier = otherSpecifiers.find(spec => spec.imported?.name === 'default')
        if (!node.specifiers.length) {
          context.report({
            node,
            messageId: 'noDefault',
          })
        } else if (otherSpecifiers.length === 1 && asDefaultSpecifier) {
          if (!enforceName.test(asDefaultSpecifier.local.name)) {
            context.report({
              node,
              messageId: 'badName',
              data: {enforceName},
            })
          }
        } else if (otherSpecifiers.length) {
          context.report({
            node,
            messageId: 'notDefault',
          })
        } else if (!defaultSpecifier) {
          context.report({
            node,
            messageId: 'noDefault',
          })
        }
        if (defaultSpecifier && !enforceName.test(defaultSpecifier.local.name)) {
          context.report({
            node,
            messageId: 'badName',
            data: {enforceName},
          })
        }
      },
    }
  },
}
