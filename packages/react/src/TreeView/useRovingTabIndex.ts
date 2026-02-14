import type React from 'react'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {getScrollContainer} from '../utils/scroll'

export function useRovingTabIndex({
  containerRef,
  mouseDownRef,
}: {
  containerRef: React.RefObject<HTMLElement>
  mouseDownRef: React.RefObject<boolean>
}) {
  // TODO: Initialize focus to the aria-current item if it exists
  useFocusZone({
    containerRef,
    bindKeys:
      FocusKeys.ArrowVertical |
      FocusKeys.ArrowHorizontal |
      FocusKeys.HomeAndEnd |
      FocusKeys.Backspace |
      FocusKeys.PageUpDown,
    preventScroll: true,
    getNextFocusable: (direction, from, event) => {
      if (!(from instanceof HTMLElement)) return

      // Skip elements within a modal dialog
      // This need to be in a try/catch to avoid errors in
      // non-supported browsers
      try {
        if (from.closest('dialog:modal')) {
          return
        }
      } catch {
        // Don't return
      }

      return getNextFocusableElement(from, event) ?? from
    },
    focusInStrategy: () => {
      // Don't try to execute the focusInStrategy if focus is coming from a click.
      // The clicked row will receive focus correctly by default.
      // If a chevron is clicked, setting the focus through the focuszone will prevent its toggle.
      if (mouseDownRef.current) {
        return undefined
      }

      const currentItem = containerRef.current?.querySelector('[aria-current]')
      const firstItem = containerRef.current?.querySelector('[role="treeitem"]')

      // Focus the aria-current item if it exists
      if (currentItem instanceof HTMLElement) {
        return currentItem
      }

      // Otherwise, focus the activeElement if it's a treeitem
      if (
        document.activeElement instanceof HTMLElement &&
        containerRef.current?.contains(document.activeElement) &&
        document.activeElement.getAttribute('role') === 'treeitem'
      ) {
        return document.activeElement
      }

      // Otherwise, focus the first treeitem
      return firstItem instanceof HTMLElement ? firstItem : undefined
    },
  })
}

// DOM utilities used for focus management

export function getNextFocusableElement(activeElement: HTMLElement, event: KeyboardEvent): HTMLElement | undefined {
  const elementState = getElementState(activeElement)

  // Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboard-interaction-24
  switch (`${elementState} ${event.key}`) {
    case 'open ArrowRight':
      // Focus first child node
      return getFirstChildElement(activeElement)

    case 'open ArrowLeft':
      // Close node; don't change focus
      return

    case 'closed ArrowRight':
      // Open node; don't change focus
      return

    case 'closed ArrowLeft':
      // Focus parent element
      return getParentElement(activeElement)

    case 'end ArrowRight':
      // Do nothing
      return

    case 'end ArrowLeft':
      // Focus parent element
      return getParentElement(activeElement)
  }

  // ArrowUp, ArrowDown, Home, and End behavior are the same regardless of element state
  switch (event.key) {
    case 'ArrowUp':
      // Focus previous visible element
      return getVisibleElement(activeElement, 'previous')

    case 'ArrowDown':
      // Focus next visible element
      return getVisibleElement(activeElement, 'next')

    case 'Backspace':
      return getParentElement(activeElement)

    case 'Home':
      // Focus first visible element
      return getFirstElement(activeElement)

    case 'End':
      // Focus last visible element
      return getLastElement(activeElement)

    case 'PageUp':
      return getPreviousPageElement(activeElement)

    case 'PageDown':
      return getNextPageElement(activeElement)
  }
}

export function getElementState(element: HTMLElement): 'open' | 'closed' | 'end' {
  if (element.getAttribute('role') !== 'treeitem') {
    throw new Error('Element is not a treeitem')
  }

  switch (element.getAttribute('aria-expanded')) {
    case 'true':
      return 'open'
    case 'false':
      return 'closed'
    default:
      return 'end'
  }
}

/**
 * Find the next or previous visible treeitem using direct DOM traversal.
 *
 * PERFORMANCE: This is O(tree depth) instead of O(n) because it walks
 * siblings and parent/child edges directly, rather than creating a TreeWalker
 * that scans from the root to find the current element on every keystroke.
 *
 * NOTE: This relies on TreeView.SubTree unmounting its children when collapsed
 * (returning null when !isExpanded). Because collapsed subtree children are
 * never in the DOM, we can safely skip them by only entering children of nodes
 * with aria-expanded="true". If SubTree ever changes to keep collapsed children
 * mounted (e.g. via CSS display:none), this logic would need to add filtering
 * for items inside collapsed parents.
 */
export function getVisibleElement(element: HTMLElement, direction: 'next' | 'previous'): HTMLElement | undefined {
  if (direction === 'next') {
    return getNextVisibleElement(element)
  }
  return getPreviousVisibleElement(element)
}

function getNextVisibleElement(element: HTMLElement): HTMLElement | undefined {
  // If the current item is expanded, the next visible item is its first child
  if (element.getAttribute('aria-expanded') === 'true') {
    const firstChild = getFirstChildElement(element)
    if (firstChild) return firstChild
  }

  // Otherwise, walk up the tree looking for a next sibling
  let current: HTMLElement | undefined = element
  while (current) {
    const next = getNextSiblingTreeItem(current)
    if (next) return next

    // No next sibling at this level, try the parent's next sibling
    current = getParentElement(current)
  }

  return undefined
}

function getPreviousVisibleElement(element: HTMLElement): HTMLElement | undefined {
  const prev = getPreviousSiblingTreeItem(element)

  if (prev) {
    // Navigate to the deepest last visible descendant of the previous sibling
    return getDeepestLastDescendant(prev)
  }

  // No previous sibling, the parent is the previous visible element
  return getParentElement(element)
}

/**
 * Walk into expanded subtrees to find the deepest last visible descendant.
 * For example, if the last sibling is an expanded directory whose last child
 * is also an expanded directory, we drill all the way down.
 */
function getDeepestLastDescendant(element: HTMLElement): HTMLElement {
  if (element.getAttribute('aria-expanded') === 'true') {
    const lastChild = getLastChildTreeItem(element)
    if (lastChild) {
      return getDeepestLastDescendant(lastChild)
    }
  }
  return element
}

function getNextSiblingTreeItem(element: HTMLElement): HTMLElement | undefined {
  let sibling = element.nextElementSibling
  while (sibling) {
    if (sibling instanceof HTMLElement && sibling.getAttribute('role') === 'treeitem') {
      return sibling
    }
    sibling = sibling.nextElementSibling
  }
  return undefined
}

function getPreviousSiblingTreeItem(element: HTMLElement): HTMLElement | undefined {
  let sibling = element.previousElementSibling
  while (sibling) {
    if (sibling instanceof HTMLElement && sibling.getAttribute('role') === 'treeitem') {
      return sibling
    }
    sibling = sibling.previousElementSibling
  }
  return undefined
}

function getLastChildTreeItem(element: HTMLElement): HTMLElement | undefined {
  // Find the [role=group] child (the subtree container), then get its last treeitem
  for (let i = element.children.length - 1; i >= 0; i--) {
    const child = element.children[i]
    if (child instanceof HTMLElement && child.getAttribute('role') === 'group') {
      let lastChild = child.lastElementChild
      while (lastChild && !(lastChild instanceof HTMLElement && lastChild.getAttribute('role') === 'treeitem')) {
        lastChild = lastChild.previousElementSibling
      }
      return lastChild instanceof HTMLElement ? lastChild : undefined
    }
  }
  return undefined
}

export function getFirstChildElement(element: HTMLElement): HTMLElement | undefined {
  const firstChild = element.querySelector('[role=treeitem]')
  return firstChild instanceof HTMLElement ? firstChild : undefined
}

export function getParentElement(element: HTMLElement): HTMLElement | undefined {
  const group = element.closest('[role=group]')
  const parent = group?.closest('[role=treeitem]')
  return parent instanceof HTMLElement ? parent : undefined
}

export function getFirstElement(element: HTMLElement): HTMLElement | undefined {
  const root = element.closest('[role=tree]')
  const first = root?.querySelector('[role=treeitem]')
  return first instanceof HTMLElement ? first : undefined
}

export function getLastElement(element: HTMLElement): HTMLElement | undefined {
  const root = element.closest('[role=tree]')
  if (!root) return

  const items = Array.from(root.querySelectorAll('[role=treeitem]'))

  // If there are no items, return undefined
  if (items.length === 0) return

  let index = items.length - 1
  let last = items[index]

  // If last element is nested inside a collapsed subtree, continue iterating
  while (
    index > 0 &&
    last instanceof HTMLElement &&
    last.parentElement?.closest('[role=treeitem][aria-expanded=false]')
  ) {
    index -= 1
    last = items[index]
  }

  return last instanceof HTMLElement ? last : undefined
}

const defaultSize = {
  height: 32,
}

/**
 * Determine the page size for the given tree based on an item in the tree. We
 * estimate this size by trying to see how many items will fit in the given
 * tree. If the tree is within a scroll container, we will use the height of
 * that container. Otherwise, we'll use the current window height
 */
function getPageSize(root: Element, item: HTMLElement | null) {
  const scrollContainer = getScrollContainer(root)
  const {height: itemHeight} = item?.getBoundingClientRect() ?? defaultSize
  const availableHeight = scrollContainer?.clientHeight ?? window.innerHeight
  return Math.floor(availableHeight / itemHeight)
}

function getNextPageElement(element: HTMLElement): HTMLElement | undefined {
  const root = element.closest('[role="tree"]')
  if (!root) {
    return
  }

  const items = Array.from(root.querySelectorAll('[role="treeitem"]')) as HTMLElement[]
  if (items.length === 0) {
    return
  }

  const itemLabel = items[0].firstElementChild as HTMLElement
  const pageSize = getPageSize(root, itemLabel)
  const page = Math.floor(items.indexOf(element) / pageSize)
  const offset = items.indexOf(element) - pageSize * page

  return items[Math.min(items.length - 1, (page + 1) * pageSize + offset)]
}

function getPreviousPageElement(element: HTMLElement): HTMLElement | undefined {
  const root = element.closest('[role="tree"]')
  if (!root) {
    return
  }

  const items = Array.from(root.querySelectorAll('[role="treeitem"]')) as HTMLElement[]
  if (items.length === 0) {
    return
  }

  const itemLabel = items[0].firstElementChild as HTMLElement
  const pageSize = getPageSize(root, itemLabel)
  const page = Math.floor(items.indexOf(element) / pageSize)
  const offset = items.indexOf(element) - pageSize * page

  return items[Math.max(0, (page - 1) * pageSize + offset)]
}
