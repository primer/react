const TREE_ITEM = '[role="treeitem"]'

/** Whether `element` is a tree item that belongs to `root` rather than to a tree nested inside it. */
export function isItemOf(root: Element, element: Element | null): element is HTMLElement {
  return (
    element instanceof HTMLElement &&
    element.getAttribute('role') === 'treeitem' &&
    element.closest('[role="tree"]') === root
  )
}

/** Every rendered item of `root` in document order. Collapsed subtrees are not rendered, so all are visible. */
export function getTreeItems(root: Element): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TREE_ITEM)).filter(item => isItemOf(root, item))
}

/**
 * The group holding an item's children. A list item owns its group directly; an item rendered as another element
 * sits next to its group inside a presentational list item.
 */
export function getOwnGroup(item: HTMLElement): HTMLElement | null {
  const direct = item.querySelector<HTMLElement>(':scope > [role="group"]')
  if (direct) return direct
  const wrapper = item.parentElement
  return wrapper?.getAttribute('role') === 'none' ? wrapper.querySelector<HTMLElement>(':scope > [role="group"]') : null
}

export function getFirstChildItem(item: HTMLElement): HTMLElement | null {
  return getOwnGroup(item)?.querySelector<HTMLElement>(TREE_ITEM) ?? null
}

export function getParentItem(item: HTMLElement): HTMLElement | null {
  const group = item.parentElement?.closest<HTMLElement>('[role="group"], [role="tree"]')
  if (!group || group.getAttribute('role') === 'tree') return null
  const owner = group.parentElement
  if (!owner) return null
  return owner.getAttribute('role') === 'treeitem' ? owner : owner.querySelector<HTMLElement>(`:scope > ${TREE_ITEM}`)
}

function getTextOfIds(element: Element, ids: string): string {
  return ids
    .split(/\s+/)
    .filter(Boolean)
    .map(id => element.ownerDocument.getElementById(id)?.textContent ?? '')
    .join(' ')
    .trim()
}

/** The name assistive technology announces for an item, used for typeahead and loading announcements. */
export function getAccessibleName(item: Element): string {
  const label = item.getAttribute('aria-label')
  if (label) return label
  const labelledBy = item.getAttribute('aria-labelledby')
  const labelledByText = labelledBy ? getTextOfIds(item, labelledBy) : ''
  return labelledByText || item.textContent.trim()
}

/** The text of an item's own label, without the shortcut hint that secondary actions append to its name. */
export function getLabelText(element: Element, ariaLabel: string | undefined, labelledBy: string): string {
  return ariaLabel ?? getTextOfIds(element, labelledBy)
}

function getScrollContainer(element: Element | null): Element | null {
  let current = element
  while (current && current !== current.ownerDocument.body) {
    const {overflowY} = window.getComputedStyle(current)
    if (current.scrollHeight > current.clientHeight && overflowY !== 'hidden' && overflowY !== 'clip') return current
    current = current.parentElement
  }
  return null
}

/** How many rows fit in the tree's scroll container, so Page Up and Page Down move by a screenful. */
export function getPageSize(root: Element, items: HTMLElement[]): number {
  // Rows have no height before layout, as in tests, so fall back to the default row height.
  const rowHeight = items[0]?.firstElementChild?.getBoundingClientRect().height || 32
  const viewportHeight = getScrollContainer(root)?.clientHeight ?? window.innerHeight
  return Math.max(1, Math.floor(viewportHeight / rowHeight))
}
