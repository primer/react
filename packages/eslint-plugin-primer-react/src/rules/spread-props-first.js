module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      spreadPropsFirst:
        'Spread props should come before other props to avoid unintentional overrides. Move {{spreadProp}} before {{namedProp}}.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const attributes = node.attributes

        // Track if we've seen a named prop before a spread
        let lastNamedPropIndex = -1
        let firstSpreadAfterNamedPropIndex = -1

        for (let i = 0; i < attributes.length; i++) {
          const attr = attributes[i]

          if (attr.type === 'JSXAttribute') {
            // This is a named prop
            lastNamedPropIndex = i
          } else if (attr.type === 'JSXSpreadAttribute' && lastNamedPropIndex !== -1) {
            // This is a spread prop that comes after a named prop
            if (firstSpreadAfterNamedPropIndex === -1) {
              firstSpreadAfterNamedPropIndex = i
            }
          }
        }

        // If we found a spread after a named prop, report it
        if (firstSpreadAfterNamedPropIndex !== -1) {
          const sourceCode = context.sourceCode
          const spreadAttr = attributes[firstSpreadAfterNamedPropIndex]
          const namedAttr = attributes[lastNamedPropIndex]

          context.report({
            node: spreadAttr,
            messageId: 'spreadPropsFirst',
            data: {
              spreadProp: sourceCode.getText(spreadAttr),
              namedProp: namedAttr.name.name,
            },
            fix(fixer) {
              // Collect all spreads and named props
              const spreads = []
              const namedProps = []

              for (const attr of attributes) {
                if (attr.type === 'JSXSpreadAttribute') {
                  spreads.push(attr)
                } else if (attr.type === 'JSXAttribute') {
                  namedProps.push(attr)
                }
              }

              // Generate the reordered attributes text
              const reorderedAttrs = [...spreads, ...namedProps]
              const fixes = []

              // Replace each attribute with its new position
              for (let i = 0; i < attributes.length; i++) {
                const newAttr = reorderedAttrs[i]
                const oldAttr = attributes[i]

                if (newAttr !== oldAttr) {
                  fixes.push(fixer.replaceText(oldAttr, sourceCode.getText(newAttr)))
                }
              }

              return fixes
            },
          })
        }
      },
    }
  },
}
