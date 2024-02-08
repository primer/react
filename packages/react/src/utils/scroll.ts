/**
 * Returns the nearest scrollable parent of the element or `null` if the element
 * is not contained in a scrollable element.
 */
export function getScrollContainer(element: Element | null): Element | null {
  if (!element || element === document.body) {
    return null
  }

  return isScrollable(element) ? element : getScrollContainer(element.parentElement)
}

/** Returns `true` if the element is scrollable */
function isScrollable(element: Element) {
  const hasScrollableContent = element.scrollHeight > element.clientHeight

  return hasScrollableContent && !(window.getComputedStyle(element).overflowY.indexOf('hidden') !== -1)
}
