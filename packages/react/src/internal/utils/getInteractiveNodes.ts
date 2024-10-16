const interactiveElements = [
  'a[href]',
  'button:not([disabled])',
  'summary',
  'select',
  'input:not([type=hidden])',
  'textarea',
  '[tabindex="0"]',
]

export function getInteractiveNodes(node: HTMLElement | null) {
  if (!node) return

  const interactiveNodes = node.querySelectorAll(interactiveElements.join(', '))

  if (interactiveNodes.length || node.matches(interactiveElements.join(', '))) {
    return true
  }
}
