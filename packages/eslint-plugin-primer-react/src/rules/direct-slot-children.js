const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {last} = require('lodash')

const slotParentToChildMap = {
  PageLayout: ['PageLayout.Header', 'PageLayout.Footer'],
  SplitPageLayout: ['SplitPageLayout.Header', 'SplitPageLayout.Footer'],
  FormControl: ['FormControl.Label', 'FormControl.Caption', 'FormControl.LeadingVisual', 'FormControl.TrailingVisual'],
  'ActionList.Item': ['ActionList.LeadingVisual', 'ActionList.TrailingVisual', 'ActionList.Description'],
  'ActionList.LinkItem': ['ActionList.LeadingVisual', 'ActionList.TrailingVisual', 'ActionList.Description'],
  'NavList.Item': ['NavList.LeadingVisual', 'NavList.TrailingVisual'],
  'TreeView.Item': ['TreeView.LeadingVisual', 'TreeView.TrailingVisual'],
  RadioGroup: ['RadioGroup.Label', 'RadioGroup.Caption', 'RadioGroup.Validation'],
  CheckboxGroup: ['CheckboxGroup.Label', 'CheckboxGroup.Caption', 'CheckboxGroup.Validation'],
  MarkdownEditor: ['MarkdownEditor.Toolbar', 'MarkdownEditor.Actions', 'MarkdownEditor.Label'],
  'MarkdownEditor.Footer': ['MarkdownEditor.Actions', 'MarkdownEditor.FooterButton'],
}

const slotChildToParentMap = Object.entries(slotParentToChildMap).reduce((acc, [parent, children]) => {
  for (const child of children) {
    if (acc[child]) {
      acc[child].push(parent)
    } else {
      acc[child] = [parent]
    }
  }
  return acc
}, {})

module.exports = {
  meta: {
    type: 'problem',
    schema: [
      {
        properties: {
          skipImportCheck: {
            type: 'boolean',
          },
        },
      },
    ],
    messages: {
      directSlotChildren: '{{childName}} must be a direct child of {{parentName}}.',
    },
  },
  create(context) {
    const stack = []
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXOpeningElement(jsxNode) {
        const name = getJSXOpeningElementName(jsxNode)

        // If `skipImportCheck` is true, this rule will check for direct slot children
        // in any components (not just ones that are imported from `@primer/react`).
        const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false

        // If component is a Primer component and a slot child,
        // check if it's a direct child of the slot parent
        if (
          (skipImportCheck || isPrimerComponent(jsxNode.name, sourceCode.getScope(jsxNode))) &&
          slotChildToParentMap[name]
        ) {
          const expectedParentNames = slotChildToParentMap[name]
          const parent = last(stack)
          if (!expectedParentNames.includes(parent)) {
            context.report({
              node: jsxNode,
              messageId: 'directSlotChildren',
              data: {
                childName: name,
                parentName: expectedParentNames.length > 1 ? expectedParentNames.join(' or ') : expectedParentNames[0],
              },
            })
          }
        }

        // If tag is not self-closing, push it onto the stack
        if (!jsxNode.selfClosing) {
          stack.push(name)
        }
      },
      JSXClosingElement() {
        // Pop the current element off the stack
        stack.pop()
      },
    }
  },
}
