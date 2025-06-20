import type {Rule} from 'eslint'

export const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    messages: {
      spreadBeforeProps: 'Spread attributes must be placed before other props',
    },
  },
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
            messageId: 'spreadBeforeProps',
            fix(fixer) {
              const {sourceCode} = context
              const attributes = node.attributes.slice()
              const [spreadAttribute] = attributes.splice(index, 1)
              attributes.unshift(spreadAttribute)

              // Get the range from the first attribute to the last attribute
              const firstAttr = node.attributes[0]
              const lastAttr = node.attributes[node.attributes.length - 1]
              const range: [number, number] = [firstAttr.range![0], lastAttr.range![1]]

              // Generate the new attributes text with proper spacing
              const newAttributesText = attributes.map(attr => sourceCode.getText(attr)).join(' ')

              return fixer.replaceTextRange(range, newAttributesText)
            },
          })
        }
      },
    }
  },
}
