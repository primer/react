const {availableCasings, casingMatches} = require('../utils/casing-matches')
const {identifierIsCSSModuleBinding} = require('../utils/css-modules')

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        properties: {
          casing: {
            enum: availableCasings,
          },
        },
      },
    ],
    messages: {
      bad: 'Class names should be in a recognisable case, and either an identifier or literal, saw: {{ type }}',
      camel: 'Class names should be camelCase in both CSS and JS, saw: {{ name }}',
      pascal: 'Class names should be PascalCase in both CSS and JS, saw: {{ name }}',
      kebab: 'Class names should be kebab-case in both CSS and JS, saw: {{ name }}',
    },
  },
  create(context) {
    const casing = context.options[0]?.casing || 'pascal'
    return {
      ['JSXAttribute[name.name="className"] JSXExpressionContainer>Identifier']: function (node) {
        if (!identifierIsCSSModuleBinding(node, context)) return
        if (!casingMatches(node.name || '', casing)) {
          context.report({
            node,
            messageId: casing,
            data: {name: node.name},
          })
        }
      },
      ['JSXAttribute[name.name="className"] JSXExpressionContainer MemberExpression[object.type="Identifier"]']:
        function (node) {
          if (!identifierIsCSSModuleBinding(node.object, context)) return
          if (!node.computed && node.property?.type === 'Identifier') {
            if (!casingMatches(node.property.name || '', casing)) {
              context.report({
                node: node.property,
                messageId: casing,
                data: {name: node.property.name},
              })
            }
          } else if (node.property?.type === 'Literal') {
            if (!casingMatches(node.property.value || '', casing)) {
              context.report({
                node: node.property,
                messageId: casing,
                data: {name: node.property.value},
              })
            }
          } else if (node.computed) {
            const ref = context.sourceCode
              .getScope(node)
              .references.find(reference => reference.identifier.name === node.property.name)
            const def = ref?.resolved?.defs?.[0]
            if (def?.node?.init?.type === 'Literal') {
              if (!casingMatches(def.node.init.value || '', casing)) {
                context.report({
                  node: node.property,
                  messageId: casing,
                  data: {name: def.node.init.value},
                })
              }
            } else {
              context.report({
                node: node.property,
                messageId: 'bad',
                data: {type: node.property.type},
              })
            }
          } else {
            context.report({
              node: node.property,
              messageId: 'bad',
              data: {type: node.property.type},
            })
          }
        },
    }
  },
}
