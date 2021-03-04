export function* iterateFocusableElements(container: Element, reverse = false): Generator<HTMLElement, undefined, never> {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node =>
      node instanceof HTMLElement && node.tabIndex === -1 ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
  })
  let nextNode = reverse ? walker.lastChild() : walker.firstChild()
  while (nextNode instanceof HTMLElement) {
    yield nextNode
    nextNode = reverse ? walker.previousNode() : walker.nextNode()
  }
  return undefined
}
