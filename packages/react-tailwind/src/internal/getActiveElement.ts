export function getActiveElement(element: HTMLElement): Element | null {
  const root = element.getRootNode()
  const ShadowRoot = element.ownerDocument.defaultView?.ShadowRoot
  return ShadowRoot && root instanceof ShadowRoot ? root.activeElement : element.ownerDocument.activeElement
}
