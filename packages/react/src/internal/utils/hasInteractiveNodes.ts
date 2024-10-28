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
export function hasInteractiveNodes(node: HTMLElement | null, ignoreNodes?: HTMLElement[]) {
  if (!node || isNonValidInteractiveNode(node)) return false

  // We only need to confirm if at least one interactive node exists.
  // If one does exist, we can abort early.

  const nodesToIgnore = ignoreNodes ? [node, ...ignoreNodes] : [node]
  const interactiveNodes = findInteractiveChildNodes(node, nodesToIgnore)

  return Boolean(interactiveNodes)
}

function isNonValidInteractiveNode(node: HTMLElement) {
  const nodeStyle = getComputedStyle(node)
  const isNonInteractive = node.matches('[disabled], [hidden], [inert]')
  const isHiddenVisually = nodeStyle.display === 'none' || nodeStyle.visibility === 'hidden'

  return isNonInteractive || isHiddenVisually
}

function findInteractiveChildNodes(node: HTMLElement | null, ignoreNodes: HTMLElement[]) {
  if (!node) return

  const ignoreSelector = ignoreNodes.find(elem => elem === node)
  const isNotValidNode = isNonValidInteractiveNode(node)

  if (node.matches(interactiveElements.join(', ')) && !ignoreSelector && !isNotValidNode) {
    return node
  }

  for (const child of node.children) {
    const interactiveNode = findInteractiveChildNodes(child as HTMLElement, ignoreNodes)

    if (interactiveNode) return true
  }
}
