/**
 * Returns an iterator over all of the focusable elements within `container`.
 * Note: If `container` is itself focusable it will be included in the results.
 * @param container The container over which to find focusable elements.
 * @param reverse If true, iterate backwards through focusable elements.
 */
export function* iterateFocusableElements(
  container: Element,
  reverse = false
): Generator<HTMLElement, undefined, never> {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node =>
      node instanceof HTMLElement && node.tabIndex === -1 ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
  })
  let nextNode: Node | null = null;

  // If iterating in reverse, continue traversing down into the last child until we reach
  // a leaf DOM node
  if (reverse) {
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
    nextNode = reverse ? walker.previousNode() : walker.nextNode()
  }
  return undefined
}
