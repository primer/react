export function* iterateFocusableElements(container: Element): Generator<HTMLElement> {
  const iterator = document.createNodeIterator(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node =>
      node instanceof HTMLElement && node.tabIndex === -1 ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
  })
  let nextNode: HTMLElement | null = iterator.nextNode() as HTMLElement
  while (nextNode) {
    yield nextNode
    nextNode = iterator.nextNode() as HTMLElement | null
  }
}
