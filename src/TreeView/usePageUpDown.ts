import React from 'react'

/**
 * Manage the active element when the user presses `PageUp` or `PageDown`
 * while using the TreeView
 */
export function usePageUpDown(ref: React.RefObject<HTMLElement>) {
  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (ref.current === null) {
        return
      }

      // When pressing PageUp, look at treeitem's above the current active element
      // and find the first one that is not in the viewport. If one exists, focus it
      if (event.key === 'PageUp') {
        const items: HTMLElement[] = Array.from(ref.current.querySelectorAll('[role="treeitem"]'))
          .filter((item): item is HTMLElement => {
            if (item.nodeType !== Node.ELEMENT_NODE) {
              return false
            }

            const position = document.activeElement?.compareDocumentPosition(item)
            if (position === undefined) {
              return false
            }

            return !!(position & Node.DOCUMENT_POSITION_PRECEDING)
          })
          .reverse()

        for (const item of items) {
          if (!isInViewport(item)) {
            item.focus()
            break
          }
        }
      }

      // When pressing PageDown, look at treeitem's below the current active element
      // and find the first one that is not in the viewport. If one exists, focus it
      if (event.key === 'PageDown') {
        const items: HTMLElement[] = Array.from(ref.current.querySelectorAll('[role="treeitem"]')).filter(
          (item): item is HTMLElement => {
            if (item.nodeType !== Node.ELEMENT_NODE) {
              return false
            }

            const position = document.activeElement?.compareDocumentPosition(item)
            if (position === undefined) {
              return false
            }

            return !!(position & Node.DOCUMENT_POSITION_FOLLOWING)
          }
        )

        for (const item of items) {
          if (!isInViewport(item)) {
            item.focus()
            break
          }
        }
      }
    },
    [ref]
  )

  return {
    onKeyDown
  }
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
