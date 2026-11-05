import type React from 'react'
import {useEffect} from 'react'
import {isEditableElement} from '@primer/behaviors/utils'
import {getNextFocusableElement} from './useRovingTabIndex'

const TREE_ITEM = '[role="treeitem"]'
const CURRENT_TREE_ITEM = `${TREE_ITEM}[aria-current]:not([aria-current="false"])`
const TABBABLE_TREE_ITEM = `${TREE_ITEM}[tabindex="0"]`
// Elements other than treeitems that would otherwise be in the tab order. A single native selector
// match is much cheaper on large trees than walking every element with a JavaScript filter.
const NESTED_TABBABLE = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'iframe',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
]
  .map(selector => `${selector}:not(${TREE_ITEM}):not([tabindex="-1"])`)
  .join(',')
const NAVIGATION_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Backspace',
])

/**
 * Roving tabindex and arrow key navigation for `TreeView`.
 *
 * Items render `tabIndex={-1}` (or `0` for the item that is current when it mounts), so this hook
 * only has to pick one tab stop, keep it in sync with focus, and take nested controls out of the
 * tab order. It doesn't rewrite every treeitem on mount, which is what made `useFocusZone`
 * expensive for large trees.
 */
export function useTreeRovingTabIndex({
  containerRef,
  mouseDownRef,
  preventScroll = true,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  mouseDownRef?: React.RefObject<boolean>
  preventScroll?: boolean
}) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const container: HTMLElement = root

    let tabStop: HTMLElement | null = null

    function setTabStop(element: HTMLElement | null) {
      if (element === tabStop) return
      tabStop?.setAttribute('tabindex', '-1')
      element?.setAttribute('tabindex', '0')
      tabStop = element
    }

    // Same preference as `useRovingTabIndex`'s focusInStrategy: current item, then candidate, then first item.
    function getPreferredItem(candidate: HTMLElement | null = null) {
      return (
        container.querySelector<HTMLElement>(CURRENT_TREE_ITEM) ??
        candidate ??
        container.querySelector<HTMLElement>(TREE_ITEM)
      )
    }

    // Keep a single tab stop: nested controls and any other treeitem rendered as tabbable
    // (e.g. a `current` item mounted after the tab stop was chosen) leave the tab order.
    function removeFromTabOrder(root: Element) {
      if (root.matches(NESTED_TABBABLE) || (root !== tabStop && root.matches(TABBABLE_TREE_ITEM))) {
        root.setAttribute('tabindex', '-1')
      }
      for (const element of root.querySelectorAll(NESTED_TABBABLE)) element.setAttribute('tabindex', '-1')
      for (const element of root.querySelectorAll(TABBABLE_TREE_ITEM)) {
        if (element !== tabStop) element.setAttribute('tabindex', '-1')
      }
    }

    const activeElement = document.activeElement
    const activeTreeItem =
      activeElement instanceof HTMLElement &&
      container.contains(activeElement) &&
      activeElement.getAttribute('role') === 'treeitem'
        ? activeElement
        : null
    setTabStop(getPreferredItem(activeTreeItem))
    removeFromTabOrder(container)

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) removeFromTabOrder(node)
        }
      }
      // If the tab stop was removed (e.g. its parent collapsed), the tree must stay reachable by Tab.
      if (!tabStop || !container.contains(tabStop)) {
        tabStop = null
        setTabStop(getPreferredItem())
      }
    })
    observer.observe(container, {childList: true, subtree: true})

    function onFocusIn(event: FocusEvent) {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      const isTreeItem = target.getAttribute('role') === 'treeitem'

      // When focus enters the tree from elsewhere with the keyboard, move it to the current item.
      // A pointer focuses the clicked item; redirecting it would also prevent the chevron's toggle.
      const from = event.relatedTarget
      if (from instanceof Element && !container.contains(from) && !mouseDownRef?.current) {
        const preferred = getPreferredItem(isTreeItem ? target : null)
        if (preferred && preferred !== target) {
          preferred.focus({preventScroll})
          return
        }
      }

      if (isTreeItem) setTabStop(target)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || !NAVIGATION_KEYS.has(event.key)) return
      // Leave browser shortcuts such as Alt+ArrowLeft (Back) alone, like `Item`'s keydown handler.
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && (event.altKey || event.metaKey)) return

      const from = document.activeElement
      if (!(from instanceof HTMLElement)) return

      // This need to be in a try/catch to avoid errors in non-supported browsers
      try {
        if (from.closest('dialog:modal')) return
      } catch {
        // Don't return
      }

      if (from.getAttribute('role') !== 'treeitem') {
        // Keep focus on nested controls. Editable controls handle their own keys.
        if (!isEditableElement(from)) event.preventDefault()
        return
      }

      const next = getNextFocusableElement(from, event) ?? from
      next.focus({preventScroll})
      event.preventDefault()
    }

    container.addEventListener('focusin', onFocusIn)
    container.addEventListener('keydown', onKeyDown)
    return () => {
      observer.disconnect()
      container.removeEventListener('focusin', onFocusIn)
      container.removeEventListener('keydown', onKeyDown)
    }
  }, [containerRef, mouseDownRef, preventScroll])
}
