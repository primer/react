/**
 * Returns the accessible name of an element
 */
export function getAccessibleName(element: Element) {
  const label = element.getAttribute('aria-label')
  const labelledby = element.getAttribute('aria-labelledby')

  if (label) return label
  if (labelledby) return document.getElementById(labelledby)?.textContent ?? ''
  return element.textContent
}
