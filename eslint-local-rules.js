module.exports = {
  'css-out-js': {
    create: context => {
      return {
        JSXAttribute(attributeNode) {
          if (attributeNode.name.name !== 'sx') return

          const expression = attributeNode.value.expression

          if (!['ObjectExpression', 'Identifier'].includes(expression.type)) {
            context.report({
              node: attributeNode,
              message:
                '{{ propertyType }} can not be compiled out, read more: primer.style/react/css-out-js#not-supported',
              data: {propertyType: expression.type},
            })
          }
        },
      }
    },
  },
}
