import type {Rule} from 'eslint'

export const rule: Rule.RuleModule = {
  create(context) {
    return {
      JSXOpeningElement(node) {
        const index = node.attributes.findIndex(attribute => {
          return attribute.type === 'JSXSpreadAttribute'
        })
        if (index === -1) {
          return
        }

        if (index !== 0) {
          context.report({
            node,
            message: 'Spread attributes should be placed before other props',
          })
        }
      },
    }
  },
}
