import React from 'react'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {getScrollContainer} from '../utils/scroll'

export function useRovingTabIndex({containerRef}: {containerRef: React.RefObject<HTMLElement>}) {
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

      return getNextFocusableElement(from, event) ?? from
    }
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

  // ArrowUp, ArrowDown, Home, and End behavior are the same regarless of element state
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

export function getVisibleElement(element: HTMLElement, direction: 'next' | 'previous'): HTMLElement | undefined {
  const root = element.closest('[role=tree]')

  if (!root) return

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, node => {
    if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP
    return node.getAttribute('role') === 'treeitem' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  })

  let current = walker.firstChild()

  while (current !== element) {
    current = walker.nextNode()
  }

  let next = direction === 'next' ? walker.nextNode() : walker.previousNode()

  // If next element is nested inside a collapsed subtree, continue iterating
  while (next instanceof HTMLElement && next.parentElement?.closest('[role=treeitem][aria-expanded=false]')) {
    next = direction === 'next' ? walker.nextNode() : walker.previousNode()
  }

  return next instanceof HTMLElement ? next : undefined
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
  const items = Array.from(root?.querySelectorAll('[role=treeitem]') || [])

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

function getNextPageElement(element: HTMLElement): HTMLElement | undefined {
  const root = element.closest('[role="tree"]')
  if (!root) {
    return
  }

  const items = Array.from(root.querySelectorAll('[role="treeitem"]')) as HTMLElement[]
  const scrollContainer = getScrollContainer(root)
  const visible = items.filter(item => {
    return isVisible(item.firstElementChild as HTMLElement, scrollContainer)
  })
  const pageSize = visible.length + 1
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
  const scrollContainer = getScrollContainer(root)
  const visible = items.filter(item => {
    return isVisible(item.firstElementChild as HTMLElement, scrollContainer)
  })
  const pageSize = visible.length + 1
  const page = Math.floor(items.indexOf(element) / pageSize)
  const offset = items.indexOf(element) - pageSize * page

  return items[Math.max(0, (page - 1) * pageSize + offset)]
}

/**
 * Determine the visibility of an element
 */
function isVisible(element: HTMLElement, scrollContainer?: Element | null): boolean {
  // If a scroll container is present, check to see if the element is visible
  // within it
  if (scrollContainer) {
    const elementTop = element.offsetTop
    const elementBottom = elementTop + element.clientHeight
    const parentTop = scrollContainer.scrollTop
    const parentBottom = parentTop + scrollContainer.clientHeight

    return elementTop >= parentTop && elementBottom <= parentBottom
  }

  // Otherwise, check to see if the element is visible in the viewport
  return isInViewport(element)
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
