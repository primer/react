const {getPropValue, propName} = require('jsx-ast-utils')
const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

const isInteractive = child => {
  const childName = getJSXOpeningElementName(child.openingElement)
  return (
    ['button', 'summary', 'select', 'textarea', 'a', 'input', 'link', 'iconbutton', 'textinput'].includes(
      childName.toLowerCase(),
    ) && !hasDisabledAttr(child)
  )
}

const hasDisabledAttr = child => {
  const hasDisabledAttr = getJSXOpeningElementAttribute(child.openingElement, 'disabled')
  return hasDisabledAttr
}

const isAnchorTag = el => {
  const openingEl = getJSXOpeningElementName(el.openingElement)
  return openingEl === 'a' || openingEl.toLowerCase() === 'link'
}

const isJSXValue = attributes => {
  const node = attributes.find(attribute => propName(attribute) === 'href' || propName(attribute))
  const isJSXExpression = node.value.type === 'JSXExpressionContainer' && node && typeof getPropValue(node) === 'string'

  return isJSXExpression
}

const isInteractiveAnchor = child => {
  const hasHref = getJSXOpeningElementAttribute(child.openingElement, 'href')
  const hasTo = getJSXOpeningElementAttribute(child.openingElement, 'to')

  if (!hasHref && !hasTo) return false

  const href = hasHref
    ? getJSXOpeningElementAttribute(child.openingElement, 'href').value.value
    : getJSXOpeningElementAttribute(child.openingElement, 'to').value.value

  const hasJSXValue = isJSXValue(child.openingElement.attributes)
  const isAnchorInteractive = (typeof href === 'string' && href !== '') || hasJSXValue

  return isAnchorInteractive
}

const isInputTag = el => {
  const openingEl = getJSXOpeningElementName(el.openingElement)
  return openingEl === 'input' || openingEl.toLowerCase() === 'textinput'
}

const isInteractiveInput = child => {
  const hasHiddenType =
    getJSXOpeningElementAttribute(child.openingElement, 'type') &&
    getJSXOpeningElementAttribute(child.openingElement, 'type').value.value === 'hidden'
  return !hasHiddenType && !hasDisabledAttr(child)
}

const isOtherThanAnchorOrInput = el => {
  return !isAnchorTag(el) && !isInputTag(el)
}

const getAllChildren = node => {
  if (Array.isArray(node.children)) {
    return node.children
      .filter(child => {
        return child.type === 'JSXElement'
      })
      .flatMap(child => {
        return [child, ...getAllChildren(child)]
      })
  }
  return []
}

const checks = [
  {
    id: 'nonInteractiveLink',
    filter: jsxElement => isAnchorTag(jsxElement),
    check: isInteractiveAnchor,
  },
  {
    id: 'nonInteractiveInput',
    filter: jsxElement => isInputTag(jsxElement),
    check: isInteractiveInput,
  },
  {
    id: 'nonInteractiveTrigger',
    filter: jsxElement => isOtherThanAnchorOrInput(jsxElement),
    check: isInteractive,
  },
]

const checkTriggerElement = jsxNode => {
  const elements = [...getAllChildren(jsxNode)]
  const hasInteractiveElement = elements.find(element => {
    const openingEl = getJSXOpeningElementName(element.openingElement)
    if (openingEl === 'a' || openingEl === 'Link') {
      return isInteractiveAnchor(element)
    }
    if (openingEl === 'input' || openingEl === 'TextInput') {
      return isInteractiveInput(element)
    } else {
      return isInteractive(element)
    }
  })

  // If the tooltip has interactive elements, return.
  if (hasInteractiveElement) return

  const errors = new Set()

  for (const element of elements) {
    for (const check of checks) {
      if (!check.filter(element)) {
        continue
      }

      if (!check.check(element)) {
        errors.add(check.id)
      }
    }
  }
  // check the specificity of the errors. If there are multiple errors, only return the most specific one.
  if (errors.size > 1) {
    if (errors.has('nonInteractiveLink')) {
      errors.delete('nonInteractiveTrigger')
    }
    if (errors.has('nonInteractiveInput')) {
      errors.delete('nonInteractiveTrigger')
    }
  }

  return errors
}

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
      nonInteractiveTrigger:
        'Tooltips should only be applied to interactive elements that are not disabled. Consider using a `<button>` or equivalent interactive element instead.',
      nonInteractiveLink:
        'Anchor tags without an href attribute are not interactive, therefore they cannot be used as a trigger for a tooltip. Please add an href attribute or use an alternative interactive element instead',
      nonInteractiveInput:
        'Hidden or disabled inputs are not interactive and cannot be used as a trigger for a tooltip. Please use an alternate input type or use a different interactive element instead',
      singleChild: 'The `Tooltip` component expects a single React element as a child.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXElement(jsxNode) {
        // If `skipImportCheck` is true, this rule will check for non-interactive element in any components (not just ones that are imported from `@primer/react`).
        const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false
        const name = getJSXOpeningElementName(jsxNode.openingElement)
        if (
          (skipImportCheck || isPrimerComponent(jsxNode.openingElement.name, sourceCode.getScope(jsxNode))) &&
          name === 'Tooltip' &&
          jsxNode.children
        ) {
          if (jsxNode.children.filter(child => child.type === 'JSXElement').length > 1) {
            context.report({
              node: jsxNode,
              messageId: 'singleChild',
            })
          } else {
            // Check if the child is interactive
            const errors = checkTriggerElement(jsxNode)

            if (errors) {
              for (const [_key, value] of errors.entries()) {
                context.report({
                  node: jsxNode,
                  messageId: value,
                })
              }
            }
          }
        }
      },
    }
  },
}
