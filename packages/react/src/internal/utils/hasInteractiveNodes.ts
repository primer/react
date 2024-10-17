const nonValidSelectors = {
  disabled: '[disabled]',
  hidden: '[hidden]',
  inert: '[inert]',
  negativeTabIndex: '[tabindex="-1"]',
}

const interactiveElementsSelectors = [
  `a[href]`,
  `button`,
  'summary',
  'select',
  'input:not([type=hidden])',
  'textarea',
  '[tabindex="0"]',
  `audio[controls]`,
  `video[controls]`,
  `[contenteditable]`,
]

const interactiveElements = interactiveElementsSelectors.map(
  selector => `${selector}:not(${Object.values(nonValidSelectors).join('):not(')})`,
)

/**
 * Finds interactive nodes within the passed node.
 * If the node itself is interactive, or children within are, it will return true.
 *
 * @param node - The HTML element to search for interactive nodes in.
 * @param ignoreSelectors - A string of selectors to ignore when searching for interactive nodes. This is useful for
 * ignoring nodes that are conditionally interactive based on the return value of the function.
 * @returns {boolean | undefined}
 */
export function hasInteractiveNodes(node: HTMLElement | null, ignoreSelectors?: string) {
  if (!node || isNonValidInteractiveNode(node)) return

  // We only need to confirm if at least one interactive node exists.
  // If one does exist, we can abort early.

  const interactiveNodes = findInteractiveChildNodes(node, ignoreSelectors)

  if (interactiveNodes) {
    return true
  }
}

function isNonValidInteractiveNode(node: HTMLElement | null) {
  return node && node.matches('[disabled], [hidden], [inert]')
}

function findInteractiveChildNodes(node: HTMLElement | null, ignoreSelectors?: string) {
  if (!node) return

  const ignoreSelector = ignoreSelectors ? !node.matches(ignoreSelectors) : true

  if (node.matches(interactiveElements.join(', ')) && ignoreSelector) {
    return node
  }

  for (const child of node.children) {
    const interactiveNode = findInteractiveChildNodes(child as HTMLElement, ignoreSelectors)

    if (interactiveNode) return true
  }
}
