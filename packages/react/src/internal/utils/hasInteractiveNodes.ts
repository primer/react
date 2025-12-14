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

// Combined selector for fast querySelector check
const interactiveSelector = interactiveElements.join(', ')

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

  // Performance optimization: Use querySelectorAll with combined selector first
  // This avoids recursive getComputedStyle calls for each node
  const candidates = node.querySelectorAll<HTMLElement>(interactiveSelector)
  for (const candidate of candidates) {
    if (!nodesToIgnore.includes(candidate) && !isNonValidInteractiveNode(candidate)) {
      return true
    }
  }

  return false
}

// Cache for visibility checks to avoid repeated getComputedStyle calls during a single traversal
// Note: Only call getComputedStyle when CSS-based checks are insufficient
function isNonValidInteractiveNode(node: HTMLElement) {
  // Fast path: Check attribute-based states first (no style recalc needed)
  const isNonInteractive = node.matches('[disabled], [hidden], [inert]')
  if (isNonInteractive) return true

  // Only call getComputedStyle if attribute checks passed
  // This is necessary for display:none and visibility:hidden which aren't detectable via attributes
  const nodeStyle = getComputedStyle(node)
  const isHiddenVisually = nodeStyle.display === 'none' || nodeStyle.visibility === 'hidden'

  return isHiddenVisually
}
