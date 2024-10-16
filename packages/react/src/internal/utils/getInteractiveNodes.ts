const interactiveElements = [
  'a[href]',
  'button:not([disabled])',
  'summary',
  'select',
  'input:not([type=hidden])',
  'textarea',
  '[tabindex="0"]',
]

export function getInteractiveNodes(node: HTMLElement | null, ignoreSelectors?: string) {
  if (!node) return

  let interactiveNodes = Array.from(node.querySelectorAll(interactiveElements.join(', ')))

  if (ignoreSelectors) {
    interactiveNodes = interactiveNodes.filter(node => !node.matches(ignoreSelectors))
  }

  if (interactiveNodes.length || node.matches(interactiveElements.join(', '))) {
    return true
  }
}
