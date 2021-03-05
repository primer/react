/**
 * Options to the tabbable elements iterator
 */
export interface IterateTabbableOptions {
  /**
   * (Default: false) Iterate through tabbable elements in reverse-order
   */
  reverse?: boolean

  /**
   * (Default: false) Perform additional checks to determine tabbability
   * which may adversely affect app performance.
   */
  strict?: boolean
}

/**
 * Returns an iterator over all of the tabbable elements within `container`.
 * Note: If `container` is itself tabbable it will be included in the results.
 * @param container The container over which to find tabbable elements.
 * @param reverse If true, iterate backwards through tabbable elements.
 */
export function* iterateTabbableElements(
  container: Element,
  options: IterateTabbableOptions = {}
): Generator<HTMLElement, undefined, never> {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node =>
      node instanceof HTMLElement && isTabbable(node, options.strict ?? false)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP
  })
  let nextNode: Node | null = null

  // If iterating in reverse, continue traversing down into the last child until we reach
  // a leaf DOM node
  if (options.reverse) {
    let lastChild = walker.lastChild()
    while (lastChild) {
      nextNode = lastChild
      lastChild = walker.lastChild()
    }
  } else {
    nextNode = walker.firstChild()
  }
  while (nextNode instanceof HTMLElement) {
    yield nextNode
    nextNode = options.reverse ? walker.previousNode() : walker.nextNode()
  }
  return undefined
}

/**
 * Determines whether the given element is tabbable. If `strict` is true, we may
 * perform additional checks that require a reflow (less performant)
 * @param elem
 * @param strict
 */
export function isTabbable(elem: HTMLElement, strict = false): boolean {
  const tabIndexInert = elem.tabIndex < 0
  const disabledAttrInert = elem.getAttribute('disabled') != null
  const hiddenInert = elem.hidden
  const hiddenInputInert = elem instanceof HTMLInputElement && elem.type === 'hidden'

  if (tabIndexInert || disabledAttrInert || hiddenInert || hiddenInputInert) {
    return false
  }

  if (strict) {
    const sizeInert = elem.offsetWidth === 0 || elem.offsetHeight === 0
    const visibilityInert = getComputedStyle(elem).visibility === 'hidden'
    const clientRectsInert = elem.getClientRects().length === 0;
    if (sizeInert || visibilityInert || clientRectsInert) {
      return false
    }
  }

  return true
}
